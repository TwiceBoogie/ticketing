import { ChangeEvent, Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { SpinnerIcon } from "../icons";
import { useRouter } from "next/navigation";

import { Validator, classNames } from "@/core";
import { AlertBanner } from "../banners";

const SellTicketButton = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [showBanner, setShowBanner] = useState(false);
  const [invalidT, setInvalidT] = useState(false);
  const [invalidP, setInvalidP] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsDisabled(false);
    setInvalidT(false);
    setShowBanner(false);
    setTitle(event.target.value);
  };

  const handlePriceChange = (event: ChangeEvent<HTMLInputElement>) => {
    setIsDisabled(false);
    setInvalidP(false);
    setShowBanner(false);
    setPrice(event.target.value);
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsDisabled(true);
    setIsLoading(true);
    setShowBanner(false);
    const formData = { title, price };
    const props = { formData, setInvalidT, setInvalidP };
    const url = "/api/tickets";
    await Validator.onSubmit({
      props,
      setIsLoading,
      setError,
      router,
      url,
    });
    setIsLoading(false);
    setShowBanner(error ? false : true);
  };

  const cancelButtonRef = useRef(null);
  return (
    <>
      <button
        className="inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white"
        data-ripple-light="true"
        onClick={() => setOpen(true)}
      >
        Sell Tickets
      </button>
      <Transition.Root show={open} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          initialFocus={cancelButtonRef}
          onClose={setOpen}
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
            <div className="fixed inset-0 bg-gray-700 bg-opacity-75 transition-opacity" />
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
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white dark:bg-slate-800 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    {showBanner && (
                      <AlertBanner
                        success={error ? false : true}
                        message={error ? error : "Ticket Created Successfully"}
                      />
                    )}
                    <div className="sm:flex sm:items-start">
                      <div className="w-full mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <Dialog.Title
                          as="h3"
                          className="text-xl font-semibold leading-6 text-gray-900 dark:text-white"
                        >
                          Create a new ticket
                        </Dialog.Title>

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
                                Validator.validateTitle({ title, setInvalidT });
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
                                Validator.validatePrice({ price, setInvalidP })
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
                      </div>
                    </div>
                  </div>
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 sm:flex sm:flex-row-reverse gap-2 sm:px-6">
                    <button
                      type="button"
                      className={`rounded-xl border border-blue-600 bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-transparent hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500 dark:hover:bg-blue-700 dark:hover:text-white
                      ${
                        isDisabled
                          ? "opacity-50 pointer-events-none"
                          : "hover:opacity-80"
                      }`}
                      disabled={isDisabled}
                      data-ripple-light="true"
                      onClick={onSubmit}
                      ref={cancelButtonRef}
                    >
                      {isLoading ? <SpinnerIcon /> : "Create new Ticket"}
                    </button>
                    <button
                      type="button"
                      className="flex w-full justify-center items-center rounded-xl px-4 py-2 text-sm text-rose-600 hover:bg-pink-600/40 transition-all duration-300 ease-in-out sm:mt-0 sm:w-auto"
                      data-ripple-light="true"
                      onClick={() => {
                        setIsDisabled(false);
                        setTitle("");
                        setPrice("");
                        setShowBanner(false);
                        setOpen(false);
                      }}
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
    </>
  );
};

export default SellTicketButton;
