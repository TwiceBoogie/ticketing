"use client";

import { ChangeEvent, Fragment, ReactNode, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

import { useRouter } from "next/navigation";
import ConfirmActionButton from "./buttons/ConfirmActionButton";
import { classNames, Validator } from "@/core";
import { AlertBanner } from "./banners";

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

const InterceptModals = ({ children, data, action }: Props) => {
  const [open, setOpen] = useState(true);

  const cancelButtonRef = useRef(null);

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [invalidT, setInvalidT] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const router = useRouter();

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvalidT(false);
    // setShowBanner(false);
    setNewTitle(event.target.value);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInvalidP(false);
    // setShowBanner(false);
    setNewPrice(event.target.value);
  };

  let title = "";

  let buttonComponent: JSX.Element = <></>;
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
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={() => {
          setOpen(false);
          router.back();
        }}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-zinc-900 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-800 dark:text-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className=" px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  {success && (
                    <AlertBanner
                      success={success}
                      message="Ticket Updated successfully"
                    />
                  )}
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                      <Dialog.Title
                        as="h3"
                        className="text-base font-semibold leading-6 text-gray-900 dark:text-white"
                      >
                        {title}
                      </Dialog.Title>
                      <div className="mt-2">
                        {action === "update" ? (
                          <form className="my-4 grid grid-cols-6 gap-6">
                            <div className="col-span-6">
                              <label
                                htmlFor="Title"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                              >
                                Title
                              </label>
                              <input
                                type="text"
                                id="Title"
                                name="title"
                                className={classNames(
                                  invalidT
                                    ? "border-red-500 dark:border-red-500"
                                    : "border-gray-200 dark:border-gray-700",
                                  "mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200"
                                )}
                                onBlur={() => {
                                  Validator.validateTitle({
                                    title: newTitle,
                                    setInvalidT,
                                  });
                                }}
                                onChange={handleTitleChange}
                              />
                              {invalidT && (
                                <span className="mt-2 text-sm text-red-500">
                                  Please enter a valid title
                                </span>
                              )}
                            </div>

                            <div className="col-span-6">
                              <label
                                htmlFor="Price"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                              >
                                Price
                              </label>
                              <input
                                type="number"
                                id="Price"
                                name="price"
                                className={classNames(
                                  invalidT
                                    ? "border-red-500 dark:border-red-500"
                                    : "border-gray-200 dark:border-gray-700",
                                  "mt-1 w-full rounded-md bg-white text-sm text-gray-700 shadow-sm dark:bg-gray-800 dark:text-gray-200"
                                )}
                                onBlur={() =>
                                  Validator.validatePrice({
                                    price: newPrice,
                                    setInvalidP,
                                  })
                                }
                                onChange={handlePriceChange}
                              />
                              {invalidP && (
                                <span className="mt-2 text-sm text-red-500">
                                  Please enter a valid positive number
                                </span>
                              )}
                            </div>
                          </form>
                        ) : (
                          <div>{children}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className=" px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6 gap-2">
                  {buttonComponent}
                  <button
                    type="button"
                    className="flex w-full justify-center rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-pink-600/40 transition duration-300 ease-in-out sm:mt-0 sm:w-auto"
                    onClick={() => {
                      setOpen(false);
                      router.back();
                    }}
                    ref={cancelButtonRef}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default InterceptModals;
