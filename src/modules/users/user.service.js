import userModel from "../../DB/models/user.model.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import * as db_service from "../../DB/db.service.js";
import { successResponse } from "../../common/utils/response.success.js";
import { encrypt } from "../../common/utils/security/encrypt.securty.js";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../../common/utils/token.service.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import {salt_rounds_config, secret_key_config} from "../../../config/config.service.js";

export const signUp = async (req, res, next) => {
  const { userName, lastName, email, password, cpassword, gender, age, phone } =
    req.body;
  if (userName.split(" ").length < 2) {
    throw new Error("Invalid name", { cause: 400 });
  }

  if (password !== cpassword) {
    throw new Error("Passwords do not match", { cause: 400 });
  }

  if (
    await db_service.findOne({
      model: userModel,
      filter: { email },
    })
  ) {
    throw new Error("Email already exist", { cause: 400 });
  }

  const encryptPhone = encrypt(phone);
  const bcryptPassword = Hash({
    plainText: password,
    salt_rounds: salt_rounds_config,
  });

  const user = await db_service.create({
    model: userModel,
    data: {
      userName,
      lastName,
      email,
      password: bcryptPassword,
      phone: encryptPhone,
      gender,
      age,
    },
  });
  successResponse({
    res,
    status: 201,
    message: "User created successfully",
    data: user,
  });
};

export const signIn = async (req, res, next) => {
  const { email, password } = req.body;

  const user = await db_service.findOne({
    model: userModel,
    filter: {
      email,
      provider: providerEnum.system,
    },
    select: "-password",
  });

  if (!user || !Compare(password, user.password)) {
    throw new Error("Invalid credentials", { cause: 401 });
  }

  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    secret_key: secret_key_config,
    options: { jwtid: uuidv4() },
  });

  successResponse({
    res,
    status: 201,
    message: "User signIn successfully",
    data: access_token,
  });
};

export const getProfile = async (req, res, next) => {
  successResponse({
    res,
    status: 200,
    message: "User profile fetched successfully",
    data: req.user,
  });
};
