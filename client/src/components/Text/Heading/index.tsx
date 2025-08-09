import { type JSX } from "react";

type HeadingProps = {
  label: string;
  level: 1 | 2;
  className?: string;
  id?: string;
};

const styles = {
  1: "text-3xl font-semibold text-gray-900",
  2: "text-2xl font-semibold text-gray-800",
};

function Heading({ label, level }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  return <Tag className={styles[level]}>{label}</Tag>;
}

export default Heading;
