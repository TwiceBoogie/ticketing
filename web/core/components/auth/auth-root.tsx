"use client";

import { FC, useActionState, useState } from "react";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { signInAction } from "@/actions/signInAction";
import { EAuthModes } from "@/helpers/authentication.helper";
import { signUpAction } from "@/actions/signUpAction";

type TAuthRoot = {
  authMode: EAuthModes;
};

export const AuthRoot: FC<TAuthRoot> = (props) => {
  const { authMode: currentAuthMode } = props;
  const [state, formAction] = useActionState(currentAuthMode === "SIGN_UP" ? signUpAction : signInAction, null);
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const handleInputChange = (fieldName: "email" | "password") => {
    if (!touchedFields[fieldName]) {
      setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    }
  };

  return (
    <Form action={formAction}>
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        onChange={() => handleInputChange("email")}
        isInvalid={!touchedFields.email && !!state?.errors?.find((e) => e.path === "email")}
        errorMessage={!touchedFields.email ? state?.errors?.find((e) => e.path === "email")?.message : ""}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="password"
        onChange={() => handleInputChange("password")}
        isInvalid={!touchedFields.password && !!state?.errors?.find((e) => e.path === "password")}
        errorMessage={!touchedFields.password ? state?.errors?.find((e) => e.path === "password")?.message : ""}
      />
      <Button type="submit">Submit</Button>
    </Form>
  );
};
