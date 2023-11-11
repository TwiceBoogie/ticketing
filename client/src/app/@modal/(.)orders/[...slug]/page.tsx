import InterceptModals from "@/components/InterceptModals";
import { cookies } from "next/headers";
import React from "react";

interface Props {
  params: {
    slug: string[];
  };
}

interface Order {
  userId: number;
  status: string;
  expiresAt: string;
  ticket: {
    title: string;
    price: number;
    id: string;
  };
  id: string;
}

async function getOrder(orderId: string) {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");

    const res = await fetch(`http://localhost:3002/api/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt?.value}`,
      },
    });
    const responseData = await res.json();

    return responseData;
  } catch (error) {
    console.log(error);
  }
}

async function getUser() {
  try {
    const cookieStore = cookies();
    const jwt = cookieStore.get("jwt");

    const res = await fetch("http://localhost:3001/api/users/currentuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt?.value}`,
      },
      cache: "no-store",
    });
    const responseData = await res.json();

    return responseData;
  } catch (error) {
    console.log(error);
  }
}

const page = async ({ params }: Props) => {
  const data: Order = await getOrder(params.slug[1]);
  const user = await getUser();

  return (
    <InterceptModals data={data} action="purchase" userEmail={user.email}>
      Price: ${data.ticket.price}
    </InterceptModals>
  );
};

export default page;
