import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BookService } from './book.service';
import { CreateBookDto } from './dto/createBook.dto';
import { UpdateBookDto } from './dto/updateBook.dto copy';
import { Query as ExpressQurey } from 'express-serve-static-core';

@UseGuards(AuthGuard())
@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Get()
  getBooks(@Query() query: ExpressQurey) {
    return this.bookService.findAllBook(query);
  }

  @Get(':id')
  getOneBook(@Param('id') id: string) {
    return this.bookService.findOneBook(id);
  }

  @Post()
  createBook(@Body() createBookDto: CreateBookDto) {
    return this.bookService.createBook(createBookDto);
  }

  @Patch(':id')
  updateBook(@Body() updateBookDto: UpdateBookDto, @Param('id') id: string) {
    return this.bookService.updateBook(id, updateBookDto);
  }

  @Delete(':id')
  deleteBook(@Param('id') id: string) {
    return this.bookService.deleteBook(id);
  }
}
