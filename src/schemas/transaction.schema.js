import Joi from "joi";

const transactionSchema = Joi.object({
  valor: Joi.number().positive().required(),
  descricao: Joi.string().required(),
  tipo: Joi.string().valid("entrada", "saida").required(),
});

export default transactionSchema;
