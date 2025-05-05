import { revalidateTag } from "next/cache";
import { Button } from "@heroui/button";

import TableComponent from "@/components/home/TableComponent";
import { apiRequest } from "@/lib/api/apiRequest";
import DefaultLayout from "@/layouts/default-layout";
// CONSTANTS
import { SERVICES } from "@/constants/serverUrls";
// TYPES
import { ITicket } from "@/types/ticket";

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
    key: "id",
    label: "LINK",
  },
];

export default async function Home() {
  async function refresh() {
    "use server";
    revalidateTag("tickets");
  }
  const result = await apiRequest<ITicket[]>(`${SERVICES.tickets}/api/tickets`, {
    method: "GET",
    next: {
      tags: ["tickets"],
    },
    cache: "force-cache",
  });
  if (!result.ok) {
    return (
      <div>
        <div className="p-4 text-red-500">{result.error[0].message}</div>
      </div>
    );
  }
  const tickets = result.data;
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex justify-center items-center gap-5">
          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">Tickets</h2>
          <Button onPress={refresh}>Refresh</Button>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <TableComponent<ITicket> name="tickets" data={tickets} columns={columns} />
        </div>
      </div>
    </DefaultLayout>
  );
}
