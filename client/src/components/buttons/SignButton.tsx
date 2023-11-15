"use client";
import { useState } from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { revalidatePath } from "next/cache";

interface CurrentUserI {
  currentUser: {
    id: string;
    email: string;
  } | null;
}

interface SignupRes {
  status: number;
  message: {
    id: string;
    email: string;
  };
  errors: {
    message: string;
    field?: string;
  }[];
}

interface Props {
  url: string;
  title: string;
}

const SignButton = ({ url, title }: Props) => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invalidE, setInvalidE] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    setError("");
    if (!email) {
      setInvalidE(true);
    }
    if (!password || password.length <= 6) {
      setInvalidP(true);
    }
    if (email && password) {
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

        const data: SignupRes = await res.json();

        if (!res.ok) {
          data.errors.map((error) => {
            if (Object.keys(error).length === 1) {
              setError(error.message);
            } else {
              if (error.field === "email") setInvalidE(true);
              if (error.field === "password") setInvalidP(true);
            }
          });
        }

        router.refresh();
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <>
      <Button onPress={onOpen}>{title}</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark:text-white">
                {title}
              </ModalHeader>
              <ModalBody>
                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-sm">
                  {error && (
                    <div
                      className="flex items-center p-4 mb-4 text-sm text-red-800 border border-red-300 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400 dark:border-red-800"
                      role="alert"
                    >
                      <svg
                        className="flex-shrink-0 inline w-4 h-4 mr-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                      </svg>
                      <span className="sr-only">Info</span>
                      <div>{error}</div>
                    </div>
                  )}
                  <form className="space-y-6 dark:text-white">
                    <Input
                      type="email"
                      label="Email"
                      value={email}
                      onChange={(e) => {
                        setInvalidE(false);
                        setEmail(e.target.value);
                      }}
                      isInvalid={invalidE}
                      errorMessage={invalidE && "Please enter a valid email"}
                    />
                    <Input
                      type="password"
                      label="Password"
                      value={password}
                      onChange={(e) => {
                        setInvalidP(false);
                        setPassword(e.target.value);
                      }}
                      isInvalid={invalidP}
                      errorMessage={
                        invalidP &&
                        "Password length must be between 4 and 20 characters"
                      }
                    />
                  </form>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    onSubmit();
                    onClose();
                  }}
                >
                  {title}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignButton;
