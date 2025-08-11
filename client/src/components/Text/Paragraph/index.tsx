type ParagraphProps = {
  label: string;
  variant: "primary" | "secondary" | "tertiary";
  className?: string;
  id?: string;
};

const styles = {
  primary: "text-xl text-gray-100",
  secondary: "text-base text-gray-300 font-light",
  tertiary: "text-base text-gray-400",
};

function Paragraph({ label, variant }: ParagraphProps) {
  return <p className={styles[variant]}>{label}</p>;
}

export default Paragraph;
