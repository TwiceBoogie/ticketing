"use client";

import React, { useActionState, useEffect } from "react";

import { Button } from "@heroui/button";
import { purchaseTicketAction } from "@/actions/purchaseTicketAction";
import { addToast } from "@heroui/toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

type TOrderRoot = {
  ticketId: string;
};

export default function PurchaseButton({ ticketId }: TOrderRoot) {
  const { user } = useAuth();
  const [state, formAction, isPending] = useActionState(purchaseTicketAction, null);
  const router = useRouter();

  const isUserMissing = !user;

  useEffect(() => {
    if (state && state.ok) {
      addToast({
        title: "Ticket has been ordered successfully",
        color: "success",
      });
      router.replace("/");
    }
    if (state && !state.ok) {
      console.log("NOT OKAY");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <Button color={isUserMissing ? "secondary" : "primary"} type="submit" isDisabled={isPending || isUserMissing}>
        {isUserMissing ? "Disabled" : "Purchase"}
      </Button>
    </form>
  );
}
