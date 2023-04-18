import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";

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
const db = mongoClient.db();

server.post("/users", async (req, res) => {
  const userSchema = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(3).required(),
  });
  if (userSchema.validate(req.body).error) {
    return res.sendStatus(422);
  }
  try {
    const usuario = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (usuario) {
      return res.sendStatus(409);
    }
    await db.collection("users").insertOne(req.body);
    return res.sendStatus(201);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

const PORT = 5001;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
