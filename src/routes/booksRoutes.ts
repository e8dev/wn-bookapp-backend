// src/routes/bookRoutes.ts

import express from 'express';
import { listBooks, getBookByID, addBook, editBook, deleteBook } from '../services/books/booksHandler';

const booksRouter = express.Router();

booksRouter.get('/list', listBooks);
booksRouter.post('/add', addBook);
booksRouter.get('/details/:id', getBookByID);
booksRouter.post('/item/:id/edit', editBook);
booksRouter.delete('/item/:id', deleteBook);

export default booksRouter;
