import express from 'express';
import booksRouter from './booksRoutes';

const router = express.Router();

router.use('/books', booksRouter);

export default router;