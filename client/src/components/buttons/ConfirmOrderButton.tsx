"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";

interface Props {
  ticketId: string;
  setSuccess: Dispatch<SetStateAction<boolean>>;
}

const ConfirmOrderButton = ({ ticketId, setSuccess }: Props) => {
  const [disabled, setDisabled] = useState(false);
  const handleOrder = async () => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticketId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      }
      setDisabled(true);
      console.log(data);
    } catch (error) {
      console.log("Server error, please try again later.");
    }
  };
  return (
    <>
      <Button color="primary" onPress={handleOrder} isDisabled={disabled}>
        Confirm Order
      </Button>
    </>
  );
};

export default ConfirmOrderButton;
