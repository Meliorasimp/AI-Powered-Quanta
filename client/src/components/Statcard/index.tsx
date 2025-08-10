type cardprops = {
  label: string;
  value?: string;
  className?: string;
};

function Statcard({ label, value, className }: cardprops) {
  return (
    <div
      className={`border-gray-400 text-gray-400 w-1/5 text-center ${className}`}
    >
      <h2>{label}</h2>
      {value && <p className="text-4xl text-purple-300">{value}</p>}
    </div>
  );
}

export default Statcard;
