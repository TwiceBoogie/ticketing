import React from "react";

import { AuthForm } from "@/components/forms/AuthForm";
import { EAuthModes } from "@/helpers/authentication.helper";
import DefaultLayout from "@/layouts/default-layout";

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { next_path } = await searchParams;
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">
            Sign in to your account
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <AuthForm authMode={EAuthModes.SIGN_IN} nextPath={next_path as string} />
        </div>
      </div>
    </DefaultLayout>
  );
}
