import { MongoClient } from "mongodb";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Joi from "joi";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

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

server.post("/sign-up", async (req, res) => {
  const { nome, email, senha } = req.body;
  const userSchema = Joi.object({
    nome: Joi.string().required(),
    email: Joi.string().email().required(),
    senha: Joi.string().min(3).required(),
  });
  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res.status(422).send(validation.error.details.map((d) => d.message));
  }
  const passwordHash = bcrypt.hashSync(senha, 10);
  try {
    const usuario = await db
      .collection("users")
      .findOne({ email: req.body.email });
    if (usuario) {
      return res.sendStatus(409);
    }
    await db
      .collection("users")
      .insertOne({ nome, email, senha: passwordHash });
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send(err.message);
  }
});

server.post("/sign-in", async (req, res) => {
  const { email, senha } = req.body;
  const userSchema = Joi.object({
    email: Joi.string().email().required(),
    senha: Joi.string().min(3).required(),
  });
  const validation = userSchema.validate(req.body, { abortEarly: false });
  if (validation.error) {
    return res.status(422).send(validation.error.details.map((d) => d.message));
  }
  try {
    const user = await db.collection("users").findOne({ email: email });
    if (!user) return res.status(404).send("Email não cadastrado");
    console.log(user);
    if (!bcrypt.compareSync(senha, user.senha))
      return res.status(401).send("Senha não confere");
    const token = uuid();
    await db.collection("sessions").insertOne({ userId: user._id, token });
    return res.status(200).send(token);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
});

const PORT = 5001;
server.listen(PORT, console.log(`Server running on port ${PORT}`));
