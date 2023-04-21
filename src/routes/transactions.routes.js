import {Router} from 'express';
import { getTransactions, newTransaction } from '../controllers/transactions.controller.js';
import checkToken from '../middlewares/checkToken.middleware.js';

import transactionSchema from '../schemas/transaction.schema.js';
import validateSchema from '../middlewares/validateSchema.middleware.js';

const transactionRoutes = Router();
transactionRoutes.get("/transactions", checkToken, getTransactions);
transactionRoutes.post("/new-transaction", [checkToken, validateSchema(transactionSchema)], newTransaction);

export default transactionRoutes;