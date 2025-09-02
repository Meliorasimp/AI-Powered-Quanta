type cardprops = {
  label: string;
  value?: string;
  className?: string;
  icon?: React.ReactNode;
};

function Statcard({ label, value, className, icon }: cardprops) {
  return (
    <div
      className={`border-gray-400 text-gray-400 w-1/5 rounded-xl flex ${className}`}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      <div className="flex flex-col">
        <h2 className="font-semibold">{label}</h2>
        {value && <p className="text-2xl text-purple-300 font-bold">{value}</p>}
      </div>
    </div>
  );
}

export default Statcard;
