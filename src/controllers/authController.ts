// Imports
import {
    type Request,
    type Response,
    type NextFunction
} from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import Joi, { ValidationResult } from "joi";

// Project imports
import { userModel } from "../models/userModel";
import { User } from "../interfaces/user";
import { connect, disconnect } from "../repository/database";

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
        const emailExist = await userModel.findOne( { email: req.body.email } );

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
            password: passwordHashed
        });

        const savedUser = await userObject.save();
        res.status(200).json( { error: null, data: savedUser._id } );
        

    } catch (error) {
        res.status(500).send("Error registering user. Error: " + error);

    }
    finally {
        await disconnect();
    }
};



// Login

/**
 * Validae user registration info (name, email, password)
 * @param data 
 */
export function validateUserRegistrationInfo(data: User): ValidationResult {

    const schema = Joi.object({
        name: Joi.string().min(6).max(255).required(),
        email: Joi.string().email().min(6).max(255).required(),
        password: Joi.string().min(6).max(20).required()
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
        password: Joi.string().min(6).max(20).required()
    });

    return schema.validate(data);
}