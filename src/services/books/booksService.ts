import { ILike, FindOptionsWhere } from 'typeorm';
import { appDataSource } from '../../database/connection';
import { Book } from '../../models/Book';

export class BookService {
  private bookRepository = appDataSource.getRepository(Book);

  async getAllBooks(): Promise<Book[]> {
    try {
      const books = await this.bookRepository.find({
        order: { created_at: 'DESC' }
      });
      return books;
    } catch (error) {
      throw new Error('Error fetching all books');
    }
  }

  async filterBooks(filterCriteria: any, offset: number, limit: number): Promise<{ data: Book[], total: number }> {
    try {
      let whereCondition: any = [];
      for (const [key, value] of Object.entries(filterCriteria)) {
        whereCondition.push({ [key]: ILike(`${value}%`) });
      }
      const [books, total] = await this.bookRepository.findAndCount({
        where: whereCondition,
        skip: offset,
        take: limit,
        order: { created_at: 'DESC' }
      });
      return { data: books, total: total };
    } catch (error) {
      throw new Error('Error filtering books');
    }
  }

  async getByID(id: string){
    try {
      const book = await this.bookRepository.findOne({ where: { id }});
      return book || null; // Return null if book is not found
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

      // Update book data
      Object.assign(bookToUpdate, updatedBookData);

      const updatedBook = await this.bookRepository.save(bookToUpdate);
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