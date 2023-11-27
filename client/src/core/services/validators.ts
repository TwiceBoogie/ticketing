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

interface ValidateTitleI {
  title: string;
  setInvalidT: Dispatch<SetStateAction<boolean>>;
}

interface ValidatePriceI {
  price: string;
  setInvalidP: Dispatch<SetStateAction<boolean>>;
}

type SignInForm = {
  email: string;
  password: string;
};

type SignUpForm = {
  email: string;
  password: string;
};

type SignInResponse = {
  message: string;
  errors: {
    message: string;
    field?: string;
  }[];
};

type SellTicketForm = {
  title: string;
  price: string;
};

type SellTicketProps = {
  formData: SellTicketForm;
  setInvalidT: Dispatch<SetStateAction<boolean>>;
  setInvalidP: Dispatch<SetStateAction<boolean>>;
};

type SignProps = {
  formData: SignInForm | SignUpForm;
  setInvalidE: Dispatch<SetStateAction<boolean>>;
  setInvalidP: Dispatch<SetStateAction<boolean>>;
};

export interface SubmitHandlerI {
  props: SellTicketProps | SignProps;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setError: Dispatch<SetStateAction<string>>;
  router: AppRouterInstance;
  url: string;
}

export class Validator {
  private static readonly EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private static readonly PASSWORD_REGEX = /.{6,}/;
  private static readonly TITLE_REGEX =
    /^(?!.*\s{2})[a-zA-Z0-9]+(?:[ -][a-zA-Z0-9]+)*$/;
  private static readonly PRICE_REGEX = /^\d+(\.\d+)?$/;

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

  static validateTitle({ title, setInvalidT }: ValidateTitleI) {
    const isValidTitle = this.TITLE_REGEX.test(title);
    if (!isValidTitle) {
      setInvalidT(true);
      return false;
    }
    return true;
  }

  static validatePrice({ price, setInvalidP }: ValidatePriceI) {
    const isValidPrice = this.PRICE_REGEX.test(price.toString());
    if (!isValidPrice) {
      setInvalidP(true);
      return false;
    }
    return true;
  }

  static isSellTicketProp(
    obj: SellTicketProps | SignProps
  ): obj is SellTicketProps {
    return (obj as SellTicketProps).formData.title !== undefined;
  }

  static async onSubmit({
    props,
    setIsLoading,
    setError,
    router,
    url,
  }: SubmitHandlerI) {
    let good = true;
    let data = {};
    if (Validator.isSellTicketProp(props)) {
      data = props.formData;
      const { title, price } = props.formData;
      const { setInvalidT, setInvalidP } = props;

      if (!(title && price)) {
        setInvalidT(true);
        setInvalidP(true);
        setError("Invalid Inputs");
        good = false;
      }
    } else {
      data = props.formData;
      const { email, password } = props.formData;
      const { setInvalidE, setInvalidP } = props;
      if (!(email && password)) {
        setInvalidE(true);
        setInvalidP(true);
        setError("Invalid Inputs");
        good = false;
      }
    }
    if (good) {
      try {
        setError("");
        const res = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...data,
          }),
        });

        const responseData: SignInResponse = await res.json();
        setIsLoading(false);

        if (!res.ok) {
          responseData.errors.map((error) => {
            if (Object.keys(error).length === 1) {
              setError(error.message);
            }
          });
        } else {
          // router.refresh();
        }
      } catch (error) {
        setError("Server error, please try again later");
      }
    }
  }
}
