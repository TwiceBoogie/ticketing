"use client";

import { useState, type FC, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import StripePayment from "./buttons/StripePayment";
import { Input } from "@nextui-org/react";
import ConfirmActionButton from "./buttons/ConfirmActionButton";
interface Props {
  children: ReactNode;
  action: string;
  data: Order | Ticket;
}

interface Ticket {
  title: string;
  price: number;
  id: string;
}

interface Order {
  userId: string;
  status: string;
  expiresAt: string;
  ticket: {
    title: string;
    price: number;
    id: string;
  };
  id: string;
}

function isTicket(data: Ticket | Order): data is Ticket {
  return (data as Ticket).title !== undefined;
}

const InterceptModals: FC<Props> = ({ children, data, action }) => {
  let openn = false;
  if (data) {
    openn = true;
  }

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [invalidT, setInvalidT] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const router = useRouter();

  let title = "";

  let buttonComponent: JSX.Element;
  if (isTicket(data)) {
    title = data.title;
    if (action === "update") {
      buttonComponent = (
        <ConfirmActionButton
          id={data.id}
          setSuccess={setSuccess}
          action={action}
          title={newTitle}
          price={newPrice}
          setInvalidT={setInvalidT}
          setInvalidP={setInvalidP}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
        />
      );
    } else {
      // order ticket
      title = data.title;
      buttonComponent = (
        <ConfirmActionButton
          id={data.id}
          setSuccess={setSuccess}
          action={action}
          setInvalidT={setInvalidT}
          setInvalidP={setInvalidP}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
        />
      );
    }
  } else {
    // delete order
    title = data.ticket.title;
    if (action === "delete") {
      buttonComponent = (
        <ConfirmActionButton
          id={data.id}
          setSuccess={setSuccess}
          action={action}
          setInvalidT={setInvalidT}
          setInvalidP={setInvalidP}
          setIsEmpty={setIsEmpty}
          isEmpty={isEmpty}
        />
      );
    } else {
      // error / not authorized
      title = "Error";
    }
  }

  const handleOnOpenChange = (open: boolean) => {
    if (!open) {
      openn = false;
      router.back();
    }
  };
  return (
    <>
      <Modal
        isOpen={openn}
        onOpenChange={handleOnOpenChange}
        className="dark:text-white"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
              {success && (
                <div
                  className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
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
                  <div>
                    <span className="font-medium">Success alert!</span> {action}
                    went through successfully
                  </div>
                </div>
              )}
              {error && (
                <div
                  className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
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
                  <div>
                    <span className="font-medium">Danger alert!</span> Something
                    went wrong, Please try again later
                  </div>
                </div>
              )}
              {action === "update" ? (
                <ModalBody>
                  <Input
                    autoFocus
                    label="Title"
                    placeholder={title}
                    variant="bordered"
                    value={newTitle}
                    onChange={(e) => {
                      setInvalidT(false);
                      setNewTitle(e.target.value);
                    }}
                    isInvalid={invalidT}
                    errorMessage={invalidT && "Title is required"}
                  />
                  <Input
                    label="Price"
                    placeholder={String((data as Ticket).price)}
                    type="number"
                    variant="bordered"
                    value={newPrice}
                    onChange={(e) => {
                      setInvalidP(false);
                      setNewPrice(e.target.value);
                    }}
                    isInvalid={invalidP}
                    errorMessage={invalidP && "Please enter a valid number"}
                  />
                </ModalBody>
              ) : (
                <ModalBody>{children}</ModalBody>
              )}
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setSuccess(false);
                    setError(false);
                    onClose();
                  }}
                >
                  Close
                </Button>
                {buttonComponent}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default InterceptModals;
