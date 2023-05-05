import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  timestamps: true,
})
export class Book {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  price: number;

  @Prop()
  description: string;

  @Prop()
  content: string;
}

export const BookSchema = SchemaFactory.createForClass(Book);
