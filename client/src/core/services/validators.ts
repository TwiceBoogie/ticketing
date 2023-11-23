import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Dispatch, SetStateAction } from "react";

interface ValidateEmailI {
  email: string;
  setInvalidE: Dispatch<SetStateAction<boolean>>;
}

interface ValidatePasswordI {
  password: string;
  setInvalidP: Dispatch<SetStateAction<boolean>>;
}

type SignInForm = {
  email: string;
  password: string;
};

type SignUpForm = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignInResponse = {
  message: string;
  errors: {
    message: string;
    field?: string;
  }[];
};

export interface SubmitHandlerI {
  formData: SignInForm | SignUpForm;
  setInvalidE: Dispatch<SetStateAction<boolean>>;
  setInvalidP: Dispatch<SetStateAction<boolean>>;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  router: AppRouterInstance;
  url: string;
}

export class Validator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PASSWORD_REGEX = /.{6,}/;

  static validateEmail({ email, setInvalidE }: ValidateEmailI) {
    const isValidEmail = this.EMAIL_REGEX.test(email);
    if (!isValidEmail) {
      setInvalidE(true);
      return false;
    }
    return true;
  }

  static validatePassword({ password, setInvalidP }: ValidatePasswordI) {
    const isValidPassword = this.PASSWORD_REGEX.test(password);
    if (!isValidPassword) {
      setInvalidP(true);
      return false;
    }
    return true;
  }

  static async onSubmit({
    formData,
    setInvalidE,
    setInvalidP,
    setIsLoading,
    setError,
    router,
    url,
  }: SubmitHandlerI) {
    const { email, password } = formData;
    const validEmail: ValidateEmailI = { email, setInvalidE };
    const validPassword: ValidatePasswordI = { password, setInvalidP };
    if (
      Validator.validateEmail(validEmail) ||
      Validator.validatePassword(validPassword)
    ) {
      try {
        setError("");
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        });

        const responseData: SignInResponse = await res.json();
        setIsLoading(false);

        if (!res.ok) {
          responseData.errors.map((error) => {
            if (Object.keys(error).length === 1) {
              setError(error.message);
            } else {
              if (error.field === "email") setInvalidE(true);
              if (error.field === "password") setInvalidP(true);
            }
          });

        } else {
           router.push("/");
        }
      } catch (error) {
        setError("Server error, please try again later");
      }
    }
  }
}
