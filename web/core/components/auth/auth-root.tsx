"use client";

import { FC, useActionState, useEffect, useState } from "react";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { signInAction } from "@/actions/signInAction";
import { EAuthModes } from "@/helpers/authentication.helper";
import { signUpAction } from "@/actions/signUpAction";
import { addToast } from "@heroui/toast";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";
import { useCsrfToken } from "@/lib/CsrfContext";

type TAuthRoot = {
  authMode: EAuthModes;
};

export const AuthRoot: FC<TAuthRoot> = (props) => {
  const csrfToken = useCsrfToken();
  const router = useRouter();

  const { authMode: currentAuthMode } = props;
  const { setUser } = useAuth();
  const [state, formAction, isPending] = useActionState(
    currentAuthMode === "SIGN_UP" ? signUpAction : signInAction,
    null
  );
  const [touchedFields, setTouchedFields] = useState({
    email: false,
    password: false,
  });

  const handleInputChange = (fieldName: "email" | "password") => {
    if (!touchedFields[fieldName]) {
      setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    }
  };

  const getError = (field: string): string | undefined => {
    if (!state || state.ok) return;
    return state.error.find((e) => e.field === field)?.message;
  };

  useEffect(() => {
    if (state && !state.ok) {
      setTouchedFields({ email: false, password: false });
      const formError = state.error.find((e) => e.field === "form");
      if (formError) {
        addToast({
          title: "Form Error",
          description: formError.message,
          color: "danger",
        });
      }
    } else if (state && state.ok) {
      setUser(state.data);
      router.push("/");
    }
  }, [state]);

  return (
    <Form action={formAction}>
      <Input type="hidden" name="csrfToken" value={csrfToken} />
      <Input
        label="Email"
        name="email"
        type="email"
        autoComplete="email"
        onChange={() => handleInputChange("email")}
        isInvalid={!touchedFields.email && !!getError("email")}
        errorMessage={!touchedFields.email ? getError("email") : ""}
      />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="password"
        onChange={() => handleInputChange("password")}
        isInvalid={!touchedFields.password && !!getError("password")}
        errorMessage={!touchedFields.password ? getError("password") : ""}
      />
      <Button type="submit" disabled={isPending} color="primary">
        {isPending ? "Submitting..." : "Submit"}
      </Button>
    </Form>
  );
};
