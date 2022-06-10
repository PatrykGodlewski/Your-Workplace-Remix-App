import React from "react";
import type { LoaderFunction } from "@remix-run/node";
import { requireUserId } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  return null;
};

const Workspace = () => {
  return <div>WORKSPACE</div>;
};

export default Workspace;
