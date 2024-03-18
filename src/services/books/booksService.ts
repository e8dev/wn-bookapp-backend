import { Like } from 'typeorm';
import { appDataSource } from '../../database/connection';
import { Book } from '../../models/Book';

export class BookService {
  private bookRepository = appDataSource.getRepository(Book);

  async getAllBooks(): Promise<Book[]> {
    try {
      const books = await this.bookRepository.find();
      return books;
    } catch (error) {
      throw new Error('Error fetching all books');
    }
  }

  async filterBooks(filterCriteria: any, offset: number, limit: number): Promise<{ data: Book[], total: number }> {
    try {
      const [books, total] = await this.bookRepository.findAndCount({
        where: filterCriteria,
        skip: offset,
        take: limit
      });
      return { data: books, total: total };
    } catch (error) {
      throw new Error('Error filtering books');
    }
  }

  async getByID(id: string){
    try {
      const book = await this.bookRepository.findOneBy({id: id});
      return book;
    } catch (error) {
      throw new Error('Error filtering books');
    }
  }

  async addBook(title: string, author: string, isbn: string): Promise<Book> {
    try {
      const newBook = this.bookRepository.create({
        title,
        author,
        isbn
      });

      await this.bookRepository.save(newBook);

      return newBook;
    } catch (error) {
      throw new Error('Error adding book');
    }
  }

  async editBook(id: string, updatedBookData: Partial<Book>): Promise<Book | null> {
    try {
      const bookToUpdate = await this.bookRepository.findOneBy({id: id});
      if (!bookToUpdate) {
        return null; // Book not found
      }

      const updatedBook = await this.bookRepository.save({ ...bookToUpdate, ...updatedBookData });
      return updatedBook;
    } catch (error) {
      throw new Error('Error editing book');
    }
  }

  async deleteBook(id: string): Promise<void> {
    try {
      const bookToRemove = await this.bookRepository.findOneBy({id: id});
      if (!bookToRemove) {
        throw new Error('Book not found');
      }

      await this.bookRepository.remove(bookToRemove);
    } catch (error) {
      throw new Error('Error deleting book');
    }
  }


}