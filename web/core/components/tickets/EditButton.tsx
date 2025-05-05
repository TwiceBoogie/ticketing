"use client";

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { Button } from "@heroui/button";
import { SecureFormRoot } from "../forms/SecureFormRoot";
import { ITicketResponse } from "@/types/ticket";
import { editTicketAction } from "@/actions/editTicketAction";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { useRef, useState } from "react";

interface IEditButtonProps {
  ticketId: string;
  title: string;
  price: string;
}

export default function EditButton({ ticketId, title, price }: IEditButtonProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const [failed, setFailed] = useState(true);

  return (
    <>
      <Button onPress={onOpen}>Edit Ticket</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Edit Ticket</ModalHeader>
              <ModalBody>
                <SecureFormRoot<"ticketId" | "title" | "price", ITicketResponse>
                  action={editTicketAction}
                  defaultTouched={{ ticketId: false, title: false, price: false }}
                  onSuccess={(data) => {
                    addToast({
                      title: "Ticket updated successfully",
                      description: `${data.title} - $${data.price}`,
                      color: "success",
                    });
                    setFailed(false);
                  }}
                >
                  {({ getError, handleInputChange, touched, isPending }) => (
                    <>
                      <Input className="hidden" value={ticketId} name="ticketId" />
                      <Input
                        label="Title"
                        name="title"
                        type="text"
                        placeholder={title}
                        onChange={() => handleInputChange("title")}
                        isInvalid={!touched.title && !!getError("title")}
                        errorMessage={!touched.title ? getError("title") : ""}
                      />
                      <Input
                        label="Price"
                        name="price"
                        type="number"
                        placeholder={price}
                        startContent={
                          <div className="pointer-events-none flex items-center">
                            <span className="text-default-400 text-small">$</span>
                          </div>
                        }
                        onChange={() => handleInputChange("price")}
                        isInvalid={!touched.price && !!getError("price")}
                        errorMessage={!touched.price ? getError("price") : ""}
                      />
                      <Button ref={submitButtonRef} type="submit" className="hidden" />
                    </>
                  )}
                </SecureFormRoot>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  type="submit"
                  color="primary"
                  onPress={(e) => {
                    submitButtonRef.current?.click(); // trigger submit on hidden one
                    if (!failed) {
                      onClose();
                    }
                  }}
                >
                  Edit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
