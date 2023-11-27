"use client";

import { Validator, classNames } from "@/core";
import { useRouter } from "next/navigation";
import { ChangeEvent, ReactNode, useState } from "react";
import ConfirmActionButton from "../buttons/ConfirmActionButton";

interface Ticket {
  title: string;
  price: number;
  id: string;
}

interface Props {
  children: ReactNode;
  action: string;
  ticket: Ticket;
}

export const TicketForm = ({ children, action, ticket }: Props) => {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const [isEmpty, setIsEmpty] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [invalidT, setInvalidT] = useState(false);
  const [invalidP, setInvalidP] = useState(false);

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
  return (
    <>
      <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-zinc-800 dark:text-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
        <div className="px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
          <div className="sm:flex sm:items-start">
            <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
              <h1 className="text-base font-semibold leading-6 text-gray-900 dark:text-white">
                {ticket.title}
              </h1>
              {action === "update" ? (
                <form className="my-4 grid grid-cols-6 gap-6 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
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
                      placeholder={ticket.title}
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
                      placeholder={ticket.price.toString()}
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
        <div className="px-4 py-3 flex flex-row-reverse sm:px-6 gap-2">
          <ConfirmActionButton
            id={ticket.id}
            setSuccess={setSuccess}
            action={action}
            title={newTitle}
            price={newPrice}
            setInvalidT={setInvalidT}
            setInvalidP={setInvalidP}
            setIsEmpty={setIsEmpty}
            isEmpty={isEmpty}
          />
          <button
            type="button"
            className="flex justify-center rounded-xl px-3 py-2 text-sm text-rose-600 hover:bg-pink-600/40 transition duration-300 ease-in-out sm:mt-0 sm:w-auto"
            onClick={() => {
              router.back();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
