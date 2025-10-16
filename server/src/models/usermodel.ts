import { Schema, Document, model } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser extends Document {
  profilepicture?: string;
  googleId?: string;
  githubId?: string;
  firstname?: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  createdAt: Date;
  comparePassword: (candidatePassword: string) => Promise<boolean>;
  googlePhoto?: string;
  githubPhoto?: string;
  authProvider?: string;
}

const userSchema = new Schema<IUser>(
  {
    profilepicture: { type: String },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },
    githubId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
    },
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    googlePhoto: { type: String },
    githubPhoto: { type: String },
    authProvider: { type: String },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  const user = this as IUser;
  if (!user.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error) {
    next(error as Error);
  }
});

userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser;
  return bcrypt.compare(candidatePassword, user.password);
};

const User = model<IUser>("User", userSchema);

export default User;
