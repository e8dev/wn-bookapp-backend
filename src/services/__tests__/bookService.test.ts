// src/services/__tests__/bookService.test.ts

import { ILike } from 'typeorm';
import { BookService } from '../books/booksService';
import { Book } from '../../models/Book';

// Mock appDataSource and Book
jest.mock('../../database/connection', () => ({
  appDataSource: {
    getRepository: jest.fn(() => ({
      find: jest.fn(),
      findAndCount: jest.fn(),
      findOne: jest.fn(),
      findOneBy: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      remove: jest.fn()
    }))
  }
}));

// Initialize BookService instance
const bookService = new BookService();

describe('BookService', () => {
  describe('getAllBooks', () => {
    it('should fetch all books', async () => {
      // Mock data
      const mockBooks: Book[] = [
        { id: '1', title: 'Book 1', author: 'Author 1', isbn: '1234567890', created_at: new Date() },
        { id: '2', title: 'Book 2', author: 'Author 2', isbn: '0987654321', created_at: new Date() }
      ];
  
      // Mock repository method
      (bookService as any).bookRepository.find.mockResolvedValue(mockBooks);
  
      // Call the method
      const result = await bookService.getAllBooks();
  
      // Assertions
      expect(result).toEqual(mockBooks);
      expect((bookService as any).bookRepository.find).toHaveBeenCalledTimes(1);
    });
  
    it('should throw an error if fetching fails', async () => {
      // Mock repository method to throw an error
      (bookService as any).bookRepository.find.mockRejectedValue(new Error('Database error'));
  
      // Call the method and expect it to throw an error
      await expect(bookService.getAllBooks()).rejects.toThrow('Error fetching all books');
    });
  });
  

  describe('filterBooks', () => {
    it('should filter books based on provided criteria', async () => {
      // Mock data
      const filterCriteria = { title: 'Book' };
      const mockFilteredBooks: Book[] = [
        { id: '1', title: 'Book 1', author: 'Author 1', isbn: '1234567890', created_at: new Date() },
        { id: '2', title: 'Book 2', author: 'Author 2', isbn: '1234567891', created_at: new Date() }
      ];
  
      // Mock repository method
      (bookService as any).bookRepository.findAndCount.mockResolvedValue([mockFilteredBooks, mockFilteredBooks.length]);
  
      // Call the method
      const result = await bookService.filterBooks(filterCriteria, 0, 10);
  
      // Assertions
      expect(result.data).toEqual(mockFilteredBooks);
      expect(result.total).toBe(mockFilteredBooks.length);
      expect((bookService as any).bookRepository.findAndCount).toHaveBeenCalledWith({
        where: [{ title: ILike(`${filterCriteria.title}%`) }],
        skip: 0,
        take: 10,
        order: { created_at: 'DESC' }
      });
    });
  
    it('should throw an error if filtering fails', async () => {
      // Mock repository method to throw an error
      (bookService as any).bookRepository.findAndCount.mockRejectedValue(new Error('Database error'));
  
      // Call the method and expect it to throw an error
      await expect(bookService.filterBooks({ title: 'Book' }, 0, 10)).rejects.toThrow('Error filtering books');
    });
  });

  describe('getByID', () => {
    it('should fetch a book by its ID', async () => {
      // Mock data
      const mockBook: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        isbn: '1234567890',
        created_at: new Date()
      };
  
      // Mock repository method
      (bookService as any).bookRepository.findOne.mockResolvedValue(mockBook);
  
      // Call the method
      const result = await bookService.getByID('1');
  
      // Assertions
      expect(result).toEqual(mockBook);
      expect((bookService as any).bookRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }});
    });
  
    it('should return null if book is not found', async () => {
      // Mock repository method to return null
      (bookService as any).bookRepository.findOne.mockResolvedValue(null);
  
      // Call the method
      const result = await bookService.getByID('1');
  
      // Assertions
      expect(result).toBeNull();
      expect((bookService as any).bookRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }});
    });
  
    it('should throw an error if fetching fails', async () => {
      // Mock repository method to throw an error
      (bookService as any).bookRepository.findOne.mockRejectedValue(new Error('Database error'));
  
      // Call the method and expect it to throw an error
      await expect(bookService.getByID('1')).rejects.toThrow('Error filtering books');
    });
  });
  

  describe('addBook', () => {
    it('should add a new book', async () => {
      // Mock data
      const newBookData = {
        title: 'New Book',
        author: 'New Author',
        isbn: '9876543210'
      };

      // Mock repository method
      const createdBook = {
        ...newBookData,
        created_at: expect.any(Date), // Adjusted expectation for created_at
        id: expect.any(String)        // Adjusted expectation for id
      };

      (bookService as any).bookRepository.create.mockReturnValue(createdBook);
      (bookService as any).bookRepository.save.mockResolvedValue(createdBook);

      // Call the method
      const result = await bookService.addBook(newBookData.title, newBookData.author, newBookData.isbn);

      // Assertions
      expect(result.title).toEqual(newBookData.title);
      expect(result.author).toEqual(newBookData.author);
      expect(result.isbn).toEqual(newBookData.isbn);
      expect(result.created_at).toEqual(expect.any(Date));
      expect(result.id).toEqual(expect.any(String));
      expect((bookService as any).bookRepository.create).toHaveBeenCalledWith(newBookData);
      expect((bookService as any).bookRepository.save).toHaveBeenCalledWith(createdBook);
    });

    it('should throw an error if adding fails', async () => {
      // Mock repository method to throw an error
      (bookService as any).bookRepository.create.mockImplementation(() => { throw new Error('Database error'); });

      // Call the method and expect it to throw an error
      await expect(bookService.addBook('New Book', 'New Author', '9876543210')).rejects.toThrow('Error adding book');
    });
  });


  describe('editBook', () => {
    it('should edit an existing book', async () => {
      // Mock data
      const bookToUpdate: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        isbn: '1234567890',
        created_at: new Date()
      };
      const updatedBookData: Partial<Book> = { title: 'Updated Book 1' };
      const updatedBook: Book = { ...bookToUpdate, ...updatedBookData };

      // Mock repository methods
      (bookService as any).bookRepository.findOneBy.mockResolvedValue(bookToUpdate);
      (bookService as any).bookRepository.save.mockResolvedValue(updatedBook);

      // Call the method
      const result = await bookService.editBook('1', updatedBookData);

      // Assertions
      expect(result).toEqual(updatedBook);
      expect((bookService as any).bookRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect((bookService as any).bookRepository.save).toHaveBeenCalledWith({ ...bookToUpdate, ...updatedBookData });
    });

    it('should return null if book to edit is not found', async () => {
      // Mock repository method to return null
      (bookService as any).bookRepository.findOneBy.mockImplementation(async (condition: any) => {
        if (condition.id === '1') {
          return null;
        }
        return {};
      });

      // Call the method
      const result = await bookService.editBook('1', { title: 'Updated Book 1' });

      // Assertions
      expect(result).toBeNull();
      expect((bookService as any).bookRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
    });

    it('should throw an error if editing fails', async () => {
      // Mock repository method to throw an error
      (bookService as any).bookRepository.findOneBy.mockResolvedValue({});
      (bookService as any).bookRepository.save.mockImplementation(() => { throw new Error('Database error'); });

      // Call the method and expect it to throw an error
      await expect(bookService.editBook('1', { title: 'Updated Book 1' })).rejects.toThrow('Error editing book');
    });
    
  });

  describe('deleteBook', () => {
    it('should delete an existing book', async () => {
      // Mock data
      const bookToRemove: Book = {
        id: '1',
        title: 'Book 1',
        author: 'Author 1',
        isbn: '1234567890',
        created_at: new Date()
      };

      // Mock repository method
      (bookService as any).bookRepository.findOneBy.mockResolvedValue(bookToRemove);
      (bookService as any).bookRepository.remove.mockResolvedValue(bookToRemove);

      // Call the method
      await bookService.deleteBook('1');

      // Assertions
      expect((bookService as any).bookRepository.findOneBy).toHaveBeenCalledWith({ id: '1' });
      expect((bookService as any).bookRepository.remove).toHaveBeenCalledWith(bookToRemove);
    });

    it('should throw an error if deleting fails', async () => {
      // Mock repository method to throw an error
      (bookService as any).bookRepository.findOneBy.mockResolvedValue({});
      (bookService as any).bookRepository.remove.mockImplementation(() => { throw new Error('Database error'); });

      // Call the method and expect it to throw an error
      await expect(bookService.deleteBook('1')).rejects.toThrow('Error deleting book');
    });
    
  });



});
