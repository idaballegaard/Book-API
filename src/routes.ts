import { Router, Request, Response } from 'express';
import {
    createBook,
    getAllBooks,
    getBooksById,
    updateBookById,
    deleteBookById,
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

// Upsate and delete
router.put('/books/:id', verifyToken, updateBookById);
router.delete('/books/:id', verifyToken, deleteBookById);

export default router;