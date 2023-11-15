import InterceptModals from "@/components/InterceptModals";
import { createRedisInstance } from "@/core/config";
import { cookies } from "next/headers";
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
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const responseData = await res.json();
    return responseData;
  } catch (error) {
    console.log(error);
  }
}

const page = async ({ params }: Props) => {
  const data: Ticket = await getTicket(params.slug[1]);
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
    <Suspense>
      <InterceptModals data={data} action={action}>
        Price: ${data.price}
      </InterceptModals>
    </Suspense>
  );
};

export default page;
