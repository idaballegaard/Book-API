import { Schema, model } from 'mongoose';
import { Book } from '../interfaces/book';

const bookSchema = new Schema<Book>({
    title: { type: String, required: true, min: 1, max: 255 },
    description: { type: String, required: true, min: 1, max: 2048 },
    author: { type: String, required: true, min: 1, max: 255 },
    publishedDate: { type: Date, required: true },
    pages: { type: Number, required: true, min: 1 },
    genre: { type: String, required: true, min: 1, max: 100 },
    rating: { type: Number, required: true, min: 0, max: 5 },
    imageUrl: { type: String, required: false, max: 1024 },
    _reviewedBy: { type: String, ref: 'User', required: false }
});

export const bookModel = model<Book>('Book', bookSchema);