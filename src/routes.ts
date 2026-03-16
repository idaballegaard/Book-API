import { Router, Request, Response } from 'express';
import {
    createBook,
    getAllBooks,
    getBooksById,
    updateBookById,
    deleteBookById,
    getBooksByQuery,
    getBooksByQueryGeneric
} from './controllers/bookController';
import { loginUser, registerUser, verifyToken } from './controllers/authController';

const router: Router = Router();

/**
 * @swagger
 * /:
 *   get:
 *    tags:
 *      - App Routes
 *    summary: Welcome route for the API
 *    description: This route serves as a welcome message for the Book API, confirming that the server is running and accessible.
 *    responses:
 *      200:
 *        description: A welcome message is returned.
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send({message: 'Welcome to the BOOK API'});
});

// auth
/**
 * @swagger
 * /user/register:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Register a new user
 *     description: Takes a user in the request body and creates a new user in the database. The password is hashed before being stored.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *   responses:
 *     201:
 *      description: User registered successfully
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              error:
 *                type: string
 *              _id:
 *                type: string
 */

/**
 * @swagger
 * /user/login:
 *   post:
 *     tags:
 *       - User Routes
 *     summary: Login a user
 *     description: Takes an email and password in the request body, validates the credentials, and returns a JWT token if the login is successful.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *   responses:
 *     200:
 *      description: User logged in successfully, JWT token returned
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 */
router.post('/user/register', registerUser)
router.post('/user/login', loginUser)

// create
/**
 * @swagger
 * /books:
 *   post:
 *     tags:
 *       - Book Routes
 *     summary: Create a new book
 *     description: Creates a new book in the database. Requires authentication via an auth-token in the request header.
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 *     responses:
 *       201:
 *         description: Book created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.post('/books', verifyToken, createBook);

// gets
/**
 * @swagger
 * /books:
 *   get:
 *     tags:
 *       - Book Routes
 *     summary: Get all books
 *     description: Retrieves a list of all books in the database.
 *     responses:
 *       200:
 *         description: A list of books is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     tags:
 *       - Book Routes
 *     summary: Get a book by ID
 *     description: Retrieves the details of a specific book identified by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book details are returned.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.get('/books', getAllBooks);
router.get('/books/:id', getBooksById);

/**
 * @swagger
 * /books/query:
 *   post:
 *     tags:
 *       - Book Routes
 *     summary: Get books by query
 *     description: Retrieves a list of books that match the specified query parameters. The query parameters are provided in the request body as a JSON object.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             additionalProperties:
 *               type: string
 *     responses:
 *       200:
 *         description: A list of books matching the query is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books/{key}/{value}:
 *   get:
 *     tags:
 *       - Book Routes
 *     summary: Get books by query parameters
 *     description: Retrieves a list of books that match the specified key-value pair provided in the URL path. Requires authentication via an auth-token in the request header.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: key
 *         required: true
 *         description: The field name to query (e.g., "author", "genre")
 *         schema:
 *           type: string
 *       - in: path
 *         name: value
 *         required: true
 *         description: The value to match for the specified key (e.g., "J.K. Rowling", "Fantasy")
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A list of books matching the query is returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Book'
 */
router.post('/books/query', getBooksByQueryGeneric);
router.get('/books/:key/:value', verifyToken, getBooksByQuery);

// Update and delete
/**
 * @swagger
 * /books/{id}:
 *   put:
 *     tags:
 *       - Book Routes
 *     summary: Update a book by ID
 *     description: Updates the details of a book identified by its ID. Requires authentication via an auth-token in the request header.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Book'
 * 
 *     responses:
 *       200:
 *         description: Book updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     tags:
 *       - Book Routes
 *     summary: Delete a book by ID
 *     description: Deletes a book identified by its ID. Requires authentication via an auth-token in the request header.
 *     security:
 *       - ApiKeyAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Book'
 */
router.put('/books/:id', verifyToken, updateBookById);
router.delete('/books/:id', verifyToken, deleteBookById);

export default router;