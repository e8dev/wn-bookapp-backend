import express from 'express';
import { listBooks, getBookByID, addBook, editBook, deleteBook } from '../services/books/booksHandler';

const booksRouter = express.Router();

// Endpoint to list all books
booksRouter.get('/list', listBooks);

// Endpoint to add a new book
booksRouter.post('/add', addBook);

// Endpoint to get details of a book by ID
booksRouter.get('/details/:id', getBookByID);

// Endpoint to edit details of a book by ID
booksRouter.post('/item/:id/edit', editBook);

// Endpoint to delete a book by ID
booksRouter.delete('/item/:id', deleteBook);

export default booksRouter;
