import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    (_accessToken, _refreshToken, profile, done) => {
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

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "google",
    { failureRedirect: "http://localhost:5173" },
    (err: any, user: Express.User | false | null) => {
      if (err) return next(err);
      if (!user) return res.redirect("http://localhost:5173");

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("http://localhost:5173/dashboard");
      });
    }
  )(req, res, next);
};
