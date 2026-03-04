import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import {validate} from "../../common/middleware/validation.js";
import {multer_local} from "../../common/middleware/multer.js";
const userRouter = Router();

userRouter.post("/signup",multer_local().single("attachment"),validate, US.signUp);
userRouter.post("/signin", US.signIn);
userRouter.get(
  "/profile/:id",
  authentication,
  authorization([roleEnum.user]),
  US.getProfile,
);

export default userRouter;
