import { User } from './user';

export interface Book extends Document {
    id: string;
    title: string;
    description: string;
    author: string;
    publishedDate: Date;
    pages: number;
    genre: string;
    rating: number;
    imageUrl: string;
    _reviewedBy: User['id'];
};