import React from "react";
import { Link } from "@remix-run/react";
import Button from "./Button";

type UserType = {
  user: {
    id: string;
    username: string;
  };
};

const Navigation = ({ user }: UserType) => {
  console.log(user);
  return (
    <div className="w-full p-4 px-8 bg-slate-600 flex justify-between">
      <Link to="/" className="font-bold text-lg flex items-center">
        WORKSPACE.IO
      </Link>
      {user ? (
        <div className="flex items-center gap-4">
          <span>{`Hi ${user.username}`}</span>
          <form action="/logout" method="post">
            <Button type="submit" text="Logout" />
          </form>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
};

export default Navigation;
