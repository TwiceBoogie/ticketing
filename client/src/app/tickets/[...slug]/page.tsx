import Header from "@/components/Header";
import { createRedisInstance } from "@/core/config";
import { cookies } from "next/headers";
import { TicketForm } from "@/components/forms/TicketForm";
import { Suspense } from "react";

const redis = createRedisInstance();

interface Props {
  params: {
    slug: string[];
  };
}

interface Ticket {
  title: string;
  price: number;
  userId: string;
  id: string;
}

async function getTicket(ticketId: string) {
  try {
    const res = await fetch(
      `${process.env.TICKETS_ENDPOINT!}/api/tickets/${ticketId}`,
      {
        method: "get",
        headers: {
          "Content-Type": "application/json",
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

export default async function Tickets({ params }: Props) {
  const data = await getTicket(params.slug[1]);
  const jwt = cookies().get("jwt");

  let userId: string | null = "";
  if (jwt?.value) {
    userId = await redis.get(jwt.value);
  }
  let action = params.slug[0];
  if (action === "order") {
    if (userId && userId === data.userId) {
      action = "error";
    }
  } else if (action === "update") {
    if (userId && userId !== data.userId) {
      action = "error";
    }
  } else {
    action = "error";
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col">
      <Header pageSite="tickets" />

      <div className="flex flex-col justify-center items-center flex-grow w-full">
        <Suspense>
          <TicketForm ticket={data} action={action}>
            Price: ${data.price}
          </TicketForm>
        </Suspense>
      </div>
    </div>
  );
}
