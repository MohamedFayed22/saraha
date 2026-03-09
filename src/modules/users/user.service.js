import userModel from "../../DB/models/user.model.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import * as db_service from "../../DB/db.service.js";
import { successResponse } from "../../common/utils/response.success.js";
import { encrypt } from "../../common/utils/security/encrypt.securty.js";
import { v4 as uuidv4 } from "uuid";
import {
  generateToken,
  verifyToken,
} from "../../common/utils/token.service.js";
import { Compare, Hash } from "../../common/utils/security/hash.security.js";
import {
  prefix_auth_key_config,
  refresh_key_config,
  salt_rounds_config,
  secret_key_config,
} from "../../../config/config.service.js";
import joi from "joi";
import cloudinary from "../../common/utils/cloudinary.js";
import UserModel from "../../DB/models/user.model.js";
import {decrypt} from "dotenv";

export const singUpSchema = joi
  .object({
    userName: joi.string().min(3).max(30),
    email: joi.string().email(),
    password: joi.string().min(6).max(20),
  })
  .required();

export const signUp = async (req, res, next) => {
  const { userName, lastName, email, password, cpassword, gender, age, phone } =
    req.body;

  const { error } = singUpSchema.validate(req.body, {
    abortEarly: false,
  });
  if (error) {
    return res.status(401).json({ message: "validate error", error: error });
  }

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

  const file_paths = [];

  if (req.files) {
    for (const file of req.files.attachments) {
      file_paths.push(file.path);
    }
  }

  const { secure_url, public_id } = await cloudinary.uploader.upload(
    req.files.attachment[0].path,
    {
      folder: "sarah_app/users",
      resource_type: "image", //auto
    },
  );

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
      profileImage: { secure_url, public_id },
      coverPhoto: file_paths,
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
    options: { jwtid: uuidv4(), expiresIn: 60 * 5 },
  });

  const refresh_token = generateToken({
    payload: { id: user._id, email: user.email },
    secret_key: refresh_key_config,
    options: { jwtid: uuidv4(), expiresIn: "3m" },
  });

  successResponse({
    res,
    status: 201,
    message: "User signIn successfully",
    data: {
      access_token,
      refresh_token,
    },
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

export const refreshToken = async (req, res, next) => {
  const { authorization } = req.header;

  if (!authorization) {
    throw new Error("token not found");
  }

  const [prefix, token] = authorization.split(" ");

  if (prefix !== prefix_auth_key_config) {
    throw new Error("invalid token prefix");
  }

  const decoded = verifyToken({
    token: token,
    secret_key: refresh_key_config,
  });

  if (!decoded || !decoded.id) {
    throw new Error("invalid token");
  }

  req.decoded = decoded;

  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: req.decoded.id },
  });

  if (!user) {
    throw new Error("User already exist", { cause: 400 });
  }

  const access_token = generateToken({
    payload: { id: user._id, email: user.email },
    secret_key: secret_key_config,
    options: { jwtid: uuidv4(), expiresIn: 60 * 5 },
  });

  successResponse({
    res,
    status: 201,
    message: "User refresh token successfully",
    data: {
      access_token,
    },
  });
};


export const shareProfile = async (req, res, next) => {

  const {id} = req.params;

  const user = await db_service.findOne({
    model:UserModel,
    id,
    select:"-password"
  })

  if (!user){
    throw new Error("user not exist yet")
  }

  user.phone = decrypt(user.phone);

  successResponse({
    res,
    status: 200,
    message: "User profile shared successfully",
    data: user,
  });
};
