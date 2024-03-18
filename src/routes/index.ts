import express from 'express';
import usersRouter from './usersRoutes';
import booksRouter from './booksRoutes';

const router = express.Router();

//router.use('/users', usersRouter);
router.use('/books', booksRouter);

export default router;