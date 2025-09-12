type ButtonProps = {
  label?: string;
  onClick?: () => void;
  type: "button" | "submit" | "reset";
  className?: string;
  id?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
  isClicked?: boolean;
};

function Button({
  label,
  onClick,
  type,
  className,
  id,
  ariaLabel,
  icon,
  isClicked,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`${className ?? ""} ${isClicked ? "clicked" : ""}`.trim()}
      id={id}
      aria-label={ariaLabel}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}

export default Button;
