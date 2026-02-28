import { singUpSchema } from "../../modules/users/user.service.js";

export const validate = (req, res, next) =>{
   const error = singUpSchema.validate(req.body, {abortEarly:false})
    if (error) {
        return res.status(401).json({message:"validate error",error:error})
    }
    next()
}

