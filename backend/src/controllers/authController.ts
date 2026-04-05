// Imports
import { type Request, type Response, type NextFunction } from "express";

import jwt from "jsonwebtoken";
import { JwtPayload } from "jsonwebtoken";

import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from "../repository/database";
import { bookModel } from "../models/bookModel";

interface TokenPayload extends JwtPayload {
  id: string;
  name: string;
  email: string;
}

/**
 * Register a new user
 * @param req
 * @param res
 * @returns
 */
export async function registerUser(req: Request, res: Response) {
  try {
    // validate the user and password
    const { error } = validateUserRegistrationInfo(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    await connect();

    // check if the email is already registered
    const emailExist = await userModel.findOne({ email: req.body.email });

    if (emailExist) {
      res.status(400).json({ error: "Email already exists." });
      return;
    }

    // has the password
    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(req.body.password, salt);

    // create a user object and save in the DB
    const userObject = new userModel({
      name: req.body.name,
      email: req.body.email,
      password: passwordHashed,
      favoriteBooks: [],
    });

    const savedUser = await userObject.save();
    res.status(201).json({ error: null, data: savedUser._id });
  } catch (error) {
    res.status(500).send("Error registering user. Error: " + error);
  } finally {
    await disconnect();
  }
}

// Login

/**
 * Login an existing user
 * @param req
 * @param res
 * @returns
 */
export async function loginUser(req: Request, res: Response) {
  try {
    // validate user login info
    const { error } = validateUserLoginInfo(req.body);

    if (error) {
      res.status(400).json({ error: error.details[0].message });
      return;
    }

    // find the user in the repository
    await connect();

    const user: User | null = await userModel.findOne({
      email: req.body.email,
    });

    if (!user) {
      res.status(400).json({ error: "Password or email is wrong." });
      return;
    } else {
      // create auth token and send it back
      const validPassword: boolean = await bcrypt.compare(
        req.body.password,
        user.password,
      );

      if (!validPassword) {
        res.status(400).json({ error: "Password or email is wrong." });
        return;
      }

      const userId: string = user.id;
      const token: string = jwt.sign(
        {
          // Payload
          name: user.name,
          email: user.email,
          id: userId,
        },
        process.env.TOKEN_SECRET as string,
        { expiresIn: "2h" },
      );

      // attach the token and send it back to te client
      res
        .status(200)
        .header("auth-token", token)
        .json({
          error: null,
          data: {
            token,
            user: {
              id: userId,
              name: user.name,
              email: user.email,
              favoriteBooks: (user.favoriteBooks ?? []).map(
                (favoriteBookId) => favoriteBookId.toString(),
              ),
            },
          },
        });
    }
  } catch (error) {
    res.status(500).send("Error logging in user. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Middleware logic to verify the client JWT token
 * @param req
 * @param res
 * @next
 */
export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access denied." });
    return;
  }

  try {
    if (token) jwt.verify(token, process.env.TOKEN_SECRET as string);

    next();
  } catch {
    res.status(401).send("Invalid Token");
  }
}

function getTokenPayload(req: Request): TokenPayload {
  const token = req.header("auth-token");

  if (!token) {
    throw new Error("Access denied.");
  }

  const decoded = jwt.verify(
    token,
    process.env.TOKEN_SECRET as string,
  ) as TokenPayload;

  return decoded;
}

export async function getFavoriteBooks(req: Request, res: Response) {
  try {
    const { id } = getTokenPayload(req);

    await connect();

    const user = await userModel.findById(id).populate("favoriteBooks");

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({
      error: null,
      data: {
        favoriteBookIds: (user.favoriteBooks ?? []).map((favoriteBook: any) =>
          typeof favoriteBook === "string"
            ? favoriteBook
            : favoriteBook._id.toString(),
        ),
        favoriteBooks: user.favoriteBooks ?? [],
      },
    });
  } catch (error) {
    res.status(500).send("Error retrieving favorite books. Error: " + error);
  } finally {
    await disconnect();
  }
}

export async function toggleFavoriteBook(req: Request, res: Response) {
  try {
    const { id } = getTokenPayload(req);
    const bookId = String(req.params.bookId ?? "");

    if (!bookId) {
      res.status(400).json({ error: "Book ID is required." });
      return;
    }

    await connect();

    const [user, book] = await Promise.all([
      userModel.findById(id),
      bookModel.findById(bookId),
    ]);

    if (!user) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    if (!book) {
      res.status(404).json({ error: "Book not found." });
      return;
    }

    const favoriteBookIds = (user.favoriteBooks ?? []).map((favoriteBookId) =>
      favoriteBookId.toString(),
    );
    const isAlreadyFavorite = favoriteBookIds.includes(bookId);

    const updatedUser = await userModel
      .findByIdAndUpdate(
        id,
        isAlreadyFavorite
          ? { $pull: { favoriteBooks: bookId } }
          : { $addToSet: { favoriteBooks: bookId } },
        { new: true },
      )
      .populate("favoriteBooks");

    if (!updatedUser) {
      res.status(404).json({ error: "User not found." });
      return;
    }

    res.status(200).json({
      error: null,
      data: {
        isFavorite: !isAlreadyFavorite,
        favoriteBookIds: (updatedUser.favoriteBooks ?? []).map(
          (favoriteBook: any) =>
            typeof favoriteBook === "string"
              ? favoriteBook
              : favoriteBook._id.toString(),
        ),
        favoriteBooks: updatedUser.favoriteBooks ?? [],
      },
    });
  } catch (error) {
    res.status(500).send("Error updating favorite books. Error: " + error);
  } finally {
    await disconnect();
  }
}

/**
 * Validae user registration info (name, email, password)
 * @param data
 */
export function validateUserRegistrationInfo(data: User): ValidationResult {
  const schema = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(data);
}

/**
 * Validae user login info (email, password)
 * @param data
 */
export function validateUserLoginInfo(data: User): ValidationResult {
  const schema = Joi.object({
    email: Joi.string().email().min(6).max(255).required(),
    password: Joi.string().min(6).max(20).required(),
  });

  return schema.validate(data);
}
