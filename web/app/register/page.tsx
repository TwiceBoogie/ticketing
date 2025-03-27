import React from "react";

import DefaultLayout from "@/layouts/default-layout";
import { AuthRoot } from "@/components/auth";
import { EAuthModes } from "@/helpers/authentication.helper";

export default function Register() {
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sign up with us</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <AuthRoot authMode={EAuthModes.SIGN_UP} />
        </div>
      </div>
    </DefaultLayout>
  );
}
