import { Router } from "express";
import passport from "passport";
import { googleAuth } from "../authentication/googleAuth";
import { githubAuth } from "../authentication/githubAuth";

const authRouter = Router();

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

authRouter.get("/auth/google/callback", googleAuth);
authRouter.get("/auth/github/callback", githubAuth);

export default authRouter;
