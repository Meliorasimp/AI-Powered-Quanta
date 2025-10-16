import "../../styles/index.css";
import LandingPageNavbar from "../../components/Landingpagenavbar";
import Button from "../../components/Button";
import Heading from "../../components/Text/Heading";
import { RootState } from "../../store";
import { useAppSelector, useAppDispatch } from "../../hooks";
import RegisterForm from "../../components/Register";
import Login from "../../components/Login";
import { showRegisterForm } from "../../modules/Interaction.ts";
import { motion } from "framer-motion";
const LandingPage = () => {
  const dispatch = useAppDispatch();

  const RegisterFormState = useAppSelector(
    (state: RootState) => state.interaction.isRegisterFormVisible
  );

  const LoginFormState = useAppSelector(
    (state: RootState) => state.interaction.isLoginFormVisible
  );

  // Landing page feature highlights
  const features: { title: string; description: string; icon: string }[] = [
    {
      title: "Unified Dashboard",
      description:
        "View balances, spending trends, goals and alerts in one intuitive control center.",
      icon: "📊",
    },
    {
      title: "Smart Budgeting",
      description:
        "Create adaptive budgets that learn from your habits and flag overspending early.",
      icon: "🧠",
    },
    {
      title: "AI Insights",
      description:
        "Receive natural‑language breakdowns of your transactions and personalized savings tips.",
      icon: "🤖",
    },
    {
      title: "Goal Tracking",
      description:
        "Set financial goals and watch progress update automatically with every transaction.",
      icon: "🎯",
    },
    {
      title: "Secure Sync",
      description:
        "Bank‑grade encryption keeps your linked accounts and personal data protected.",
      icon: "🔐",
    },
    {
      title: "Real-Time Alerts",
      description:
        "Get notified about unusual activity, budget thresholds, and goal milestones instantly.",
      icon: "⚡",
    },
  ];

  return (
    <div className="landing-page-background-color landing-page-enhanced-bg relative min-h-screen w-full flex flex-col overflow-hidden">
      <div
        className="lp-orb orb-indigo"
        style={{ top: "-140px", left: "-120px" }}
      />
      <div
        className="lp-orb orb-green"
        style={{ bottom: "-160px", right: "-70px" }}
      />
      <div className="lp-orb orb-pink" style={{ top: "40%", left: "65%" }} />
      <div
        className={`transition-opacity duration-300 ${
          LoginFormState
            ? "opacity-0 pointer-events-none select-none"
            : "opacity-100"
        }`}
        aria-hidden={LoginFormState ? true : false}
      >
        <LandingPageNavbar />
      </div>

      <main className="flex flex-col flex-grow w-full items-center justify-center px-4 sm:px-6 md:px-12 relative pt-32">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-black/0 to-black/20" />
        <div className="relative z-10 w-full flex flex-col items-center text-center max-w-6xl mx-auto my-12 sm:my-16">
          <motion.div
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="px-2"
          >
            <Heading
              label="Smarter Spending Starts with Better Tracking!"
              className="text-3xl sm:text-4xl md:text-6xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500 drop-shadow-[0_2px_6px_rgba(0,0,0,0.25)] max-w-5xl mx-auto"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
            className="mt-5 sm:mt-6 text-sm sm:text-lg md:text-xl font-light leading-relaxed text-white/85 max-w-3xl mx-auto px-2"
          >
            <Heading
              label="Take control of your finances effortlessly. Track your spending, plan your budget, and watch your savings grow."
              className="!font-normal"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 sm:mt-10 flex flex-col items-center gap-6"
          >
            <Button
              label="Get Started"
              type="button"
              onClick={() => dispatch(showRegisterForm())}
              className="py-3.5 px-8 sm:py-4 sm:px-10 md:py-5 md:px-12 rounded-full text-base sm:text-lg font-semibold bg-green-500/90 hover:bg-green-500 focus:ring-4 focus:ring-green-300/40 shadow-lg shadow-green-600/30 hover:shadow-green-500/40 transition-all duration-300 cursor-pointer backdrop-blur-sm"
            />
            <div className="flex items-center gap-3 text-[11px] sm:text-xs text-white/55">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> No
                credit card needed
              </div>
              <div className="hidden sm:inline-block w-1 h-1 rounded-full bg-white/30" />
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />{" "}
                Zero lock‑in
              </div>
            </div>
          </motion.div>

          {/* Supporting small trust / tagline row (optional future) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-white/60"
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Secure • Private • Insightful
            </span>
          </motion.div>
        </div>
      </main>

      {/* Stats Strip */}
      <section className="relative w-full pb-4">
        <div className="gradient-divider max-w-5xl mx-auto mb-10 opacity-70" />
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            {[
              { k: "activeUsers", label: "Active Users", value: "12k+" },
              { k: "budgetsTracked", label: "Budgets Tracked", value: "48k+" },
              { k: "goalsSet", label: "Goals Funded", value: "7.2k" },
              { k: "satisfaction", label: "Satisfaction", value: "97%" },
            ].map((s, i) => (
              <motion.div
                key={s.k}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.07 }}
                className="flex flex-col items-center"
              >
                <span className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 to-green-500 drop-shadow">
                  {s.value}
                </span>
                <span className="mt-1 text-[11px] sm:text-xs tracking-wide uppercase text-white/55 font-medium">
                  {s.label}
                </span>
              </motion.div>
            ))}
          </div>
          <p className="mt-6 text-[10px] sm:text-xs text-center text-white/35 tracking-wide">
            * Metrics shown are sample design placeholders and do not represent
            live platform data.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative w-full py-20 sm:py-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-200 via-emerald-400 to-green-500"
            >
              Everything You Need To Master Your Money
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-4 text-sm sm:text-base md:text-lg text-white/70 leading-relaxed"
            >
              Quanta combines automation, clarity and intelligence so you can
              focus on what matters—not spreadsheets.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto">
            {features.map((f, idx) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.55,
                  delay: idx * 0.05,
                  ease: "easeOut",
                }}
                className="relative group rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-emerald-300/40 p-6 sm:p-7 flex flex-col items-center text-center shadow-[0_4px_18px_-4px_rgba(0,0,0,0.35)] hover:shadow-[0_8px_26px_-4px_rgba(0,0,0,0.45)] transition-all duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/80 to-green-600/80 text-2xl shadow-lg shadow-emerald-600/30 mb-5 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm sm:text-base text-white/65 leading-relaxed">
                  {f.description}
                </p>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 bg-gradient-to-br from-emerald-400/5 via-green-500/5 to-transparent pointer-events-none transition-opacity duration-500" />
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-16 text-center"
          >
            <Button
              label="Create Your Free Account"
              type="button"
              onClick={() => dispatch(showRegisterForm())}
              className="mx-auto py-3.5 px-10 rounded-full text-base sm:text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 focus:ring-4 focus:ring-emerald-300/40 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-500/40 transition-all duration-300"
            />
            <p className="mt-4 text-xs sm:text-sm text-white/55">
              No credit card required • Instant setup • Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* About Section (anchor target) */}
      <section
        id="about"
        className="relative w-full py-24 px-4 sm:px-8 flex items-center justify-center scroll-mt-24 anchor-offset"
      >
        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-300 via-green-400 to-emerald-500"
            >
              About Quanta
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-sm sm:text-base md:text-lg text-white/70 leading-relaxed"
            >
              Quanta is a financial clarity platform focused on giving everyday
              people intelligent visibility into spending, budgeting and goal
              progress without the spreadsheet drag. Our adaptive insights help
              you take action earlier—whether that means re‑allocating a budget,
              accelerating a savings goal or avoiding overspending.
            </motion.p>
            <motion.ul
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="grid gap-3 text-white/75 text-sm"
            >
              {[
                "AI assisted transaction summaries",
                "Goal progress auto-updates",
                "Multi-source spend aggregation",
                "Privacy-first design (no selling of data)",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-1 w-2 h-2 rounded-full bg-emerald-400" />
                  <span>{item}</span>
                </li>
              ))}
            </motion.ul>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="pt-2"
            >
              <Button
                label="Get Started"
                type="button"
                onClick={() => dispatch(showRegisterForm())}
                className="py-3 px-8 rounded-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-sm sm:text-base font-semibold shadow-lg shadow-emerald-700/30 hover:shadow-emerald-500/40 transition"
              />
            </motion.div>
          </div>
          <div className="relative h-full min-h-[320px] flex items-center justify-center">
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-emerald-400/10 via-green-600/5 to-transparent border border-white/10 backdrop-blur-sm" />
            <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
              {[
                { k: "insight", v: "Real-time insights" },
                { k: "adaptive", v: "Adaptive budgets" },
                { k: "secure", v: "Secure sync" },
                { k: "goals", v: "Motivating goals" },
              ].map((c) => (
                <div
                  key={c.k}
                  className="rounded-xl border border-white/10 bg-white/5 p-4 text-center text-[11px] sm:text-xs font-medium tracking-wide text-white/80 shadow-md shadow-black/40"
                >
                  {c.v}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative w-full py-14 sm:py-24 px-4 sm:px-8 flex items-center justify-center">
        <div className="absolute inset-0 pointer-events-none opacity-[0.07] bg-[radial-gradient(circle_at_30%_40%,#10b981,transparent_65%)]" />
        <div className="max-w-6xl mx-auto w-full relative">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl sm:text-3xl font-bold tracking-tight"
            >
              Loved by people who love clarity
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-3 text-sm sm:text-base text-white/70"
            >
              Early users are already transforming the way they budget, plan and
              grow.
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                name: "Amara T.",
                role: "Freelance Designer",
                quote:
                  "Quanta turned my chaotic income into a plan. The AI insights feel like a financial co-pilot.",
              },
              {
                name: "Devon R.",
                role: "Startup Founder",
                quote:
                  "The real-time budgeting and alerts keep us disciplined without spreadsheets.",
              },
              {
                name: "Lina P.",
                role: "Graduate Student",
                quote:
                  "Seeing goal progress update automatically keeps me motivated every week.",
              },
            ].map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="card-surface rounded-2xl border border-white/10 hover:border-emerald-300/30 transition-colors duration-300 relative"
              >
                <div className="absolute -top-5 left-6 w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 flex items-center justify-center text-white text-sm font-semibold shadow-lg shadow-emerald-700/40 ring-2 ring-white/20">
                  {t.name.split(" ")[0][0]}
                </div>
                <div className="mt-6">
                  <p className="text-sm sm:text-base text-white/75 leading-relaxed italic">
                    “{t.quote}”
                  </p>
                  <div className="mt-5 flex flex-col text-left">
                    <span className="text-sm font-semibold text-white">
                      {t.name}
                    </span>
                    <span className="text-[11px] uppercase tracking-wide text-white/50 font-medium">
                      {t.role}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 text-[10px] sm:text-xs text-center text-white/35 tracking-wide">
            * Names, roles and quotes are fictitious—displayed for interface
            demonstration only.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full pt-10 pb-14 px-4 sm:px-10 mt-auto border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-5 gap-10 md:gap-14">
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-lg font-semibold">Quanta</h4>
            <p className="text-sm text-white/65 leading-relaxed max-w-sm">
              An intelligent layer over your financial life—organize
              transactions, forecast outcomes and stay motivated with adaptive
              insights.
            </p>
            <div className="flex gap-4 mt-2 text-white/60 text-lg">
              <span
                className="hover:text-white transition-colors cursor-pointer"
                title="GitHub"
              >
                GH
              </span>
              <span
                className="hover:text-white transition-colors cursor-pointer"
                title="Twitter"
              >
                X
              </span>
              <span
                className="hover:text-white transition-colors cursor-pointer"
                title="Discord"
              >
                Ds
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">
              Product
            </span>
            <a className="hover:text-white/90 text-white/65" href="#">
              Features
            </a>
            <a className="hover:text-white/90 text-white/65" href="#">
              Pricing
            </a>
            <a className="hover:text-white/90 text-white/65" href="#">
              Roadmap
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">
              Company
            </span>
            <a className="hover:text-white/90 text-white/65" href="#">
              About
            </a>
            <a className="hover:text-white/90 text-white/65" href="#">
              Careers
            </a>
            <a className="hover:text-white/90 text-white/65" href="#">
              Blog
            </a>
          </div>
          <div className="flex flex-col gap-3 text-sm">
            <span className="text-xs font-semibold uppercase tracking-wide text-white/55">
              Resources
            </span>
            <a className="hover:text-white/90 text-white/65" href="#">
              Help Center
            </a>
            <a className="hover:text-white/90 text-white/65" href="#">
              Security
            </a>
            <a className="hover:text-white/90 text-white/65" href="#">
              API
            </a>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-white/10 text-center text-[11px] text-white/50 space-y-2">
          <p className="text-[10px] sm:text-[11px] text-white/40">
            Disclaimer: All statistics and testimonial profiles on this page are
            illustrative placeholders and not real user data.
          </p>
          <p>© {new Date().getFullYear()} Quanta. All rights reserved.</p>
        </div>
      </footer>

      {/* Auth Modals */}
      {RegisterFormState && <RegisterForm />}
      {LoginFormState && <Login />}
    </div>
  );
};

export default LandingPage;
