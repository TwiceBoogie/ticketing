"use client";

import React from "react";
import { useRouter } from "next/router";
import { Input } from "@heroui/input";

import { useAuth } from "@/lib/AuthContext";
import { SecureFormRoot } from "./SecureFormRoot";
import { EAuthModes } from "@/helpers/authentication.helper";
import { IAuthResponse } from "@/types/auth";
import { signInAction } from "@/actions/signInAction";
import { signUpAction } from "@/actions/signUpAction";
import { Button } from "@heroui/react";

type TAuthRoot = {
  authMode: EAuthModes;
};

export function AuthForm(props: TAuthRoot) {
  const { authMode } = props;
  const action = authMode === "SIGN_IN" ? signInAction : signUpAction;
  const { setUser } = useAuth();
  const router = useRouter();

  return (
    <SecureFormRoot<"email" | "password", IAuthResponse>
      action={action}
      defaultTouched={{ email: false, password: false }}
      onSuccess={(data) => {
        setUser(data);
        router.push("/");
      }}
    >
      {({ getError, handleInputChange, touched, isPending }) => (
        <>
          <Input
            label="Email"
            name="email"
            type="email"
            onChange={() => handleInputChange("email")}
            isInvalid={!touched.email && !!getError("email")}
            errorMessage={!touched.email ? getError("email") : ""}
          />
          <Input
            label="Password"
            name="password"
            type="password"
            onChange={() => handleInputChange("password")}
            isInvalid={!touched.password && !!getError("password")}
            errorMessage={!touched.password ? getError("password") : ""}
          />
          <Button type="submit" disabled={isPending} color="primary">
            {isPending ? "Submitting..." : "Sign In"}
          </Button>
        </>
      )}
    </SecureFormRoot>
  );
}
