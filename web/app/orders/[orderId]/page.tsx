import React from "react";
import { cookies } from "next/headers";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

import { GeneralError, Order, TOrderAPIResponse } from "@/types/order";
import { SERVICES } from "@/constants/serverUrls";
import DefaultLayout from "@/layouts/default-layout";

interface IParams {
  params: Promise<{ orderId: string }>;
}

async function getOrder(orderId: string): Promise<TOrderAPIResponse> {
  try {
    const cookie = (await cookies()).get("session")?.value;
    const res = await fetch(`${SERVICES.orders}/api/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: `session=${cookie}`,
      },
    });
    const data: Order | { errors: GeneralError[] } = await res.json();
    if (!res.ok && "errors" in data) {
      return {
        ok: false,
        errors: data.errors,
      };
    }
    return {
      ok: true,
      data: data as Order,
    };
  } catch (error) {
    console.log("Fetch Error: ", error);
    return {
      ok: false,
      errors: [{ message: "Something went wrong." }],
    };
  }
}

export default async function OrderInfo({ params }: IParams) {
  const { orderId } = await params;
  const result = await getOrder(orderId);
  if (!result.ok) {
    return <p className="text-red-500">{result.errors[0].message}</p>;
  }
  const order = result.data;
  return (
    <DefaultLayout>
      <div>
        <Card>
          <CardHeader>{order.ticket.title}</CardHeader>
        </Card>
      </div>
    </DefaultLayout>
  );
}
