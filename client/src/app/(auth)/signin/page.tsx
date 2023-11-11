"use client";

import { useState, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";

interface SigninRes {
  status: number;
  message:
    | {
        id: number;
        email: string;
      }
    | string;
  errors: {
    message: string;
    field?: string;
  }[];
}

export default function Signin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidE, setInvalidE] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email) {
      setInvalidE(true);
    }
    if (!password || password.length <= 6) {
      setInvalidP(true);
    }
    if (email && password) {
      try {
        setError("");
        const res = await fetch("/api/signin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const data: SigninRes = await res.json();
        if (data.status === 200) {
          router.push("/");
        }
        if (data.status !== 201) {
          data.errors.map((error) => {
            if (Object.keys(error).length === 1) {
              setError(error.message);
            } else {
              if (error.field === "email") setInvalidE(true);
              if (error.field === "password") setInvalidP(true);
            }
          });
        }
      } catch (error) {
        setError("Server error, please try again later.");
      }
    }
  };

  return (
    <div className="card1 p-10">
      <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
        Sign in to your account
      </h2>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
        {error && (
          <div
            className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
            role="alert"
          >
            <svg
              className="flex-shrink-0 inline w-4 h-4 mr-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div>{error}</div>
          </div>
        )}
        <form className="space-y-6 text-black" onSubmit={onSubmit}>
          <Input
            type="email"
            label="Email"
            size={"sm"}
            value={email}
            onChange={(e) => {
              setInvalidE(false);
              setEmail(e.target.value);
            }}
            isInvalid={invalidE}
            errorMessage={invalidE && "Please enter a valid email"}
          />
          <Input
            type="password"
            label="Password"
            size={"sm"}
            value={password}
            onChange={(e) => {
              setInvalidP(false);
              setPassword(e.target.value);
            }}
            isInvalid={invalidP}
            errorMessage={invalidP && "Password length must be 6 or greater"}
          />
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
