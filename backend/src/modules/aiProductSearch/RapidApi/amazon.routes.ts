

import { Router } from 'express';
import { getProductsWithDetails } from './amazon.controller';

const router = Router();


router.get('/search-with-details', getProductsWithDetails);

export default router;