import { Router } from "express";
import passport from "passport";

const authRouter = Router();

authRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

authRouter.get("/auth/google/callback", (req, res, next) => {
  passport.authenticate(
    "google",
    { failureRedirect: "http://localhost:5173" },
    (err: unknown, user: Express.User | null | false) => {
      if (err) return next(err);
      if (!user) return res.redirect("http://localhost:5173");
      req.logIn(user, (err) => {
        if (err) return next(err);

        console.log("User authenticated successfully:", user);

        // Redirect to frontend
        return res.redirect("http://localhost:5173/profile");
      });
    }
  )(req, res, next);
});

export default authRouter;
