import { TransformOrder, transformOrder } from "@/core";
import { Order } from "@/core";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import React, { Suspense } from "react";
import TableContent from "./TableContent";

type OrdersResponse = Order[] | NotAuthorized[];
type NotAuthorized = {
  error: string;
};

async function getOrders(jwt: RequestCookie | undefined) {
  try {
    if (jwt === undefined) {
      return [{ error: "not authorized" }];
    }

    const res = await fetch(`${process.env.ORDERS_ENDPOINT!}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt?.value}`,
      },
      cache: "no-store",
    });
    const responseData = await res.json();
    console.log("fetching orders");

    if (!res.ok) {
      return [{ error: "not authorized" }];
    }
    return responseData;
  } catch (error) {
    console.log(error, "error from getOrders()");
  }
}

function isOrder(data: OrdersResponse) {
  if (data.length === 0 || "id" in data[0]) {
    return true;
  }
  return false;
}

interface Props {
  jwt: RequestCookie | undefined;
  userId: string;
}

const OrderServer = async ({ jwt, userId }: Props) => {
  const ordersResponse: OrdersResponse = await getOrders(jwt);

  let transformOrders: TransformOrder[] = [];
  let loggedIn = false;
  if (isOrder(ordersResponse)) {
    loggedIn = true;
    const trans = ordersResponse as Order[];
    trans.map((order, idx) => {
      transformOrders[idx] = transformOrder(order);
    });
  }
  return (
    <div className="flex flex-col gap-4 p-10 card1">
      <>
        <h1 className="flex justify-center">Orders</h1>
        <Suspense>
          <TableContent data={transformOrders} type="orders" userId={userId} />
        </Suspense>
      </>
    </div>
  );
};

export default OrderServer;
