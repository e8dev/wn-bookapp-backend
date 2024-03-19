import { Request, Response } from 'express';
import { BookService } from './booksService';

const bookService = new BookService();

interface IStandardResponse {
  success: boolean; // Indicator of whether the request was successful
  data: any; // Data returned in the response
  msg: string; // Message accompanying the response
}

// Function to handle error responses
function errorResponse(res: Response, error_external: string, error_internal: string) {
  console.error('Error:', error_internal); // Log the internal error
  return res.status(500).json({
    success: false,
    data: null,
    msg: error_external // Send external error message in the response
  });
}

// Function to handle successful responses
function successResponse(res: Response, data: any) {
  const responseObj: IStandardResponse = {
    success: true,
    data: data,
    msg: "" // Set empty message for successful response
  };

  return res.json(responseObj); // Send success response
}

// Function to list books with pagination and filtering
export async function listBooks(req: Request, res: Response) {
  try {
    const { search_q, search_item, page } = req.query;

    const filterCriteria: any = {};
    if (search_q && (search_item === "author" || search_item === "title" || search_item === "isbn")) {
      filterCriteria[search_item] = search_q.toString();
    }

    const defaultPageSize = 2;
    const pageNumber: number = parseInt(page as string) || 1;
    const limit: number = defaultPageSize;
    const offset: number = (pageNumber - 1) * limit;

    const result = await bookService.filterBooks(filterCriteria, offset, limit);

    const totalPages = Math.ceil(result.total / defaultPageSize);
    
    successResponse(res, {
      books: result.data,
      pagination: {
        totalPages: totalPages,
        currentPage: page
      }
    });

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error); // Send error response
  }
}

// Function to get a book by its ID
export async function getBookByID(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const result = await bookService.getByID(id);
    successResponse(res, result); // Send success response
    
  } catch (error: any) {
    errorResponse(res, 'Internal server error', error); // Send error response
  }
}

// Function to add a new book
export async function addBook(req: Request, res: Response) {
  try {
    const { title, author, isbn } = req.body;
    if (!title || !author || !isbn) {
      return res.status(400).json({ message: 'Title, author, and ISBN are required' });
    }

    const newBook = await bookService.addBook(title, author, isbn);
    successResponse(res, newBook); // Send success response

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error); // Send error response
  }
}

// Function to edit an existing book
export async function editBook(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { title, author, isbn } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: 'Title, author are required' });
    }

    const updatedBook = await bookService.editBook(id, { title, author, isbn });
    successResponse(res, updatedBook); // Send success response

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error); // Send error response
  }
}

// Function to delete an existing book
export async function deleteBook(req: Request, res: Response) {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Book ID parameter is required' });
    }

    await bookService.deleteBook(id);
    successResponse(res, null); // Send success response

  } catch (error: any) {
    errorResponse(res, 'Internal server error', error); // Send error response
  }
}
