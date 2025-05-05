"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { useAuth } from "@/lib/AuthContext";
import { SecureFormRoot } from "./SecureFormRoot";
import { EAuthModes } from "@/helpers/authentication.helper";
import { IAuthResponse } from "@/types/auth";
import { signInAction } from "@/actions/signInAction";
import { signUpAction } from "@/actions/signUpAction";

type TAuthRoot = {
  authMode: EAuthModes;
  nextPath?: string;
};

export function AuthForm(props: TAuthRoot) {
  const { authMode, nextPath } = props;
  const { user, setUser } = useAuth();
  const router = useRouter();
  // useEffect(() => {
  //   // If user already null avoid unnecessary context updates.
  //   // since browser may have removed cookie, remove user for
  //   // ui changes
  //   if (user !== null) {
  //     setUser(null);
  //   }
  // }, [user]);
  // works the first time but if you try again and get redirect here with next_path, it won't show
  useEffect(() => {
    if (nextPath && typeof window !== "undefined") {
      addToast({
        title: "Must be authenticated",
        color: "warning",
      });
      // const toastShownKey = "__auth_redirect_toast_shown";
      // if (!sessionStorage.getItem(toastShownKey)) {
      //   addToast({
      //     title: "Must be authenticated",
      //     color: "warning",
      //   });
      //   sessionStorage.setItem(toastShownKey, "true");
      // }
    }
  }, [nextPath]);

  return (
    <SecureFormRoot<"email" | "password", IAuthResponse>
      action={authMode === "SIGN_IN" ? signInAction : signUpAction}
      defaultTouched={{ email: false, password: false }}
      onSuccess={(data) => {
        addToast({
          title: `Successfully ${authMode === "SIGN_IN" ? "Logged In" : "Registered"}`,
          color: "success",
        });
        setUser(data);
        router.replace(nextPath ?? "/");
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
          <Button type="submit" disabled={isPending} color="primary" isLoading={isPending}>
            {isPending ? "Submitting..." : "Submit"}
          </Button>
        </>
      )}
    </SecureFormRoot>
  );
}
