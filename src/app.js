import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { LogOut, SignIn, SignUp } from "./controllers/usersController.js";
import { getTransactions, newTransaction } from "./controllers/transactionsController.js";

const server = express();
server.use(cors());
server.use(express.json());

dotenv.config();
const mongoClient = new MongoClient(process.env.DATABASE_URL);
try {
  await mongoClient.connect();
} catch (err) {
  console.log(err.message);
}
export const db = mongoClient.db();

server.post("/sign-up", SignUp);

server.post("/sign-in", SignIn);

server.delete("/logout", LogOut);

server.get("/transactions", getTransactions);

server.post("/new-transaction", newTransaction);

const PORT = 5000;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
