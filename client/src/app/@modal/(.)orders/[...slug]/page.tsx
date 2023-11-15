import InterceptModals from "@/components/InterceptModals";
import { cookies } from "next/headers";
import { createRedisInstance } from "@/core/config";

interface Props {
  params: {
    slug: string[];
  };
}

interface Order {
  userId: string;
  status: string;
  expiresAt: string;
  ticket: {
    title: string;
    price: number;
    id: string;
  };
  id: string;
}

const redis = createRedisInstance();

async function getOrder(orderId: string, jwt: string) {
  try {
    const res = await fetch(
      `${process.env.ORDERS_ENDPOINT!}/api/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt}`,
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
  let action = "error";
  let userId: string | null = "";
  let order = {} as Order;

  const jwt = cookies().get("jwt");
  if (jwt?.value && params.slug[0] === "delete") {
    userId = await redis.get(jwt.value);
    action = "delete";
    order = await getOrder(params.slug[1], jwt.value);
  }
  if (!userId || order.userId !== userId) action = "error";

  return (
    <InterceptModals data={order} action={action}>
      {action === "error" ? (
        <p>Not Authorized</p>
      ) : (
        <p>Price: ${order.ticket.price}</p>
      )}
    </InterceptModals>
  );
};

export default page;
