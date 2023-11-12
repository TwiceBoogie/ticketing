import StripePayment from "@/components/buttons/StripePayment";
import { cookies } from "next/headers";
import { Suspense, useEffect, useState } from "react";
import StripeCheckout from "react-stripe-checkout";

interface Props {
  params: {
    orderId: string;
  };
}

async function getOrder(orderId: string) {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");
    const res = await fetch(
      `${process.env.ORDERS_ENDPOINT!}/api/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt?.value}`,
        },
        cache: "no-store",
      }
    );
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
}

async function getUser() {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");
    const res = await fetch(
      `${process.env.AUTH_ENDPOINT!}/api/users/currentuser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt?.value}`,
        },
        cache: "no-store",
      }
    );
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
}

export default async function Orders({ params }: Props) {
  const data = await getOrder(params.orderId);
  const user = await getUser();

  return (
    <>
      <Suspense>
        <StripePayment
          expiresAt={data.expiresAt}
          userEmail={user.currentUser.email}
          amount={data.ticket.price}
        />
      </Suspense>
    </>
  );
}
