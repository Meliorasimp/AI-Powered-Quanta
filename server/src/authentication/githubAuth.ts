import passport from "passport";
import dotenv from "dotenv";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Request, Response, NextFunction } from "express";
import axios from "axios";
import User from "../models/usermodel";
import jwt from "jsonwebtoken";
dotenv.config();

type githubEmail = {
  email: string;
  primary: boolean;
  verified: boolean;
  visibility: string | null;
};

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        // Fetch user emails from GitHub API
        const { data: emails } = await axios.get<githubEmail[]>(
          "https://api.github.com/user/emails",
          {
            headers: {
              Authorization: `token ${_accessToken}`,
              Accept: "application/vnd.github.v3+json",
            },
          }
        );
        const primaryEmail =
          emails.find(
            (e: { primary: boolean; verified: boolean; email: string }) =>
              e.primary && e.verified
          )?.email ||
          emails.find((e: { verified: boolean; email: string }) => e.verified)
            ?.email ||
          null;

        if (!primaryEmail) {
          console.error("No verified email found for GitHub user.");
          return done(new Error("Email not available from GitHub."), null);
        }

        // Check if user exists in the database
        const user = await User.findOne({ githubId: profile.id });
        // If user exists, proceed.
        if (user) {
          const updatedUser = await User.findOneAndUpdate(
            { email: primaryEmail },
            {
              $set: {
                githubId: profile.id,
                githubPhoto: profile.photos[0]?.value || "",
              },
            },
            { new: true }
          );
          console.log("Existing user found:", updatedUser);
          return done(null, updatedUser);
        } else {
          const newUser = new User({
            githubId: profile.id,
            username: profile.username,
            email: primaryEmail,
            photo: profile.photos[0]?.value || "",
          });
          await newUser.save();
          console.log("New user created:", newUser);
          return done(null, newUser);
        }
      } catch (error) {
        return done(error);
      }
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

      const userObj = user as any;
      const token = jwt.sign(
        {
          id: userObj.id,
          email: userObj.email,
          username: userObj.username,
          photo: userObj.githubPhoto,
        },
        process.env.JWT_SECRET as string,
        { expiresIn: "1h" }
      );

      if (!token) {
        console.log("No token found, redirecting to home", token);
        return res.redirect("http://localhost:5173");
      }

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 3600000, // 1 hour
      });

      console.log("Token generated, redirecting to dashboard", token);

      req.logIn(user, (err) => {
        if (err) return next(err);
        return res.redirect("http://localhost:5173/dashboard");
      });
    }
  )(req, res, next);
};
