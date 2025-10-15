import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Request, Response, NextFunction } from "express";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        let user = await User.findOne({ googleId: profile.id });
        if (!user) {
          user = new User({
            googleId: profile.id,
            username: profile.displayName,
            email,
            password: "google_oauth_no_password",
            firstname: profile.name?.givenName,
            lastname: profile.name?.familyName,
            googlePhoto: profile.photos?.[0]?.value,
          });
          await user.save();
        }

        return done(null, user);
      } catch (e) {
        return done(e as Error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user: Express.User, done) => done(null, user));

export const googleAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "google",
    { failureRedirect: FRONTEND_URL },
    (err: any, user: Express.User | false | null) => {
      if (err) return next(err);
      if (!user) return res.redirect(FRONTEND_URL);

      const u = user as any;
      const jwtSecret = process.env.JWT_SECRET as string;
      const token = jwt.sign(
        {
          id: u.id,
          email: u.email,
          photo: u.googlePhoto,
          username: u.username,
        },
        jwtSecret,
        { expiresIn: "1h" }
      );

      // Cross-site auth cookie (Render backend + Vercel/Netlify frontend)
      res.cookie("token", token, {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        path: "/",
        maxAge: 60 * 60 * 1000,
      });

      req.logIn(user, (loginErr) => {
        if (loginErr) return next(loginErr);
        return res.redirect(`${FRONTEND_URL}/dashboard`);
      });
    }
  )(req, res, next);
};
