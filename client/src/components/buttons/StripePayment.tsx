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
        stripeKey="sk_test_51MEL0AGD9cK9NzsOAgqPPgZLdLXVfgHDYI1mkS7CpR2ODgUbXXMx7mq9qhgSx7D7OBHRAJ7mlfyBlBqcn0tBoTds008P6wpQ7P"
        amount={amount * 100}
        email={userEmail}
      />
    </div>
  );
};

export default StripePayment;
