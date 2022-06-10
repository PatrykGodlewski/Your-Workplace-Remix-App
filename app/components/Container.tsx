import React from "react";
import type { ReactNode, FC } from "react";

interface Props {
  children: ReactNode;
}

export const Container: FC<Props> = ({ children }) => {
  return (
    <main className="container mx-auto h-screen flex justify-center items-center ">
      <div
        className="rounded shadow-md max-w-lg w-4/5 bg-slate-700 h-min flex"
        data-light=""
      >
        {children}
      </div>
    </main>
  );
};
