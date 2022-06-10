import React from "react";

interface Props extends React.HTMLProps<HTMLButtonElement> {
  type?: "button" | "submit" | "reset" | undefined;
  text: string;
  full?: boolean;
}

const Button = ({ type, text, full }: Props) => {
  return (
    <button
      className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
        full && "w-full"
      } text-center`}
      type={type}
    >
      {text}
    </button>
  );
};

export default Button;
