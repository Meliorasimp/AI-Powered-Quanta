import dotenv from "dotenv";
import passport from "passport";
import { Request, Response, NextFunction } from "express";
import { Strategy as MicrosoftStrategy } from "passport-microsoft";
dotenv.config();

passport.use(
  new MicrosoftStrategy(
    {
      clientID: process.env.MICROSOFT_CLIENT_ID as string,
      clientSecret: process.env.MICROSOFT_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/api/auth/microsoft/callback",
      scope: ["openid", "profile", "email"],
    },
    (_accessToken: string, _refreshToken: string, profile: any, done: any) => {
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user: Express.User, done) => {
  done(null, user);
});

export const microsoftAuth = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "microsoft",
    { failureRedirect: "http://localhost:5173" },
    (err: unknown, user: Express.User | null | false) => {
      if (err) return next(err);
      if (!user) return res.redirect("http://localhost:5173");

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("http://localhost:5173/dashboard");
      });
    }
  )(req, res, next);
};
