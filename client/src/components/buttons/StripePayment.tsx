"use client";

import React, { useEffect, useState } from "react";
import StripeCheckout, { Token } from "react-stripe-checkout";
import { Button } from "@nextui-org/button";

interface Props {
  expiresAt: string;
  userEmail: string;
  amount: number;
}

const StripePayment = ({ expiresAt, userEmail, amount }: Props) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const findTimeLeft = () => {
      const msLeft = new Date(expiresAt).getTime() - new Date().getTime();
      setTimeLeft(Math.round(msLeft / 1000));
    };

    findTimeLeft();
    const timerId = setInterval(findTimeLeft, 1000);

    return () => {
      clearInterval(timerId);
    };
  }, [expiresAt]);

  if (timeLeft < 0) {
    return <Button isDisabled>Order expired</Button>;
  }
  return (
    <div className="flex">
      Time left to pay: {timeLeft} seconds
      <StripeCheckout
        token={(token: Token) => {
          console.log(token);
        }}
        stripeKey={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        amount={amount * 100}
        email={userEmail}
      />
    </div>
  );
};

export default StripePayment;
