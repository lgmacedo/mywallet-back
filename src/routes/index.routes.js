import {Router} from 'express';
import userRoutes from './users.routes.js';
import transactionRoutes from './transactions.routes.js';

const router = Router();
router.use(userRoutes);
router.use(transactionRoutes);

export default router;