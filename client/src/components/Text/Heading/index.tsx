import { type JSX } from "react";
import "../../../styles/index.css";

type HeadingProps = {
  label: string;
  level?: 1 | 2;
  className?: string;
  id?: string;
  icon?: JSX.Element;
};

function Heading({ label, level = 2, className = "", id, icon }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;

  return (
    <Tag id={id} className={`flex items-center ${className}`}>
      {icon && <span className="mr-2 inline-flex items-center">{icon}</span>}
      {label}
    </Tag>
  );
}

export default Heading;
