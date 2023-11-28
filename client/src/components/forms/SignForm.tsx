"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import DarkModeToggle from "@/components/buttons/DarkModeToggle";
import Link from "next/link";
import { Validator, classNames } from "@/core";
import { AlertBanner } from "@/components/banners";
import { SpinnerIcon } from "@/components/icons";

interface Props {
  url: string;
  btnTitle: string;
}

export const SignForm = ({ url, btnTitle }: Props) => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidE, setInvalidE] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvalidE(false);
    setShowBanner(false);
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvalidP(false);
    setShowBanner(false);
    setPassword(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setShowBanner(false);
    const formData = { email, password };
    const props = { formData, setInvalidE, setInvalidP };
    await Validator.onSubmit({
      props,
      setIsLoading,
      setError,
      router,
      url,
    });
    setShowBanner(true);
    router.push("/");
    router.refresh();
  };
  return (
    <>
      <div className="flex justify-between my-4">
        <Link href="/">
          <button className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white">
            {"<- Back"}
          </button>
        </Link>
        <DarkModeToggle />
      </div>

      {showBanner && (
        <AlertBanner
          success={error ? false : true}
          message={error ? error : "Logged In Successfully"}
        />
      )}
      <form className="mt-4 grid grid-cols-6 gap-6">
        <div className="col-span-6">
          <label
            htmlFor="Email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Email
          </label>
          <input
            type="email"
            id="Email"
            name="email"
            className={classNames(
              invalidE
                ? "border-red-500 dark:border-red-500"
                : "border-gray-200 dark:border-gray-700",
              "mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200"
            )}
            onBlur={() => {
              Validator.validateEmail({ email, setInvalidE });
            }}
            onChange={handleEmailChange}
          />
          {invalidE && (
            <span className="mt-2 text-sm text-red-500">
              Please enter a valid email address
            </span>
          )}
        </div>

        <div className="col-span-6">
          <label
            htmlFor="Password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-200"
          >
            Password
          </label>
          <input
            type="password"
            id="Password"
            name="password"
            onBlur={() => {
              Validator.validatePassword({ password, setInvalidP });
            }}
            onChange={handlePasswordChange}
            className={classNames(
              invalidP
                ? "border-red-500 dark:border-red-500"
                : "border-gray-200 dark:border-gray-700",
              "mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200"
            )}
          />
          {invalidP && (
            <span className="mt-2 text-sm text-red-500">
              Password must be between 6-36
            </span>
          )}
        </div>

        <div className="col-span-6">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {btnTitle === "Login" ? "By logging in" : "By registering with us"},
            you agree to our{" "}
            <a href="#" className="text-gray-700 underline dark:text-gray-200">
              terms and conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-gray-700 underline dark:text-gray-200">
              privacy policy
            </a>
            .
          </p>
        </div>

        <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
          <button
            className=" shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
            onClick={onSubmit}
          >
            {isLoading ? <SpinnerIcon /> : btnTitle}
          </button>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400 sm:mt-0">
            {btnTitle === "Login"
              ? "Don't have an account"
              : "Already have an account"}
            ?{" "}
            <Link
              href={btnTitle === "Login" ? "/signup" : "/signin"}
              className="text-indigo-500"
            >
              {btnTitle === "Login" ? "Register" : "Login"}
            </Link>
            .
          </p>
        </div>
      </form>
    </>
  );
};
