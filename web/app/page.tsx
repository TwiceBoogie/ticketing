import TableComponent from "@/components/home/TableComponent";
import { API_RESPONSE_ERROR } from "@/constants/errorConstants";
import { SERVICES } from "@/constants/serverUrls";
import DefaultLayout from "@/layouts/default-layout";
import { Button } from "@heroui/button";
import { revalidateTag } from "next/cache";

interface ITickets {
  id: string;
  title: string;
  price: string;
  userId: string;
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
    key: "id",
    label: "LINK",
  },
];

async function getTickets(): Promise<ITickets[] | undefined> {
  try {
    const res = await fetch(`${SERVICES.tickets}/api/tickets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: {
        tags: ["tickets"],
      },
      cache: "force-cache",
    });

    console.log(`[getTickets] fetched at ${new Date().toISOString()}`);

    if (!res.ok) throw new Error(API_RESPONSE_ERROR(res.status));
    return res.json();
  } catch (error) {
    console.error("error has occured: ", error);
  }
}

export default async function Home() {
  async function refresh() {
    "use server";
    revalidateTag("tickets");
  }
  const tickets = await getTickets();
  if (!tickets) {
    return (
      <div>
        <div className="p-4 text-red-500">Failed to load tickets. Please try again later.</div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div>
        <div className="p-4 text-gray-500">No tickets available at the moment.</div>
      </div>
    );
  }
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center">
        <div className="flex justify-center items-center gap-5">
          <h2 className=" text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">Tickets</h2>
          <Button onPress={refresh}>Refresh</Button>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <TableComponent<ITickets> name="tickets" data={tickets} columns={columns} />
        </div>
      </div>
    </DefaultLayout>
  );
}
