"use client";

import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import { FlattenedOrder } from "@/types/order";
import { SecureFormRoot } from "../forms/SecureFormRoot";
import { deleteOrderAction } from "@/actions/deleteOrderAction";

export default function DeleteButton({ orderId }: { orderId: string }) {
  const router = useRouter();
  return (
    <SecureFormRoot<"orderId", FlattenedOrder>
      action={deleteOrderAction}
      defaultTouched={{ orderId: false }}
      onSuccess={(data) => {
        addToast({
          title: `${data.title} order has been cancelled`,
          color: "success",
        });
        router.replace("/orders");
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
          <Input type="hidden" name="orderId" value={orderId} />
          <Button color="danger" type="submit" isDisabled={isPending} isLoading={isPending}>
            {isPending ? "Canceling..." : "Cancel order"}
          </Button>
        </>
      )}
    </SecureFormRoot>
  );
}
