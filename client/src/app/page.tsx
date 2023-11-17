import { Suspense } from "react";
import { cookies, headers } from "next/headers";
import { Order, TransformOrder, transformOrder } from "@/core";
import { createRedisInstance } from "@/core/config";

import { Ticket } from "@/core";
import TableContent from "@/components/TableContent";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Loading from "./loading";

type OrdersResponse = Order[] | NotAuthorized[];
type NotAuthorized = {
  error: string;
};

const redis = createRedisInstance();

async function getTickets() {
  try {
    const res = await fetch(`${process.env.TICKETS_ENDPOINT!}/api/tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["tickets"],
      },
    });

    const responseData = await res.json();
    console.log("fetching tickets");

    return responseData;
  } catch (error) {
    console.log(error);
  }
}

async function getOrders(jwt: RequestCookie | undefined) {
  try {
    if (jwt === undefined) {
      return [{ error: "not authorized" }];
    }
    console.log(jwt);
    const res = await fetch(`${process.env.ORDERS_ENDPOINT!}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt?.value}`,
      },
    });
    const responseData = await res.json();
    console.log("fetching orders");
    console.log(responseData);

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

export default async function Home() {
  const tickets: Ticket[] = await getTickets();
  const jwt = cookies().get("jwt");
  let userId: string | null = "";
  if (jwt?.value !== undefined) {
    userId = (await redis.get(jwt.value)) as string;
  }

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
    <div className="flex flex-col lg:flex-row h-fit gap-4 text-center">
      <div className="flex flex-col gap-4 p-10 card2 dark:card1">
        <h1 className="flex justify-center text-2xl font-bold">
          Available Tickets
        </h1>
        <Suspense fallback={<Loading />}>
          <TableContent data={tickets} type="tickets" userId={userId} />
        </Suspense>
      </div>
      {loggedIn && (
        <div className="flex flex-col gap-4 p-10 card2 dark:card1">
          <>
            <h1 className="flex justify-center text-2xl font-bold">Orders</h1>
            <Suspense fallback={<Loading />}>
              <TableContent
                data={transformOrders}
                type="orders"
                userId={userId}
              />
            </Suspense>
          </>
        </div>
      )}
    </div>
  );
}
