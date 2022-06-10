import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData } from "@remix-run/react";
import React from "react";
import Button from "~/components/Button";
import Input from "~/components/Input";
import { createUserSession, getUser, login } from "~/utils/session.server";
import LoginHero from "~/images/patternpad2.svg";
import { Container } from "~/components/Container";

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
  };
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Usernames must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

const badRequest = (data: ActionData) => json(data, { status: 400 });

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUser(request);
  if (user) return redirect("/");
  return null;
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const username = form.get("username");
  const password = form.get("password");
  if (typeof username !== "string" || typeof password !== "string") {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  const fields = { username, password };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });
  const user = await login({ username, password });
  if (!user) return badRequest({ formError: "Invalid credentials", fields });
  return createUserSession(user.id, "/workspace");
};

export default function Login() {
  const actionData = useActionData<ActionData>();
  return (
    <Container>
      <div className="w-2/3 p-8">
        <header className="mb-4">
          <h1 className="font-bold text-4xl">Welcome</h1>
          <h3 className="text-sm">
            Dive in to your personal
            <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 ml-1">
              workspace
            </span>
          </h3>
        </header>
        <form method="post" className="flex flex-col gap-4">
          <div>
            <label htmlFor="username-input">Username</label>
            <Input
              className="w-full rounded py-2 px-4 text-slate-900"
              type="text"
              id="username-input"
              name="username"
              defaultValue={actionData?.fields?.username}
              aria-invalid={Boolean(actionData?.fieldErrors?.username)}
              aria-errormessage={
                actionData?.fieldErrors?.username ? "username-error" : undefined
              }
            />
            {actionData?.fieldErrors?.username ? (
              <p
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
                id="username-error"
              >
                {actionData.fieldErrors.username}
              </p>
            ) : null}
          </div>
          <div>
            <label htmlFor="password-input">Password</label>
            <Input
              id="password-input"
              name="password"
              defaultValue={actionData?.fields?.password}
              type="password"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.password) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.password ? "password-error" : undefined
              }
            />

            {actionData?.fieldErrors?.password ? (
              <p
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
                id="password-error"
              >
                {actionData.fieldErrors.password}
              </p>
            ) : null}
          </div>
          {actionData?.formError ? (
            <div id="form-error-message">
              <p
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
              >
                {actionData.formError}
              </p>
            </div>
          ) : null}
          <div className="flex justify-between">
            <div>
              <Input
                id="remember-me"
                name="remember-me"
                // defaultValue={}
                type="checkbox"
                // aria-invalid={}
                // aria-errormessage={}
              />
              <label htmlFor="remember-me">Remember me</label>
            </div>
            <Link
              className="text-blue-400 hover:underline "
              to="/forgot-password"
            >
              Forgot password?
            </Link>
          </div>
          <Button type="submit" text="Dive in" full />
          <p>
            Not registered yet?
            <Link to="/register" className="ml-2 text-blue-400 hover:underline">
              Create an Account
            </Link>
          </p>
        </form>
      </div>
      <div className="w-1/3 flex items-center justify-center overflow-hidden">
        <img
          className="rounded-r object-cover object-left-top object h-full"
          src={LoginHero}
          alt="Floating person"
        />
      </div>
    </Container>
  );
}
