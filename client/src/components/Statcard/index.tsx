type cardprops = {
  label: string;
  value?: string;
  className?: string;
};

function Statcard({ label, value, className }: cardprops) {
  return (
    <div
      className={`border-gray-400 text-gray-400 w-1/5 rounded-xl ${className}`}
    >
      <h2 className="font-semibold">{label}</h2>
      {value && <p className="text-3xl text-purple-300 font-bold">{value}</p>}
    </div>
  );
}

export default Statcard;
