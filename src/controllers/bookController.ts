import { Request, Response } from 'express';
import { bookModel } from '../models/bookModel';
import { connect, disconnect } from '../repository/database';

// CRUD - create, read/get, update, delete

/**
 * Creates a new book in the data source based on the request body
 * @param req 
 * @param res 
 */

export async function createBook(req: Request, res: Response): Promise<void> {

    const data = req.body;

    try {
        await connect();

        const book = new bookModel(data);
        const result = await book.save();

        res.status(201).send(result);
    }
    catch (error) {
        res.status(500).send("Error creating a book. Error: " + error);
    }
    finally {
        await disconnect();
    }
}

/**
 * Retrives all books from the data source and sends them in the response
 * @param req 
 * @param res 
 */
export async function getAllBooks(req: Request, res: Response) {

    try {
        await connect();

        const result = await bookModel.find({});

        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send("Error retrieving books. Error: " + error);
    }
    finally {
        await disconnect();
    }
}


/**
 * Retrives a book by its ID from the data source and sends it in the response
 * @param req 
 * @param res 
 */
export async function getBooksById(req: Request, res: Response) {

    try {
        await connect();

        const id = req.params.id;
        const result = await bookModel.find({ _id: id });

        res.status(200).send(result);
    }
    catch (error) {
        res.status(500).send("Error retrieving book by ID. Error: " + error);
    }
    finally {
        await disconnect();
    }
}


/**
 * Updates a book by its ID in the data source based on the request body
 * @param req 
 * @param res 
 */
export async function updateBookById(req: Request, res: Response) {

    const id = req.params.id;

    try {
        await connect();

        const result = await bookModel.findByIdAndUpdate(id, req.body);

        if (!result) {
            res.status(404).send('Cannot update book with ud=' + id);
        }
        else {
            res.status(200).send('Book was succesfully updated.');
        }
    }
    catch (error) {
        res.status(500).send("Error updating book by ID. Error: " + error);
    }
    finally {
        await disconnect();
    }
}


/**
 * Deletes a book by its ID from the data source
 * @param req 
 * @param res 
 */
export async function deleteBookById(req: Request, res: Response) {

    const id = req.params.id;

    try {
        await connect();

        const result = await bookModel.findByIdAndDelete(id);

        if (!result) {
            res.status(404).send('Cannot delete book with id=' + id);
        }
        else {
            res.status(200).send('Book was succesfully deleted.');
        }
    }
    catch (error) {
        res.status(500).send("Error deleting book by ID. Error: " + error);
    }
    finally {
        await disconnect();
    }
}