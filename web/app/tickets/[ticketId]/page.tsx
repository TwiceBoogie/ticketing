import React from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";

import DefaultLayout from "@/layouts/default-layout";
import { SERVICES } from "@/constants/serverUrls";
import PurchaseButton from "@/components/tickets/PurchaseButton";

interface ITicketProps {
  params: Promise<{ ticketId: string }>;
}

interface ITicket {
  id: string;
  title: string;
  price: string;
}

async function getTicket(ticketId: string): Promise<ITicket | undefined> {
  try {
    const res = await fetch(`${SERVICES.tickets}/api/tickets/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("error has occured: ", error);
  }
}

export default async function Ticket({ params }: ITicketProps) {
  const { ticketId } = await params;
  const ticket: ITicket | undefined = await getTicket(ticketId);
  if (!ticket) {
    return (
      <div>
        <div className="p-4 text-red-500">Failed to load ticket. Please try again later.</div>
      </div>
    );
  }
  return (
    <DefaultLayout>
      <div>
        <Card>
          <CardHeader>{ticket.title}</CardHeader>
          <CardBody>${ticket.price}</CardBody>
          <CardFooter>
            <PurchaseButton ticketId={ticket.id} />
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}
