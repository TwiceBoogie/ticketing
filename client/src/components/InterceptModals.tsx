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

  const [isModalOpen, setIsModalOpen] = useState(true);

  // const [success, setSuccess] = useState(false);
  // const [error, setError] = useState(false);
  // const [isEmpty, setIsEmpty] = useState(true);
  // const [newTitle, setNewTitle] = useState("");
  // const [newPrice, setNewPrice] = useState("");
  // const [invalidT, setInvalidT] = useState(false);
  // const [invalidP, setInvalidP] = useState(false);
  // const router = useRouter();

  // let title = "";

  // let buttonComponent: JSX.Element;
  // if (isTicket(data)) {
  //   title = data.title;
  //   if (action === "update") {
  //     buttonComponent = (
  //       <ConfirmActionButton
  //         id={data.id}
  //         setSuccess={setSuccess}
  //         action={action}
  //         title={newTitle}
  //         price={newPrice}
  //         setInvalidT={setInvalidT}
  //         setInvalidP={setInvalidP}
  //         setIsEmpty={setIsEmpty}
  //         isEmpty={isEmpty}
  //       />
  //     );
  //   } else {
  //     // order ticket
  //     title = data.title;
  //     buttonComponent = (
  //       <ConfirmActionButton
  //         id={data.id}
  //         setSuccess={setSuccess}
  //         action={action}
  //         setInvalidT={setInvalidT}
  //         setInvalidP={setInvalidP}
  //         setIsEmpty={setIsEmpty}
  //         isEmpty={isEmpty}
  //       />
  //     );
  //   }
  // } else {
  //   // delete order
  //   title = data.ticket.title;
  //   if (action === "delete") {
  //     buttonComponent = (
  //       <ConfirmActionButton
  //         id={data.id}
  //         setSuccess={setSuccess}
  //         action={action}
  //         setInvalidT={setInvalidT}
  //         setInvalidP={setInvalidP}
  //         setIsEmpty={setIsEmpty}
  //         isEmpty={isEmpty}
  //       />
  //     );
  //   } else {
  //     // error / not authorized
  //     title = "Error";
  //   }
  // }

  // const handleOnOpenChange = (open: boolean) => {
  //   if (!open) {
  //     openn = false;
  //     router.back();
  //   }
  // };
  return (
    // <>
    //   <Modal
    //     isOpen={openn}
    //     onOpenChange={handleOnOpenChange}
    //     className="dark:text-white"
    //   >
    //     <ModalContent>
    //       {(onClose) => (
    //         <>
    //           <ModalHeader className="flex flex-col gap-1">{title}</ModalHeader>
    //           {success && (
    //             <div
    //               className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
    //               role="alert"
    //             >
    //               <svg
    //                 className="flex-shrink-0 inline w-4 h-4 mr-3"
    //                 aria-hidden="true"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="currentColor"
    //                 viewBox="0 0 20 20"
    //               >
    //                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
    //               </svg>
    //               <span className="sr-only">Info</span>
    //               <div>
    //                 <span className="font-medium">Success alert!</span> {action}
    //                 went through successfully
    //               </div>
    //             </div>
    //           )}
    //           {error && (
    //             <div
    //               className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
    //               role="alert"
    //             >
    //               <svg
    //                 className="flex-shrink-0 inline w-4 h-4 mr-3"
    //                 aria-hidden="true"
    //                 xmlns="http://www.w3.org/2000/svg"
    //                 fill="currentColor"
    //                 viewBox="0 0 20 20"
    //               >
    //                 <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
    //               </svg>
    //               <span className="sr-only">Info</span>
    //               <div>
    //                 <span className="font-medium">Danger alert!</span> Something
    //                 went wrong, Please try again later
    //               </div>
    //             </div>
    //           )}
    //           {action === "update" ? (
    //             <ModalBody>
    //               <Input
    //                 autoFocus
    //                 label="Title"
    //                 placeholder={title}
    //                 variant="bordered"
    //                 value={newTitle}
    //                 onChange={(e) => {
    //                   setInvalidT(false);
    //                   setNewTitle(e.target.value);
    //                 }}
    //                 isInvalid={invalidT}
    //                 errorMessage={invalidT && "Title is required"}
    //               />
    //               <Input
    //                 label="Price"
    //                 placeholder={String((data as Ticket).price)}
    //                 type="number"
    //                 variant="bordered"
    //                 value={newPrice}
    //                 onChange={(e) => {
    //                   setInvalidP(false);
    //                   setNewPrice(e.target.value);
    //                 }}
    //                 isInvalid={invalidP}
    //                 errorMessage={invalidP && "Please enter a valid number"}
    //               />
    //             </ModalBody>
    //           ) : (
    //             <ModalBody>{children}</ModalBody>
    //           )}
    //           <ModalFooter>
    //             <Button
    //               color="danger"
    //               variant="light"
    //               onPress={() => {
    //                 setSuccess(false);
    //                 setError(false);
    //                 onClose();
    //               }}
    //             >
    //               Close
    //             </Button>
    //             {buttonComponent}
    //           </ModalFooter>
    //         </>
    //       )}
    //     </ModalContent>
    //   </Modal>
    // </>
    <div>
      <button
        
        data-modal-target="default-modal"
        data-modal-toggle="default-modal"
        className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        Toggle modal
      </button>
      {isModalOpen && (<div
        id="default-modal"
        aria-hidden="true"
        className="hidden overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Terms of Service
              </h3>
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                data-modal-hide="default-modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="p-4 md:p-5 space-y-4">
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                With less than a month to go before the European Union enacts
                new consumer privacy laws for its citizens, companies around the
                world are updating their terms of service agreements to comply.
              </p>
              <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
                The European Union’s General Data Protection Regulation
                (G.D.P.R.) goes into effect on May 25 and is meant to ensure a
                common set of data rights in the European Union. It requires
                organizations to notify users as soon as possible of high-risk
                data breaches that could personally affect them.
              </p>
            </div>

            <div className="flex items-center p-4 md:p-5 border-t border-gray-200 rounded-b dark:border-gray-600">
              <button
                data-modal-hide="default-modal"
                type="button"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                I accept
              </button>
              <button
                data-modal-hide="default-modal"
                type="button"
                className="ms-3 text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      </div>)}
    </div>
  );
};

export default InterceptModals;
