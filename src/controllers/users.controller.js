import db from "../database/database.connect.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";

export async function SignUp(req, res) {
  const { nome, email, senha } = req.body;

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
}

export async function SignIn(req, res) {
  const { email, senha } = req.body;

  try {
    const user = await db.collection("users").findOne({ email: email });
    if (!user) return res.status(404).send("Email não cadastrado");
    if (!bcrypt.compareSync(senha, user.senha))
      return res.status(401).send("Senha não confere");
    const token = uuid();
    await db.collection("sessions").insertOne({ userId: user._id, token });
    return res.status(200).send(token);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}

export async function LogOut(req, res) {
  const {token} = res.locals;
  
  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    await db.collection("sessions").deleteOne(session);
    return res.sendStatus(202);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}
