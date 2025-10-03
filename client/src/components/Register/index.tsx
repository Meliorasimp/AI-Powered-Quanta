import Button from "../Button";
import Heading from "../Text/Heading";
import Paragraph from "../Text/Paragraph";
import investment from "../../assets/undraw_investment-data_frxx.svg";
import {
  switchToLoginForm,
  hideRegisterForm,
} from "../../modules/Interaction.ts";
import { RootState } from "../../store.ts";
import {
  setRegisterEmail,
  setRegisterUsername,
  setRegisterPassword,
  registerUser,
  resetRegisterForm,
  setLoggedIn,
} from "../../modules/Api/Users/userslice.ts";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/index.ts";
import { useState, useMemo } from "react";

const RegisterForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const emailAddressValue = useAppSelector(
    (state: RootState) => state.register.email
  );
  const usernameValue = useAppSelector(
    (state: RootState) => state.register.username
  );
  const passwordValue = useAppSelector(
    (state: RootState) => state.register.password
  );

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterEmail(e.target.value));
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterUsername(e.target.value));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setRegisterPassword(e.target.value));
  };

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  const passwordStrength = useMemo(() => {
    if (!passwordValue) return { label: "", score: 0, color: "" };
    let score = 0;
    if (passwordValue.length >= 6) score++;
    if (passwordValue.length >= 10) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    if (/\d/.test(passwordValue)) score++;
    const labels = ["Weak", "Fair", "Moderate", "Strong", "Robust"]; // up to 5
    const colors = ["#f87171", "#fb923c", "#fbbf24", "#34d399", "#10b981"];
    const idx = Math.min(score - 1, labels.length - 1);
    return {
      label: score ? labels[idx] : "",
      score,
      color: score ? colors[idx] : "transparent",
    };
  }, [passwordValue]);

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!emailAddressValue || !usernameValue || !passwordValue) {
      setFormError("All fields are required.");
      return;
    }
    if (passwordValue.length < 6) {
      setFormError("Password must be at least 6 characters long.");
      return;
    }
    try {
      setSubmitting(true);
      const result = await dispatch(
        registerUser({
          email: emailAddressValue,
          username: usernameValue,
          password: passwordValue,
        })
      ).unwrap();
      if (result.success) {
        setFormSuccess("Account created successfully. Redirecting...");
        dispatch(setLoggedIn(true));
        dispatch(resetRegisterForm());
        setTimeout(() => {
          dispatch(hideRegisterForm());
          navigate("/dashboard");
        }, 900);
      }
    } catch (err: unknown) {
      if (err instanceof Error) setFormError(err.message);
      else setFormError("Registration failed. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 py-6 bg-black/80 backdrop-blur-xl">
      <div className="relative w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-gradient-to-br from-slate-900/85 via-slate-900/65 to-slate-800/70 backdrop-blur-xl">
        <div className="pointer-events-none absolute inset-0 opacity-[0.18] mix-blend-overlay bg-[radial-gradient(circle_at_25%_30%,#10b981,transparent_60%),radial-gradient(circle_at_80%_70%,#6366f1,transparent_55%)]" />
        {/* Illustration Side */}
        <div className="hidden lg:flex flex-col items-center justify-center p-10 relative">
          <img
            src={investment}
            alt="Investment growth illustration"
            className="max-w-md w-full drop-shadow-[0_5px_25px_rgba(0,0,0,0.45)] animate-[float_10s_ease-in-out_infinite]"
          />
          <div className="mt-8 text-center space-y-2 max-w-sm">
            <h4 className="text-lg font-semibold text-white/90">
              Build momentum
            </h4>
            <p className="text-xs text-white/55 leading-relaxed">
              Track, adjust and celebrate progress toward savings and spending
              goals.
            </p>
          </div>
        </div>
        {/* Form Side */}
        <div className="relative flex flex-col gap-6 p-8 sm:p-10 lg:p-12">
          <button
            onClick={() => dispatch(hideRegisterForm())}
            aria-label="Close register modal"
            className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors text-sm font-medium"
          >
            ✕
          </button>
          <div className="space-y-3">
            <Heading
              label="Create your Quanta account"
              className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500"
            />
            <Paragraph
              label="Start optimizing your spending and reach financial goals faster with intelligent insights."
              variant="secondary"
            />
          </div>
          <form
            onSubmit={handleRegisterSubmit}
            className="flex flex-col gap-5 mt-2"
          >
            {formError && (
              <div className="text-[13px] rounded-md border border-red-500/40 bg-red-500/10 text-red-300 px-3 py-2">
                {formError}
              </div>
            )}
            {formSuccess && (
              <div className="text-[13px] rounded-md border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 px-3 py-2">
                {formSuccess}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-email"
                className="text-xs font-medium tracking-wide uppercase text-white/60"
              >
                Email
              </label>
              <input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={emailAddressValue}
                onChange={handleEmailChange}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
                autoComplete="email"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-username"
                className="text-xs font-medium tracking-wide uppercase text-white/60"
              >
                Username
              </label>
              <input
                id="reg-username"
                type="text"
                placeholder="choose a username"
                value={usernameValue}
                onChange={handleUsernameChange}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
                autoComplete="username"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="reg-password"
                className="text-xs font-medium tracking-wide uppercase text-white/60"
              >
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                placeholder="••••••••"
                value={passwordValue}
                onChange={handlePasswordChange}
                className="rounded-lg border border-white/15 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-400/50 focus:border-emerald-400/60 transition"
                autoComplete="new-password"
              />
              {passwordValue && (
                <div className="mt-1 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(passwordStrength.score / 5) * 100}%`,
                        background: passwordStrength.color,
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-medium tracking-wide text-white/50 min-w-[52px] text-right">
                    {passwordStrength.label}
                  </span>
                </div>
              )}
            </div>
            <Button
              label={submitting ? "Creating Account..." : "Create Account"}
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-sm font-semibold tracking-wide shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 focus:ring-4 focus:ring-emerald-300/40 transition disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={() => {}}
            />
            <Button
              label="Cancel"
              type="button"
              onClick={() => dispatch(hideRegisterForm())}
              className="w-full py-2.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-sm font-medium tracking-wide transition shadow focus:ring-2 focus:ring-red-400/40"
            />
            <div className="flex items-center justify-center gap-2 text-[11px] text-white/60">
              <span>Already have an account?</span>
              <button
                type="button"
                onClick={() => dispatch(switchToLoginForm())}
                className="text-emerald-300 hover:text-emerald-200 font-medium transition-colors"
              >
                Log in
              </button>
            </div>
            <p className="text-[10px] text-white/40 text-center leading-relaxed pt-2">
              By creating an account you agree to our placeholder Terms &
              Privacy. This UI is a preview.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
