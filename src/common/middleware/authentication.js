import { verifyToken } from "../utils/token.service.js";
import userModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/db.service.js";
import {prefix_auth_key_config, secret_key_config} from "../../../config/config.service.js";

export const authentication = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("token not found");
  }

  const [prefix, token] = authorization.split(" ");

  if (prefix !== prefix_auth_key_config) {
    throw new Error("invalid token");
  }

  const decoded = verifyToken({
    token: token,
    secret_key: secret_key_config,
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

  req.user = user;

  next();
};
