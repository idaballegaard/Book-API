import { Request, Response } from 'express';
import { bookModel } from '../models/bookModel';
import { connect, disconnect } from '../repository/database';

// CRUD - create, read/get, update, delete

/**
 * Creates a new book in the data source based on the request body
 * @param req 
 * @param res 
 */

export async function createBook(req: Request, res: Response): promise<void> {

    const data = req.body;

    try {
        await connect();

        const book = new bookModel(data);
        const result = await book.save();

        res.status(201).send(result);
    }
    catch {
        res.status(500).send("Error creating a book");
    }
    finally {
        await disconnect();
    }
}