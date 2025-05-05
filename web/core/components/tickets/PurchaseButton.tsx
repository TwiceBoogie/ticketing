"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { purchaseTicketAction } from "@/actions/purchaseTicketAction";
import { useAuth } from "@/lib/AuthContext";
import { SecureFormRoot } from "../forms/SecureFormRoot";

import { Order } from "@/types/order";

type TOrderRoot = {
  ticketId: string;
};

export default function PurchaseButton({ ticketId }: TOrderRoot) {
  const { user } = useAuth();
  const router = useRouter();

  const isUserMissing = !user;

  return (
    <SecureFormRoot<"ticketId", Order>
      action={purchaseTicketAction}
      defaultTouched={{ ticketId: false }}
      onSuccess={(data) => {
        addToast({
          title: "Ticket ordered successfully!",
          description: `${data.ticket.title} - $${data.ticket.price}`,
          color: "success",
        });
        router.push("/orders");
      }}
      onError={(errors) => {
        addToast({
          title: "Something went wrong, please try again later",
          color: "danger",
        });
      }}
    >
      {({ getError, handleInputChange, touched, isPending }) => (
        <>
          <Input type="hidden" name="ticketId" value={ticketId} />
          <Button
            color={isUserMissing ? "secondary" : "primary"}
            type="submit"
            isDisabled={isPending || isUserMissing}
            isLoading={isPending}
          >
            {isUserMissing ? "Must be logged in" : isPending ? "Ordering" : "Order Now"}
          </Button>
        </>
      )}
    </SecureFormRoot>
  );
}
