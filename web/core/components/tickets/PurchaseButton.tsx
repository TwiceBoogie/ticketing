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

export default function PurchaseButton(props: TOrderRoot) {
  const { user } = useAuth();
  const { ticketId } = props;
  const [state, formAction, isPending] = useActionState(purchaseTicketAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state && state.ok) {
      addToast({
        title: "Ticket has been ordered successfully",
        color: "success",
      });
      router.replace("/");
    }
  }, [state]);
  return (
    <form action={formAction}>
      <input type="hidden" name="ticketId" value={ticketId} />
      <Button color="primary" type="submit" isDisabled={isPending}>
        Purchase
      </Button>
    </form>
  );
}
