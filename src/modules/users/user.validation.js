import Joi from "joi";

import { genderEnum } from "../../common/enum/user.enum.js";
import { general_rules } from "../../common/utils/generalRules.js";

export const signupValidation = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: general_rules.email.required(),
    password: general_rules.password.required(),
    cpassword: general_rules.cpassword.required(),
    gender: Joi.string()
      .valid(...Object.values(genderEnum))
      .required(),
    phone: Joi.string().required(),
  }),

  file: general_rules.file.required(),

  // files: Joi.array().items(
  //   Joi.object({
  //     fieldname: Joi.string().required(),
  //     originalname: Joi.string().required(),
  //     encoding: Joi.string().required(),
  //     mimetype: Joi.string().required(),
  //     destination: Joi.string().required(),
  //     filename: Joi.string().required(),
  //     path: Joi.string().required(),
  //     size: Joi.number().required(),
  //   }).required().messages({
  //       "any.required": "Please upload a file",
  //   }),
  // ),

  files: Joi.object({
    attachment: Joi.array()
      .max(1)
      .items(general_rules.file.required())
      .required(),

    attachments: Joi.array().items(general_rules.file.required).required(),
  }).required(),
};

export const signinValidation = {
  body: Joi.object({
    email: general_rules.email.required(),
    password: general_rules.password.required(),
  }),
};
