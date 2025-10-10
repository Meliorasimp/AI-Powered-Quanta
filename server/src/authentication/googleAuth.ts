import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";
dotenv.config();

const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://ai-powered-quanta.vercel.app";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      console.log("Google profile photos:", profile.photos);

      let user = await User.findOne({ googleId: profile.id });
      console.log("Found user:", user);
      if (user) {
        return done(null, user);
      }

      if (!user) {
        user = await new User({
          googleId: profile.id,
          username: profile.displayName,
          email: email,
          password: "google_oauth_no_password",
          firstname: profile.name?.givenName,
          lastname: profile.name?.familyName,
          googlePhoto: profile.photos?.[0]?.value,
        });
      }

      await user.save();
      console.log("Saved user:", user);
      return done(null, user);
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
    {
      failureRedirect: FRONTEND_URL,
    },
    (err: any, user: Express.User | false | null) => {
      if (err) return next(err);
      if (!user) return res.redirect(FRONTEND_URL);

      const userObj = user as any;

      const token = jwt.sign(
        {
          id: userObj.id,
          email: userObj.email,
          photo: userObj.googlePhoto,
          username: userObj.username,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      if (!token) {
        console.log("No token found, redirecting to home", token);
        return res.redirect(FRONTEND_URL);
      } else {
        console.log("Token generated, redirecting to dashboard", token);
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 3600000, // 1hour
      });

      req.logIn(user, (err) => {
        console.log("logging in user", user);
        if (err) return next(err);
        return res.redirect(`${FRONTEND_URL}/dashboard`);
      });
    }
  )(req, res, next);
};
