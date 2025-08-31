import { Router } from "express";
import passport from "passport";
import { googleAuth } from "../authentication/googleAuth";
import { githubAuth } from "../authentication/githubAuth";
import { microsoftAuth } from "../authentication/microsoftAuth";

const authRouter = Router();

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["profile", "email"] })
);

authRouter.get(
  "/auth/microsoft",
  passport.authenticate("microsoft", { scope: ["openid", "profile", "email"] })
);

authRouter.get("/auth/google/callback", googleAuth);
authRouter.get("/auth/github/callback", githubAuth);
authRouter.get("/auth/microsoft/callback", microsoftAuth);

export default authRouter;
