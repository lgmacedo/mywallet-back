import db from "../database/database.connect.js";
import dayjs from "dayjs";
import { ObjectId } from "mongodb";

export async function getTransactions(req, res) {
  const { token } = res.locals;

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
  const { token } = res.locals;
  const { valor, descricao, tipo } = req.body;

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    const user = await db.collection("users").findOne({ _id: session.userId });
    if (!user) return res.status(404).send("Usuário não encontrado");
    await db.collection("transactions").insertOne({
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

export async function getTransaction(req, res) {
  const { token } = res.locals;

  const { id } = req.params;

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(id) });
    if (!transaction) return res.status(404).send("Transação não encontrada");
    return res.status(200).send(transaction);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}

export async function updateTransaction(req, res) {
  const { token } = res.locals;
  const { valor, descricao } = req.body;

  const { id } = req.params;

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(id) });
    if (!transaction) return res.status(404).send("Transação não encontrada");
    await db.collection("transactions").updateOne(transaction, {
      $set: { valor: Number(Number(valor).toFixed(2)), titulo: descricao },
    });
    return res.sendStatus(200);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}

export async function deleteTransaction(req, res){
  const { token } = res.locals;

  const { id } = req.params;

  try {
    const session = await db.collection("sessions").findOne({ token: token });
    if (!session) return res.sendStatus(401);
    const transaction = await db
      .collection("transactions")
      .findOne({ _id: new ObjectId(id) });
    if (!transaction) return res.status(404).send("Transação não encontrada");
    await db.collection("transactions").deleteOne(transaction);
    return res.sendStatus(202);
  } catch (err) {
    return res.status(500).send("Erro inesperado. Tente novamente.");
  }
}
