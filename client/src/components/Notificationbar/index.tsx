import { Archive, Eye, Search, Trash } from "lucide-react";

import Button from "../Button";
type Notificationbarprops = {
  title: string;
  timestamp: Date;
  message: string;
  categorytag: categories;
};

type categories = "Bill payment" | "Message" | "Alert";

function NotificationBar({
  title,
  timestamp,
  message,
  categorytag,
}: Notificationbarprops) {
  return (
    <div className="flex flex-col py-5 px-5 border border-gray-500 rounded-lg">
      <div className="flex flex-row justify-between gap-x-5 pb-2">
        <h3 className="text-white text-lg w-fit cursor-pointer">{title}</h3>
        {categorytag === "Bill payment" && (
          <span className="font-extralight text-white bg-yellow-600 rounded-lg px-2 py-1">
            {categorytag}
          </span>
        )}
        {categorytag === "Message" && (
          <span className="font-extralight text-white bg-purple-600 rounded-lg px-2 py-1">
            {categorytag}
          </span>
        )}
        {categorytag === "Alert" && (
          <span className="font-extralight text-white bg-red-600 rounded-lg px-2 py-1">
            {categorytag}
          </span>
        )}
      </div>
      <span className="font-extralight text-sm text-gray-400">
        {timestamp.toLocaleString()}
      </span>
      <h5 className="text-gray-300 pb-3">{message}</h5>
      <div className="flex flex-row justify-start gap-x-10">
        <Button
          label="Delete"
          className="text-blue-500 hover:underline cursor-pointer inline-block"
          type="button"
          icon={<Trash className="inline-block align-top" />}
          onClick={() => console.log("clicked!")}
        />
        <Button
          label="Archive"
          className="text-blue-500 hover:underline cursor-pointer"
          type="button"
          icon={<Archive className="inline-block align-top" />}
          onClick={() => console.log("clicked!")}
        />
        <Button
          label="Mark as Read"
          className="text-blue-500 hover:underline cursor-pointer"
          type="button"
          icon={<Eye className="inline-block align-top" />}
          onClick={() => console.log("clicked!")}
        />
        <Button
          label="View Details"
          className="text-blue-500 hover:underline cursor-pointer"
          type="button"
          icon={<Search className="inline-block align-top" />}
          onClick={() => console.log("clicked!")}
        />
      </div>
    </div>
  );
}

export default NotificationBar;
