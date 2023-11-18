"use client";
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
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface SellTickets {
  status: number;
  message: string;
  errors: {
    message: string;
    field?: string;
  }[];
}

const SellTicketButton = () => {
  const router = useRouter();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [invalidT, setInvalidT] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (onClose: () => void) => {
    setError("");
    if (!title) {
      setInvalidT(true);
    } else if (!price || parseFloat(price) <= 0) {
      setInvalidP(true);
    } else {
      try {
        const res = await fetch("/api/tickets", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title,
            price,
          }),
        });

        const data: SellTickets = await res.json();
        if (res.ok) {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            setTitle("");
            setPrice("");
            router.refresh();
            onClose();
          }, 3000);
        } else {
          data.errors.map((error) => {
            if (Object.keys(error).length === 1) {
              setError(error.message);
            } else {
              if (error.field === "title") setInvalidT(true);
              if (error.field === "price") setInvalidP(true);
            }
          });
        }
      } catch (error) {
        setError("Server error has occured. Please try again later");
      }
    }
  };

  return (
    <>
      <Button
        color="primary"
        onPress={() => {
          setTitle("");
          setPrice("");
          onOpen();
        }}
      >
        Sell Tickets
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="top-center"
        className="dark:text-white"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Create New Ticket
              </ModalHeader>
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
                    <span className="font-medium">Success alert!</span>{" "}
                    Successfully created a new ticket
                  </div>
                </div>
              )}
              <ModalBody>
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
                <Input
                  autoFocus
                  label="Title"
                  placeholder="Enter your ticket title"
                  variant="bordered"
                  value={title}
                  onChange={(e) => {
                    setInvalidT(false);
                    setTitle(e.target.value);
                  }}
                  isInvalid={invalidT}
                  errorMessage={invalidT && "Title is required"}
                />
                <Input
                  label="Price"
                  placeholder="Enter your ticket price"
                  type="number"
                  variant="bordered"
                  value={price}
                  onChange={(e) => {
                    setInvalidP(false);
                    setPrice(e.target.value);
                  }}
                  isInvalid={invalidP}
                  errorMessage={invalidP && "Please enter a valid number"}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleSubmit(onClose);
                  }}
                >
                  Sell
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default SellTicketButton;
