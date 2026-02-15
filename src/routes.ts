import { Router, Request, Response } from 'express';
import {
    createBook,
    getAllBooks,
    getBooksById,
    updateBookById,
    deleteBookById
} from './controllers/bookController';

const router: Router = Router();

/**
 * 
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the BOOK API');
});


router.post('/books', createBook);
router.get('/books', getAllBooks);
router.get('/books/:id', getBooksById);
router.put('/books/:id', updateBookById);
router.delete('/books/:id', deleteBookById);

export default router;