import { Link } from "@remix-run/react";
import React from "react";

const index = () => {
  return (
    <div>
      <Link to={"/workspace"}>Go to your workspace</Link>
    </div>
  );
};

export default index;
