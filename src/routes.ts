import { Router, Request, Response } from 'express';
import {
    createBook,
    getAllBooks,
    getBooksById,
    updateBookById,
    deleteBookById
} from './controllers/bookController';
import { registerUser } from './controllers/authController';

const router: Router = Router();

/**
 * 
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the BOOK API');
});

// auth
router.post('/user/register', registerUser)

// create
router.post('/books', createBook);

// gets
router.get('/books', getAllBooks);
router.get('/books/:id', getBooksById);
router.put('/books/:id', updateBookById);
router.delete('/books/:id', deleteBookById);

export default router;