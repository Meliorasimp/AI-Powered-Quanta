import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph";
import { hideLoginForm } from "../../modules/Interaction.ts";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";
import google from "../../assets/google.png";
import loginimage from "../../assets/verifydata.svg";
import github from "../../assets/github.png";
import Button from "../Button";

import { RootState } from "../../store.ts";
import {
  setLoginPassword,
  setLoginEmail,
  loginUser,
  setUser,
} from "../../modules/Api/Users/userslice.ts";
import { useNavigate } from "react-router-dom";
import { LoginUser } from "../../modules/Interaction.ts";
import "../../styles/index.css";
import { useState } from "react";
const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const emailValue = useAppSelector((state: RootState) => state.login.email);
  const passwordValue = useAppSelector(
    (state: RootState) => state.login.password
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLoginEmail(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setLoginPassword(e.target.value));
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  const handleGithubLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/github`;
  };

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!emailValue || !passwordValue) {
      setFormError("Both fields are required.");
      return;
    }
    setFormError(null);
    setSubmitting(true);
    try {
      const result = await dispatch(
        loginUser({ email: emailValue, password: passwordValue })
      ).unwrap();
      dispatch(LoginUser());
      dispatch(
        setUser({
          email: result.user.email,
          id: result.user.id,
          username: result.user.username,
        })
      );
      dispatch(hideLoginForm());
      navigate("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) setFormError(error.message);
      else setFormError("Login failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-800/70 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.15] mix-blend-overlay bg-[radial-gradient(circle_at_20%_25%,#10b981,transparent_60%),radial-gradient(circle_at_85%_70%,#6366f1,transparent_55%)]" />
        <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
          <button
            onClick={() => dispatch(hideLoginForm())}
            aria-label="Close login modal"
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            ✕
          </button>
          <div className="space-y-3">
            <Heading
              label="Welcome back to Quanta"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500"
            />
            <Paragraph
              label="Log in to access your dashboard, budgets, goals and personalized insights."
              variant="secondary"
            />
          </div>
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col gap-5 mt-2"
          >
            {formError && (
              <div className="text-[13px] rounded-md border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2">
                {formError}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-xs font-medium tracking-wide uppercase text-white/60"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={emailValue}
                onChange={handleEmailChange}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-xs font-medium tracking-wide uppercase text-white/60"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={passwordValue}
                onChange={handlePasswordChange}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
                autoComplete="current-password"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-white/50">
              <span>Secure sign‑in</span>
              <button
                type="button"
                className="text-emerald-300 hover:text-emerald-200 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>
            <Button
              label={submitting ? "Signing In..." : "Sign In"}
              type="submit"
              onClick={() => {}}
              className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-sm font-semibold tracking-wide shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 focus:ring-4 focus:ring-emerald-300/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
            />
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <span className="text-[10px] tracking-wider uppercase text-white/40">
                Or continue with
              </span>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="group flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2.5 text-sm font-medium text-white transition"
              >
                <img src={google} alt="Google" className="w-5 h-5" />
                <span>Google</span>
              </button>
              <button
                type="button"
                onClick={handleGithubLogin}
                className="group flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 px-3 py-2.5 text-sm font-medium text-white transition"
              >
                <img src={github} alt="GitHub" className="w-5 h-5" />
                <span>GitHub</span>
              </button>
            </div>
            <Button
              label="Cancel"
              type="button"
              onClick={() => dispatch(hideLoginForm())}
              className="w-full py-2.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-sm font-medium tracking-wide transition shadow focus:ring-2 focus:ring-red-400/40"
            />
            <p className="text-[10px] text-white/40 text-center leading-relaxed pt-2">
              By signing in you agree to the processing of data in accordance
              with our placeholder Terms & Privacy. This interface is in
              preview.
            </p>
          </form>
        </div>
        {/* Right / Illustration Section */}
        <div className="relative hidden lg:flex items-center justify-center p-10 bg-gradient-to-br from-emerald-500/10 via-green-400/5 to-transparent">
          <div className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay bg-[radial-gradient(circle_at_30%_35%,#10b981,transparent_60%),radial-gradient(circle_at_75%_65%,#6366f1,transparent_55%)]" />
          <img
            src={loginimage}
            alt="Secure login illustration"
            className="max-w-md w-full drop-shadow-[0_5px_25px_rgba(0,0,0,0.45)] animate-[float_10s_ease-in-out_infinite]"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
