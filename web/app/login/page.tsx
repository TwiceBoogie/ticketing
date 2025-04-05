import React from "react";

import DefaultLayout from "@/layouts/default-layout";
// import { AuthRoot } from "@/components/auth";
import { EAuthModes } from "@/helpers/authentication.helper";
import { CsrfProvider } from "@/components/forms/CsrfProvider";
import { AuthForm } from "@/components/forms/AuthForm";

export default async function Login() {
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <CsrfProvider>
            <AuthForm authMode={EAuthModes.SIGN_IN} />
          </CsrfProvider>
        </div>
      </div>
    </DefaultLayout>
  );
}
