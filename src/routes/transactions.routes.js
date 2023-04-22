import { Router } from "express";
import {
  getTransactions,
  newTransaction,
  getTransaction,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactions.controller.js";
import checkToken from "../middlewares/checkToken.middleware.js";

import transactionSchema from "../schemas/transaction.schema.js";
import validateSchema from "../middlewares/validateSchema.middleware.js";

const transactionRoutes = Router();
transactionRoutes.use(checkToken);
transactionRoutes.get("/transactions", getTransactions);
transactionRoutes.post(
  "/new-transaction", validateSchema(transactionSchema),
  newTransaction
);
transactionRoutes.get("/transaction/:id", getTransaction);
transactionRoutes.put(
  "/update-transaction/:id",
  validateSchema(transactionSchema),
  updateTransaction
);
transactionRoutes.delete("/delete-transaction/:id", deleteTransaction)

export default transactionRoutes;
