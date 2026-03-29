import { Router } from "express";
import * as US from "./user.service.js";
import { authentication } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { validate } from "../../common/middleware/validation.js";
import { multer_host, multer_local } from "../../common/middleware/multer.js";
import { multerEnum } from "../../common/enum/multer.enum.js";
import * as VU from "./user.validation.js";
const userRouter = Router();

userRouter.post(
  "/signup",
  multer_host({
    custom_types: [...multerEnum.image, ...multerEnum.pdf],
  }).fields([
    { name: "attachment", maxCount: 1 },
    { name: "attachments", maxCount: 5 },
  ]),
  US.signUp,
);

//**** use multer local ****//
// userRouter.post(
//     "/signup",
//     multer_local({
//         custom_types: [...multerEnum.image, ...multerEnum.pdf],
//     }).fields([
//         { name: "attachment", maxCount: 1 },
//         { name: "attachments", maxCount: 5 },
//     ]),
//     validate,
//     US.signUp,
// );

userRouter.post("/signin", validate(VU.signupValidation), US.signIn);
userRouter.get(
  "/profile/:id",
  authentication,
  authorization([roleEnum.user]),
  US.getProfile,
);
userRouter.get("/refresh-token", US.refreshToken);
userRouter.get(
  "/share-profile/:id",
  validate(VU.shareProfileValidation),
  US.shareProfile,
);
userRouter.patch(
  "update-profile",
  authentication,
  validate(VU.updateProfileValidation),
  US.updateProfile,
);

userRouter.patch(
  "update-password",
  authentication,
  validate(VU.updatePasswordValidation),
  US.updatePassword,
);

userRouter.post("logout", authentication, US.logout);

export default userRouter;
