import { type JSX } from "react";
import "../../../styles/index.css";

type HeadingProps = {
  label: string;
  level?: 1 | 2;
  className?: string;
  id?: string;
};

function Heading({ label, level, className }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={className}>{label}</Tag>;
}

export default Heading;
