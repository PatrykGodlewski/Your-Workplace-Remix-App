import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Link, useActionData, useSearchParams } from "@remix-run/react";
import React, { useState } from "react";
import Button from "~/components/Button";
import { Container } from "~/components/Container";
import Input from "~/components/Input";
import {
  createUserSession,
  getUser,
  login,
  register,
} from "~/utils/session.server";
import LoginHero from "~/images/patternpad2.svg";
import PasswordChecker from "~/components/PasswordChecker";
import { db } from "~/utils/db.server";
const zxcvbn = require("zxcvbn");

type ActionData = {
  formError?: string;
  fieldErrors?: {
    username: string | undefined;
    password: string | undefined;
    passwordCheck: string | undefined;
  };
  fields?: {
    username: string;
    password: string;
    passwordCheck: string;
  };
};

function validateUsername(username: unknown) {
  if (typeof username !== "string" || username.length < 3) {
    return `Username must be at least 3 characters long`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Password must be at least 6 characters long`;
  }
  if (zxcvbn(password).score <= 1) {
    return "Password is too weak";
  }
}
function validatePasswordCheck(password: unknown, passwordCheck: unknown) {
  if (typeof passwordCheck !== "string" || passwordCheck !== password) {
    return `Password must be identical`;
  }
}
function passwordScore(password: unknown) {
  return zxcvbn(password).score;
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
  const passwordCheck = form.get("passwordCheck");

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    typeof passwordCheck !== "string"
  ) {
    return badRequest({
      formError: `Form not submitted correctly.`,
    });
  }
  const fields = { username, password, passwordCheck };
  const fieldErrors = {
    username: validateUsername(username),
    password: validatePassword(password),
    passwordCheck: validatePasswordCheck(password, passwordCheck),
  };
  if (Object.values(fieldErrors).some(Boolean))
    return badRequest({ fieldErrors, fields });
  const userExists = await db.user.findFirst({
    where: { username },
  });
  if (userExists) {
    return badRequest({
      fields,
      formError: `User with username ${username} already exists`,
    });
  }

  const user = await register({ username, password });

  if (!user) return badRequest({ formError: "Invalid cridentails", fields });

  return createUserSession(user.id, "/workspace");
};

export default function Register() {
  const actionData = useActionData<ActionData>();
  const [passwordStrenght, setPasswordStrenght] = useState("0");

  const handlePasswordStreanght = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const password = e.target.value;
    setPasswordStrenght(passwordScore(password));
  };
  return (
    <Container>
      {console.log(actionData)}
      <div className="w-2/3 p-8" data-light="">
        <header className="mb-4">
          <h1 className="font-bold text-4xl">Join us!</h1>
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
              handler={handlePasswordStreanght}
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

            <PasswordChecker amount={passwordStrenght} />

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
          <div>
            <label htmlFor="password-check-input">Match password</label>
            <Input
              id="password-check-input"
              name="passwordCheck"
              defaultValue={
                actionData?.fieldErrors?.passwordCheck
                  ? ""
                  : actionData?.fields?.passwordCheck
              }
              type="password"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.passwordCheck) || undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.passwordCheck
                  ? "password-check-input"
                  : undefined
              }
            />
            {actionData?.fieldErrors?.passwordCheck ? (
              <p
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
                role="alert"
                id="password-check-input"
              >
                {actionData.fieldErrors.passwordCheck}
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
          <Button type="submit" text="Register" full />
          <p>
            Already have an account?
            <Link to="/login" className="ml-2 text-blue-400 hover:underline">
              Log in here!
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
