type ParagraphProps = {
  label: string | number;
  variant: "primary" | "secondary" | "tertiary";
  className?: string;
  id?: string;
};

const styles = {
  primary: "text-xl text-gray-100",
  secondary: "text-base font-light",
  tertiary: "lg:text-lg md:text-lg sm:text-sm opacity-80",
};

function Paragraph({ label, variant }: ParagraphProps) {
  return <p className={styles[variant]}>{label}</p>;
}

export default Paragraph;
