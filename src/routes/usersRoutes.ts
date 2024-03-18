// src/routes/bookRoutes.ts

import express, { Request, Response } from 'express';
import { getRepository } from 'typeorm';
//import { Book } from '../models/Book';

const usersRouter = express.Router();
//const bookRepository = getRepository(Book);

usersRouter.get('/', async (req: Request, res: Response) => {
  try {
    res.send('here are users');
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

/*
router.get('/test', async (req: Request, res: Response) => {
  try {
    const books = await bookRepository.find();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/create', async (req: Request, res: Response) => {
  try {
    const { title, author, isbn } = req.body;
    const book = new Book();
    book.title = title;
    book.author = author;
    book.isbn = isbn;
    await bookRepository.save(book);
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
});
*/
// Implement other CRUD operations similarly

export default usersRouter;
