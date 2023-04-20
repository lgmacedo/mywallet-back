import { db } from "../app.js";
import Joi from "joi";
import dayjs from "dayjs";

export async function getTransactions(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);
  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) return res.status(404).send("Usuário não encontrado");
    const transactions = await db
      .collection("transactions")
      .find({ userId: user._id })
      .toArray();
    return res.status(200).send({ nome: user.nome, transactions });
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}

export async function newTransaction(req, res) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");
  if (!token) return res.sendStatus(401);
  const { valor, descricao, tipo } = req.body;
  const transactionSchema = Joi.object({
    valor: Joi.number().positive().required(),
    descricao: Joi.string().required(),
    tipo: Joi.string().valid("entrada", "saida").required(),
  });
  const validation = transactionSchema.validate(req.body, {
    abortEarly: false,
  });
  if (validation.error) {
    return res.status(422).send(validation.error.details.map((d) => d.message));
  }

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) return res.status(404).send("Usuário não encontrado");
    await db
      .collection("transactions")
      .insertOne({
        tipo,
        data: dayjs().format("DD/MM"),
        titulo: descricao,
        valor: Number(Number(valor).toFixed(2)),
        userId: user._id,
      });
    return res.sendStatus(201);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}
