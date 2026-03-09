import Joi from "joi";

import { genderEnum } from "../../common/enum/user.enum.js";

export const signupValidation = {
  body: Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        tlds: { allow: true },
        minDomainSegments: 2,
        maxDomainSegments: 2,
      })
      .required(),
    password: Joi.string()
      .min(6)
      .max(20)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .required(),
    cpassword: Joi.string().valid(Joi.ref("password")),
    gender: Joi.string()
      .valid(...Object.values(genderEnum))
      .required(),
    phone: Joi.string().required(),
  }),
};

export const signinValidation = {
  body: Joi.object({
    email: Joi.string()
      .email({
        tlds: { allow: true },
        minDomainSegments: 2,
        maxDomainSegments: 2,
      })
      .required(),
    password: Joi.string()
      .min(6)
      .max(20)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      )
      .required(),
  }),
};
