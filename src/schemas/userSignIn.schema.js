import Joi from "joi";

const userSignInSchema = Joi.object({
  email: Joi.string().email().required(),
  senha: Joi.string().min(3).required(),
});

export default userSignInSchema;
