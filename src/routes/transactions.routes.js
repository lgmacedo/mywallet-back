import {Router} from 'express';
import { getTransactions, newTransaction } from '../controllers/transactions.controller.js';

const transactionRoutes = Router();
transactionRoutes.get("/transactions", getTransactions);
transactionRoutes.post("/new-transaction", newTransaction);

export default transactionRoutes;