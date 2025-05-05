import React from "react";
// NEXT
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
// INTERNAL
import TableComponent from "@/components/home/TableComponent";
import { ToastBanner } from "@/components/ui/ToastBanner";
import { apiRequest, FieldErrorReason } from "@/lib/api/apiRequest";
import { flattenOrders } from "@/helpers/formatDate.helper";
import DefaultLayout from "@/layouts/default-layout";
// CONSTANTS
import { SERVICES } from "@/constants/serverUrls";
// TYPES
import { FlattenedOrder, Order } from "@/types/order";

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

const currentPath = "/orders";

export default async function Orders({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { status } = await searchParams;
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect(`/login?next_path=${currentPath}`);
  }
  const result = await apiRequest<Order[]>(`${SERVICES.orders}/api/orders`, {
    method: "GET",
    headers: {
      cookie: `session=${cookie}`,
    },
  });
  if (!result.ok) {
    if (result.error[0].field === FieldErrorReason.UNAUTHORIZED) {
      redirect(`/login?next_path=${currentPath}`);
    }
    return (
      <div>
        <div className="p-4 text-red-500">{result.error[0].message}</div>
      </div>
    );
  }
  const orders = flattenOrders(result.data);
  return (
    <DefaultLayout>
      {status && <ToastBanner />}
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
