import { addToast, Form } from "@heroui/react";
import React, { useActionState, useEffect, useState } from "react";

type FieldError = {
  field: string;
  message: string;
};

type Result<T> = { ok: true; data: T } | { ok: false; error: FieldError[] };

interface SecureFormProps<TFieldNames extends string, TResult> {
  action: (prevState: any, formData: FormData) => Promise<Result<TResult>>;
  defaultTouched: Record<TFieldNames, boolean>;
  onSuccess?: (data: TResult) => void;
  children: (ctx: {
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
  children,
}: SecureFormProps<TFieldNames, TResult>) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [touched, setTouched] = useState(defaultTouched);

  const handleInputChange = (field: TFieldNames) => {
    if (!touched[field]) {
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
    }
    if (state && state.ok) {
      setTouched(defaultTouched);
      onSuccess?.(state.data);
    }
  }, [state]);
  return <Form action={formAction}>{children({ getError, handleInputChange, touched, isPending })}</Form>;
}
