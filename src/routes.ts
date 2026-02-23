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
 * 
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the BOOK API');
});

// auth
router.post('/user/register', registerUser)
router.post('/user/login', loginUser)

// create
router.post('/books', verifyToken, createBook);

// gets
router.get('/books', getAllBooks);
router.get('/books/:id', getBooksById);

router.post('/books/query', getBooksByQueryGeneric);
router.get('/books/:key/:value', verifyToken, getBooksByQuery);

// Upsate and delete
router.put('/books/:id', verifyToken, updateBookById);
router.delete('/books/:id', verifyToken, deleteBookById);

export default router;