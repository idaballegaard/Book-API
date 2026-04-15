import { Request, Response } from "express";
import { bookModel } from "../models/bookModel";
import { buildDynamicQuery } from "./dynamicQueryBuilder";

// CRUD - create, read/get, update, delete

/**
 * Creates a new book in the data source based on the request body
 * @param req
 * @param res
 */

export async function createBook(req: Request, res: Response): Promise<void> {
  const data = req.body;

  try {
    const book = new bookModel(data);
    const result = await book.save();

    res.status(201).send(result);
  } catch (error) {
    res.status(500).send("Error creating a book. Error: " + error);
  }
}

/**
 * Retrives all books from the data source and sends them in the response
 * @param req
 * @param res
 */
export async function getAllBooks(req: Request, res: Response) {
  try {
    const result = await bookModel.find({});

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error retrieving books. Error: " + error);
  }
}

/**
 * Retrives a book by its ID from the data source and sends it in the response
 * @param req
 * @param res
 */
export async function getBooksById(req: Request, res: Response) {
  try {
    const id = req.params.id;
    const result = await bookModel.find({ _id: id });

    res.status(200).send(result);
  } catch (error) {
    res.status(500).send("Error retrieving book by ID. Error: " + error);
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
    const result = await bookModel.findByIdAndUpdate(id, req.body);

    if (!result) {
      res.status(404).send("Cannot update book with ud=" + id);
    } else {
      res.status(200).send("Book was succesfully updated.");
    }
  } catch (error) {
    res.status(500).send("Error updating book by ID. Error: " + error);
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
    const result = await bookModel.findByIdAndDelete(id);

    if (!result) {
      res.status(404).send("Cannot delete book with id=" + id);
    } else {
      res.status(200).send("Book was succesfully deleted.");
    }
  } catch (error) {
    res.status(500).send("Error deleting book by ID. Error: " + error);
  }
}

/**
 * Retrieves a BOOK by query from the database
 * @param req
 * @param res
 */
export async function getBooksByQuery(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // api/books/key/value

    const key: any = req.params.key;
    const value: any = req.params.value;

    const result = await bookModel.find({
      [key]: { $regex: value, $options: "i" },
    });

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving book by query." + err);
  }
}

/**
 * Retrieves a BOOK by query from the database
 * @param req
 * @param res
 */
export async function getBooksByQueryGeneric(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    // api/books/query

    const body = req.body;

    const result = await bookModel.find(buildDynamicQuery(bookModel, body));

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving book by query." + err);
  }
}

/**
 * Retrieves the highest rated books from the data source
 * @param req
 * @param res
 */
export async function getHighestRatedBooks(req: Request, res: Response) {
  try {
    const result = await bookModel.find({}).sort({ rating: -1 }).limit(4);

    res.status(200).json(result);
  } catch (err) {
    res.status(500).json("error retrieving highest rated books." + err);
  }
}
