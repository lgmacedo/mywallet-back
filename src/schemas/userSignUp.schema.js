import Joi from "joi";

const userSignUpSchema = Joi.object({
  nome: Joi.string().required(),
  email: Joi.string().email().required(),
  senha: Joi.string().min(3).required(),
});

export default userSignUpSchema;
