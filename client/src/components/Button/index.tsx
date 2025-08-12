type ButtonProps = {
  label?: string;
  onClick: () => void;
  type: "button" | "submit" | "reset";
  className?: string;
  id?: string;
  ariaLabel?: string;
  icon?: React.ReactNode;
};

function Button({
  label,
  onClick,
  type,
  className,
  id,
  ariaLabel,
  icon,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={className}
      id={id}
      aria-label={ariaLabel}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </button>
  );
}

export default Button;
