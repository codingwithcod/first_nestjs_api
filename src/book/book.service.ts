import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto copy';
import { Book } from './schemas/book.schema';
import { Query } from 'express-serve-static-core';

@Injectable()
export class BookService {
  constructor(
    @InjectModel(Book.name)
    private bookModel: mongoose.Model<Book>,
  ) {}

  async findAllBook(query: Query) {
    const resPerPage = 3;
    const currentPage = Number(query.page) || 1;
    const skip = Math.abs(resPerPage * (currentPage - 1));

    const keyword = query.keyword
      ? {
          $or: [
            {
              title: {
                $regex: query.keyword,
              },
            },

            {
              description: {
                $regex: query.keyword,
              },
            },
            {
              content: {
                $regex: query.keyword,
              },
            },
          ],
        }
      : {};

    const books = await this.bookModel
      .find({ ...keyword })
      .limit(resPerPage)
      .skip(skip);
    if (books.length === 0) {
      throw new NotFoundException('Books not found');
    }
    return { succes: true, message: ' books fetched', books };
  }

  async findOneBook(id: string) {
    const book = await this.bookModel.findById(id);
    if (!book) {
      throw new NotFoundException('This book no longer exists');
    }
    return { succes: true, message: ' book fetched', book };
  }

  async createBook(createBookDto: CreateBookDto) {
    const newBook = await this.bookModel.create(createBookDto);
    return newBook;
  }

  async updateBook(id: string, updateBookDto: UpdateBookDto) {
    const isValidId = mongoose.isValidObjectId(id);
    if (!isValidId) {
      throw new BadRequestException('please inter a valid id');
    }
    const updatedBook = await this.bookModel.findByIdAndUpdate(
      id,
      updateBookDto,
      { new: true },
    );

    if (!updatedBook) {
      throw new NotFoundException('Book not found for update');
    }
    return { succes: true, message: ' book fetched', updatedBook };
  }

  async deleteBook(id: string) {
    const book = await this.bookModel.findByIdAndDelete(id);
    if (!book) {
      throw new NotFoundException('Book not found for Delete');
    }
    return { succes: true, message: ' book fetched', book };
  }
}
