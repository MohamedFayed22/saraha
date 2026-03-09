import Joi from "joi";
import { Types } from "mongoose";

export const general_rules = {
  id: Joi.string().custom((value, helpers) => {
    const isValid = Types.ObjectId.isValid(value);
    return isValid ? value : helpers.message("inValid id");
  }),
  email: Joi.string().email({
    tlds: { allow: true },
    minDomainSegments: 2,
    maxDomainSegments: 2,
  }),
  password: Joi.string()
    .min(6)
    .max(20)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    ),
  cpassword: Joi.string().valid(Joi.ref("password")),

  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string().required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
    size: Joi.number().required(),
  }).messages({
    "any.required": "Please upload a file",
  }),
};
