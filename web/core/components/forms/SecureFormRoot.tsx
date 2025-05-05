import { FieldError } from "@/types/common";
import { addToast, Form } from "@heroui/react";
import React, { useActionState, useEffect, useState } from "react";

type Result<T> = { ok: true; data: T } | { ok: false; error: FieldError[] };

interface SecureFormProps<TFieldNames extends string, TResult> {
  // TFieldNames = input names ex. 'password' 'email'
  action: (prevState: any, formData: FormData) => Promise<Result<TResult>>; // server action
  defaultTouched: Record<TFieldNames, boolean>; // manage touched state
  onSuccess?: (data: TResult) => void;
  onError?: (errors: FieldError[]) => void;
  children: (ctx: {
    // pass a function as a child instead of normal JSX
    // Rendor props
    getError: (field: TFieldNames) => string | undefined;
    handleInputChange: (field: TFieldNames) => void;
    touched: Record<TFieldNames, boolean>;
    isPending: boolean;
  }) => React.ReactNode;
}

export function SecureFormRoot<TFieldNames extends string, TResult>({
  action,
  defaultTouched,
  onSuccess,
  onError,
  children,
}: SecureFormProps<TFieldNames, TResult>) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [touched, setTouched] = useState(defaultTouched);

  const handleInputChange = (field: TFieldNames) => {
    if (!touched[field]) {
      // spread the old object and add the field: true
      // in js if 2 keys are the same, the later one wins
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const getError = (field: TFieldNames): string | undefined => {
    if (!state || state.ok) return;
    return state.error.find((e) => e.field === field)?.message;
  };

  useEffect(() => {
    if (state && !state.ok) {
      setTouched(defaultTouched);
      const formError = state.error.find((e) => e.field === "form");
      if (formError) {
        addToast({
          title: "Form Error",
          description: formError.message,
          color: "danger",
        });
      }
      onError?.(state.error); // for hidden inputs
    }
    if (state && state.ok) {
      setTouched(defaultTouched);
      onSuccess?.(state.data);
    }
  }, [state]);
  return <Form action={formAction}>{children({ getError, handleInputChange, touched, isPending })}</Form>;
}
