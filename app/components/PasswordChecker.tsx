import React, { useEffect } from "react";

interface Props {
  amount: string;
}

type OnlyKeys = keyof typeof STYLES;

const STYLES = {
  "0": "w-0",
  "1": "bg-red-600 w-1/4",
  "2": "bg-yellow-600 w-2/4",
  "3": "bg-green-300 w-3/4",
  "4": "bg-green-600 w-full",
};

const PasswordChecker = ({ amount }: Props) => {
  return (
    <div className="bg-gray-800 rounded w-full h-2 mt-4">
      <div
        className={`${
          STYLES[amount as OnlyKeys]
        } transition-all h-full rounded`}
      ></div>
    </div>
  );
};

export default PasswordChecker;
