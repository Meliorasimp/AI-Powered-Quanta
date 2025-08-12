import "../../styles/index.css";
type budgetcardprops = {
  title: string;
  amountallocated: number;
  description: string;
  progress?: number;
  className?: string;
  startdate: Date;
  enddate: Date;
};

function Budgetcard({
  title,
  amountallocated,
  description,
  progress = 0,
  className,
  startdate,
  enddate,
}: budgetcardprops) {
  return (
    <div
      className={`budget-card flex flex-col justify-between p-2 shadow-xl ${className}`}
    >
      <div className="flex flex-col">
        <span className="text-xl">{`$${amountallocated}`}</span>
        <span className="text-lg">{title}</span>
      </div>
      <div className="flex flex-row justify-between">
        <div className="flex flex-col items-start">
          <span className="text-md text-gray-400">Description:</span>
          <span className="text-md text-gray-400">Amount Allocated:</span>
          <span className="text-md text-gray-400">Start Date:</span>
          <span className="text-md text-gray-400">End Date:</span>
          <span className="text-md text-gray-400">Progress:</span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-md">{description}</span>
          <span className="text-md">{`$${amountallocated}`}</span>
          <span className="text-md">
            {new Date(startdate).toLocaleDateString()}
          </span>
          <span className="text-md">
            {new Date(enddate).toLocaleDateString()}
          </span>
          <span className="text-md">{`${progress}%`}</span>
        </div>
      </div>
    </div>
  );
}

export default Budgetcard;
