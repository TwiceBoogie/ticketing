import React from "react";
// NEXT
import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
// EXTERNAL LIBS
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
// INTERNAL
import DeleteButton from "@/components/order/DeleteButton";
import TimeLeft from "@/components/order/TimeLeft";
import { apiRequest, FieldErrorReason } from "@/lib/api/apiRequest";
import DefaultLayout from "@/layouts/default-layout";
// CONSTANTS
import { SERVICES } from "@/constants/serverUrls";
// TYPES
import { Order } from "@/types/order";

interface IParams {
  params: Promise<{ orderId: string }>;
}

enum OrderStatus {
  // When the order has been created, but the
  // ticket it is trying to order has not been reserved
  Created = "created",

  // The ticket the order is trying to reserve has already
  // been reserved, or when the user has cancelled the order.
  // The order expires before payment
  Cancelled = "cancelled",

  // The order has successfully reserved the ticket
  AwaitingPayment = "awaiting:payment",

  // The order has reserved the ticket and the user has
  // provided payment successfully
  Complete = "complete",
}

const currentPath = "/orders";

export default async function OrderInfo({ params }: IParams) {
  const { orderId } = await params;
  const cookie = (await cookies()).get("session")?.value;
  if (!cookie) {
    redirect(`/login?next_path=${currentPath}/${orderId}`);
  }
  const result = await apiRequest<Order>(`${SERVICES.orders}/api/orders/${orderId}`, {
    method: "GET",
    headers: {
      cookie: `session=${cookie}`,
    },
  });
  if (!result.ok) {
    if (result.error[0].field === FieldErrorReason.UNAUTHORIZED) {
      redirect(`/login?next_path=${currentPath}/${orderId}`);
    }
    return <div className="p-4 text-red-500">{result.error[0].message}</div>;
  }
  const order = result.data;
  switch (order.status) {
    case OrderStatus.Cancelled:
      return <p className="">Order cancelled</p>;
    case OrderStatus.Complete:
      return <p className="">Ticket purchased</p>;
    default:
      return (
        <DefaultLayout>
          <div>
            <Card>
              <CardHeader>{order.ticket.title}</CardHeader>
              <CardBody>
                <TimeLeft expiresAt={order.expiresAt} />
              </CardBody>
              <CardFooter className="gap-2">
                <Button as={Link} href={order.stripeCheckoutUrl}>
                  Checkout
                </Button>
                <DeleteButton orderId={order.id} />
              </CardFooter>
            </Card>
          </div>
        </DefaultLayout>
      );
  }
}
