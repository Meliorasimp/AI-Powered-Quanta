import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Request, Response, NextFunction } from "express";
dotenv.config();

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
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

export const githubAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  passport.authenticate(
    "github",
    {
      failureRedirect: "http://localhost:5173",
    },
    (err: any, user: Express.User | null | false) => {
      if (err) return next(err);
      if (!user) return res.redirect("http://localhost:5173");

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("http://localhost:5173/dashboard");
      });
    }
  )(req, res, next);
};
