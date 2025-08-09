type ButtonProps = {
  label: string;
  onClick: () => void;
  type: "button" | "submit" | "reset";
  className?: string;
  id?: string;
  ariaLabel?: string;
};

function Button({
  label,
  onClick,
  type,
  className,
  id,
  ariaLabel,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={className}
      id={id}
      aria-label={ariaLabel}
    >
      {label}
    </button>
  );
}

export default Button;
