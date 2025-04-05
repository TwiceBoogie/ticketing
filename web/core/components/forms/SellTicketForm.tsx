"use client";

import React from "react";
import { addToast } from "@heroui/toast";

import { SecureFormRoot } from "./SecureFormRoot";
import { ITicketResponse } from "@/types/ticket";
import { sellTicketAction } from "@/actions/sellTicketAction";
import { Input } from "@heroui/input";
import { Button } from "@heroui/react";

export function SellTicketForm() {
  return (
    <SecureFormRoot<"title" | "price", ITicketResponse>
      action={sellTicketAction}
      defaultTouched={{ title: false, price: false }}
      onSuccess={(data) => {
        addToast({
          title: "Ticket created successfully",
          description: `${data.title} - $${data.price}`,
          color: "success",
        });
      }}
    >
      {({ getError, handleInputChange, touched, isPending }) => (
        <>
          <Input
            label="Title"
            name="title"
            type="text"
            onChange={() => handleInputChange("title")}
            isInvalid={!touched.title && !!getError("title")}
            errorMessage={!touched.title ? getError("title") : ""}
          />
          <Input
            label="Price"
            name="price"
            type="number"
            placeholder="0.00"
            startContent={
              <div className="pointer-events-none flex items-center">
                <span className="text-default-400 text-small">$</span>
              </div>
            }
            onChange={() => handleInputChange("price")}
            isInvalid={!touched.price && !!getError("price")}
            errorMessage={!touched.price ? getError("price") : ""}
          />
          <Button type="submit" disabled={isPending} color="primary">
            {isPending ? "Selling..." : "Sell"}
          </Button>
        </>
      )}
    </SecureFormRoot>
  );
}
