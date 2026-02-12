import userModel from "../../DB/models/user.model.js";
import { providerEnum } from "../../common/enum/user.enum.js";
import * as db_service from "../../DB/db.service.js";
import { successResponse } from "../../common/utils/response.success.js";
import {
  decrypt,
  encrypt,
} from "../../common/utils/security/encrypt.securty.js";
import bcrypt from "bcrypt";

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

  await sendOTP(req, res, next);

  if (sendOTP !== "123456") throw new Error("OTP not sent", { cause: 400 })


  const encryptPhone = encrypt(phone);
  const bcryptPassword = bcrypt.hashSync(password, 13);

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


const sendOTP = async (req, res, next) => {
  const otp = "123456"; // Math.floor(1000 + Math.random() * 9000);
  const { phone } = req.body;

  // TODO : logic to send otp

  return otp;
}



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

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error("Invalid credentials", { cause: 401 });
  }

  successResponse({
    res,
    status: 201,
    message: "User signIn successfully",
    data: user,
  });
};

export const getProfile = async (req, res, next) => {
  const { id } = req.params;
  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: id },
  });

  if (!user) {
    throw new Error("User already exist", { cause: 400 });
  }

  successResponse({
    res,
    status: 200,
    message: "User profile fetched successfully",
    data: {
      ...user._doc,
      phone: decrypt(user.phone),
    },
  });
};
