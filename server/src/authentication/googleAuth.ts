import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const email = profile.emails?.[0]?.value;
      console.log("Google profile photos:", profile.photos);

      let user = await User.findOne({ googleId: profile.id });
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
          photo: profile.photos?.[0]?.value,
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
    { failureRedirect: "http://localhost:5173" },
    (err: any, user: Express.User | false | null) => {
      if (err) return next(err);
      if (!user) return res.redirect("http://localhost:5173");

      const userObj = user as any;

      const token = jwt.sign(
        {
          id: userObj.id,
          email: userObj.email,
          photo: userObj.photo,
          username: userObj.username,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );
      if (!token) {
        console.log("No token found, redirecting to home", token);
        return res.redirect("http://localhost:5173");
      } else {
        console.log("Token generated, redirecting to dashboard", token);
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 3600000,
      });

      req.logIn(user, (err) => {
        console.log("logging in user", user);
        if (err) return next(err);
        return res.redirect("http://localhost:5173/dashboard");
      });
    }
  )(req, res, next);
};
