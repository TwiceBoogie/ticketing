import React from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import DefaultLayout from "@/layouts/default-layout";
import { FlattenedOrder, OrdersResponse, OrderSuccessResponse } from "@/types/order";
// CONSTANTS
import { API_ORDERS_GET } from "@/constants/endpoints-constants";
import TableComponent from "@/components/home/TableComponent";
import { flattenOrders } from "@/helpers/formatDate.helper";

const currentPath = "/orders";

async function getOrders(): Promise<OrdersResponse> {
  try {
    const cookie = (await cookies()).get("session")?.value;
    if (!cookie) {
      return { status: 401, orders: [] };
    }
    const res = await fetch(API_ORDERS_GET, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `session=${cookie}`,
      },
      next: {
        tags: ["orders"],
      },
      cache: "force-cache",
    });
    if (res.status === 401) {
      return { status: res.status, orders: [] };
    }
    const data: OrderSuccessResponse = await res.json();
    return {
      status: res.status,
      orders: flattenOrders(data),
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      status: 500,
      orders: [],
    };
  }
}

const columns = [
  {
    key: "title",
    label: "TITLE",
  },
  {
    key: "price",
    label: "PRICE",
  },
  {
    key: "formattedCreatedAt",
    label: "CREATED AT",
  },
  {
    key: "formattedExpiresAt",
    label: "EXPIRES AT",
  },
  {
    key: "status",
    label: "STATUS",
  },
  {
    key: "id",
    label: "LINK",
  },
];

export default async function Orders() {
  const { status, orders } = await getOrders();
  if (status === 401) redirect(`/login?next_path=${currentPath}`);
  console.log(orders);
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">
            My Orders
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-xl">
          <TableComponent<FlattenedOrder> name="orders" data={orders} columns={columns} />
        </div>
      </div>
    </DefaultLayout>
  );
}
