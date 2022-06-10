import React from "react";

interface Props
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  type?: "text" | "password" | "checkbox";
  id?: string;
  name?: string;
  defaultValue?: string;
  ariaInvalid?: boolean | "false" | "true" | "grammar" | "spelling" | undefined;
  ariaErrorMessage?: string;
  handler?: React.ChangeEventHandler<HTMLInputElement> | undefined;
}

type OnlyKeys = keyof typeof STYLES;

const STYLES = {
  PASSWORD: "w-full rounded py-2 px-4 text-slate-900",
  TEXT: "w-full rounded py-2 px-4 text-slate-900",
  CHECKBOX: ` h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 checked:text-white focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer`,
};

const Input = ({
  id,
  name,
  defaultValue,
  type,
  ariaInvalid,
  ariaErrorMessage,
  handler,
}: Props) => {
  return (
    <input
      className={type && STYLES[type.toUpperCase() as OnlyKeys]}
      id={id}
      name={name}
      defaultValue={defaultValue}
      type={type}
      aria-invalid={ariaInvalid}
      aria-errormessage={ariaErrorMessage}
      onChange={handler}
    />
  );
};

export default Input;
