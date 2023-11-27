import Header from "@/components/Header";
import { cookies } from "next/headers";
import { Suspense, useEffect, useState } from "react";

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

export default async function Orders({ params }: Props) {
  console.log(params);
  // const data = await getOrder(params.orderId);

  return (
    <div>
      <Header pageSite="orders" />
      <h1>hello</h1>
    </div>
  );
}
