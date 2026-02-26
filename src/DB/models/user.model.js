import mongoose from "mongoose";
import {
  genderEnum,
  providerEnum,
  roleEnum,
} from "../../common/enum/user.enum.js";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 10,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 6,
      maxLength: 100,
      trim: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
      enum: Object.values(genderEnum),
      default: genderEnum.male,
    },
    phone: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      enum: Object.values(providerEnum),
      default: providerEnum.system,
    },
    role: {
      type: String,
      enum: Object.values(roleEnum),
      default: roleEnum.user,
    },
    profileImage: String,
    confirmed: Boolean,
  },
  {
    timestamps: true,
    strictQuery: true,
    toJSON: { virtuals: true },
  },
);

userSchema
  .virtual("userName")
  .get(function () {
    return this.firstName + " " + this.lastName;
  })
  .set(function (v) {
    const [firstName, lastName] = v.split(" ");
    this.set({ firstName, lastName });
  });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;
