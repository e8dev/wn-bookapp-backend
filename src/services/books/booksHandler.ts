// src/handlers/booksHandler.ts

import { Request, Response } from 'express';
import { BookService } from './booksService';

const bookService = new BookService();

interface IStandardResponse {
  success: boolean;
  data: any;
  msg: string;
}

function errorResponse(res: Response, error_external: string, error_internal: string){

  console.error('Error:', error_internal);
  return res.status(500).json({
    success: false,
    data: null,
    msg: error_external
   });

}

function successResponse(res: Response, data: any){

  const responseObj: IStandardResponse = {
    success: true,
    data: data,
    msg: ""
   }

  return res.json(responseObj);

}

export async function listBooks(req: Request, res: Response) {
  try {
    const { author, title, isbn, page, pageSize } = req.query;

    const filterCriteria: any = {};
    if (author) {
      filterCriteria.author = author.toString();
    }
    if (title) {
      filterCriteria.title = title.toString();
    }
    if (isbn) {
      filterCriteria.isbn = isbn.toString();
    }

    const defaultPageSize = 2;
    const pageNumber: number = parseInt(page as string) || 1;
    const limit: number = parseInt(pageSize as string) || defaultPageSize;
    const offset: number = (pageNumber - 1) * limit;

    const result = await bookService.filterBooks(filterCriteria, offset, limit);

    const totalPages = Math.ceil(result.total / defaultPageSize);
    
    //return data and pagination params
    successResponse(res, {
      books: result.data,
      pagination: {
        totalPages: totalPages,
        currentPage: page
      }
    });

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error);
  }
}

export async function getBookByID(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await bookService.getByID(id);
    successResponse(res, result);
    
  } catch (error: any) {
    errorResponse(res, 'Internal server error', error);
  }
}

export async function addBook(req: Request, res: Response) {
  try {
    const { title, author, isbn } = req.body;
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author, and ISBN are required' });
    }

    const newBook = await bookService.addBook(title, author, isbn);
    successResponse(res, newBook);

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error);
  }
}

export async function editBook(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, author, isbn } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title, author are required' });
    }

    const updatedBook = await bookService.editBook(id, { title, author, isbn });
    successResponse(res, updatedBook);

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error);
  }
}

export async function deleteBook(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Book ID parameter is required' });
    }

    await bookService.deleteBook(id);
    //res.status(204).send();
    successResponse(res, null);

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error);
  }
}