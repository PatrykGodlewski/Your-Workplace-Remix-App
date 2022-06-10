// import type { MetaFunction } from ""
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import Navigation from "./components/Navigation";

import styles from "./styles/app.css";
import globalStyles from "./styles/global.css";
import { getUser, getUserId } from "./utils/session.server";

type LoaderData = {
  ENV: {
    NODE_ENV: "development" | "production" | "test";
  };
  user: Awaited<ReturnType<typeof getUser>>;
};

export function links() {
  return [
    { rel: "stylesheet", href: styles },
    { rel: "stylesheet", href: globalStyles },
  ];
}

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Your Workplace",
  viewport: "width=device-width,initial-scale=1",
});

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);

  const data: LoaderData = {
    ENV: {
      NODE_ENV: process.env.NODE_ENV,
    },
    user,
  };
  return json(data);
};

export default function App() {
  const { ENV, user } = useLoaderData();
  return (
    <html lang="en">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="bg-slate-900 text-slate-50	">
        <Navigation user={user} />
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {ENV.NODE_ENV === "development" && <LiveReload />}
      </body>
    </html>
  );
}

// function Document({
//   children,
//   title = `Remix: So great, it's funny!`,
// }: {
//   children: React.ReactNode;
//   title?: string;
// }) {
//   return (
//     <html lang="en">
//       <head>
//         <meta charSet="utf-8" />
//         <title>{title}</title>
//         <Links />
//       </head>
//       <body>
//         {children}
//         <LiveReload />
//       </body>
//     </html>
//   );
// }

// export function ErrorBoundary({ error }: { error: Error }) {
//   return (
//     <Document title="Uh-oh!">
//       <div className="error-container">
//         <h1>App Error</h1>
//         <pre>{error.message}</pre>
//       </div>
//     </Document>
//   );
// }
