import { verifyToken } from "../utils/token.service.js";
import userModel from "../../DB/models/user.model.js";
import * as db_service from "../../DB/db.service.js";
import {
  prefix_auth_key_config,
  secret_key_config,
} from "../../../config/config.service.js";
import revokeTokenModel from "../../DB/models/revokeToken.model.js";
import { get, revoke_key } from "../../DB/redis/redis.service.js";

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
    throw new Error("invalid token payload");
  }

  req.decoded = decoded;

  const user = await db_service.findOne({
    model: userModel,
    filter: { _id: req.decoded.id },
  });

  if (!user) {
    throw new Error("User already exist", { cause: 400 });
  }

  if (user?.changeCredentials.getTime() > decoded.iat * 1000) {
    throw new Error("inValid token");
  }

  const revokeToken = await get(revoke_key(req.user._id, req.decoded.jti));

  if (revokeToken) {
    throw new Error("inValid token revoked");
  }

  req.user = user;
  req.decoded = decoded;

  next();
};
