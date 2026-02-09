import { Router, Request, Response } from 'express';
import { createBook } from './controllers/bookController';

const router: Router = Router();

/**
 * 
 */
router.get('/', (req: Request, res: Response) => {
    res.status(200).send('Welcome to the BOOK API');
});


router.post('/books', createBook);


export default router;