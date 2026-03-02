import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import {validate} from "../../common/middleware/validation.js";
const userRouter = Router();

userRouter.post("/signup",vmulter_local({
  custem_types:[...multerEnum.image,...multerEnum.pdf]
}).fields([
  {name:"attachment",maxCount:1},
  {name:"attachments",maxCount:5}
]),validate, US.signUp);
userRouter.post("/signin", US.signIn);
userRouter.get(
  "/profile/:id",
  authentication,
  authorization([roleEnum.user]),
  US.getProfile,
);

export default userRouter;
