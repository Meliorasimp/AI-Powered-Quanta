import Heading from "../Text/Heading";
import "../../styles/index.css";
import { useAppDispatch } from "../../hooks";
import { showRegisterForm } from "../../modules/Interaction.ts";
import Button from "../Button/index.tsx";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const LandingPageNavbar = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 w-full z-[100] flex items-center justify-between text-base sm:text-lg font-light transition-all duration-300
        ${
          scrolled
            ? "bg-black/65 backdrop-blur-xl border-b border-white/15 shadow-[0_8px_28px_-8px_rgba(0,0,0,0.6)] px-6 py-3"
            : "bg-black/35 backdrop-blur-md border-b border-white/10 shadow-[0_4px_18px_-6px_rgba(0,0,0,0.45)] px-6 py-4"
        }
      `}
    >
      <Heading
        label="Quanta"
        className={`font-extrabold tracking-tight cursor-pointer transition-all duration-300 ${
          scrolled ? "text-lg sm:text-xl" : "text-xl sm:text-2xl"
        }`}
      />
      <div className="hidden sm:flex flex-row items-center gap-10">
        <Button
          label="Home"
          className="glow-text-white cursor-pointer"
          type="button"
          onClick={() => navigate("/")}
        />
        <Button
          label="About"
          className="glow-text-white cursor-pointer"
          type="button"
          onClick={() => {
            const el = document.getElementById("about");
            if (el) {
              const rect = el.getBoundingClientRect();
              const absoluteY = window.scrollY + rect.top;
              const offset = 110; // nav height + breathing room
              window.scrollTo({ top: absoluteY - offset, behavior: "smooth" });
            } else {
              navigate("/about"); // Fallback if section missing
            }
          }}
        />
        <Button
          label="Contact"
          className="glow-text-white cursor-pointer"
          type="button"
          onClick={() => navigate("/contact")}
        />
      </div>
      <div className="flex flex-row items-center gap-6">
        <Button
          label="Sign Up"
          onClick={() => dispatch(showRegisterForm())}
          type="button"
          className="glow-text-white z-10"
        />
      </div>
    </nav>
  );
};

export default LandingPageNavbar;
