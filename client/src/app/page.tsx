import { Suspense } from "react";
import { cookies } from "next/headers";
import { Order, TransformOrder, transformOrder } from "@/core";
import { createRedisInstance } from "@/core/config";

import { Ticket } from "@/core";
import TableContent from "@/components/TableContent";
import { RequestCookie } from "next/dist/compiled/@edge-runtime/cookies";
import Header from "@/components/Header";

type NotAuthorized = {
  error: string;
};
type OrdersResponse = Order[] | NotAuthorized[];

type UserData = {
  userId: string;
  userEmail: string;
  jwtExpires: string;
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
    const res = await fetch(`${process.env.ORDERS_ENDPOINT!}/api/orders`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt.value}`,
      },
    });

    const responseData: Order[] = await res.json();
    console.log("fetching orders");

    if (!res.ok) {
      return [{ error: "not authorized" }];
    }
    return responseData;
  } catch (error) {
    console.log(error);
    return [{ error: "An Error has occured" }];
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

  let userData = {} as UserData;
  if (jwt?.value !== undefined) {
    const serializedUserData = await redis.get(`user:${jwt.value}`);
    userData = JSON.parse(serializedUserData as string);
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
    <div className="min-h-screen bg-slate-300 dark:bg-slate-800">
      <Header pageSite="Home" />
      <Suspense>
        <div className="flex flex-col justify-center 2xl:flex-row gap-4 text-center p-4">
          <div className="pb-6 pt-24 px-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
              Tickets
            </h1>
            <div className="flex flex-col gap-4 p-10 card2 dark:card1">
              <TableContent
                data={tickets}
                type="tickets"
                userId={userData.userId}
              />
            </div>
          </div>
          {loggedIn && (
            <div className="pb-6 pt-24 px-4">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                Orders
              </h1>
              <div className="flex flex-col gap-4 p-10 card2 dark:card1">
                <TableContent
                  data={transformOrders}
                  type="orders"
                  userId={userData.userId}
                />
              </div>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  );
}
