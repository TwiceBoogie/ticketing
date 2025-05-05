import React from "react";
import { cookies } from "next/headers";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

import EditButton from "@/components/tickets/EditButton";
import PurchaseButton from "@/components/tickets/PurchaseButton";
import { apiRequest } from "@/lib/api/apiRequest";
import DefaultLayout from "@/layouts/default-layout";

import { SERVICES } from "@/constants/serverUrls";
import { ICurrentUserResponse } from "@/types/auth";
import { ITicket } from "@/types/ticket";

interface ITicketProps {
  params: Promise<{ ticketId: string }>;
}

export default async function Ticket({ params }: ITicketProps) {
  const { ticketId } = await params;
  const ticketResult = await apiRequest<ITicket>(`${SERVICES.tickets}/api/tickets/${ticketId}`, {
    method: "GET",
  });
  const session = (await cookies()).get("session")?.value;
  const currentUserResult = await apiRequest<ICurrentUserResponse>(`${SERVICES.auth}/api/users/currentuser`, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
  });
  if (!ticketResult.ok) {
    return (
      <div>
        <div className="p-4 text-red-500">Failed to load ticket. Please try again later.</div>
      </div>
    );
  }
  const ticket = ticketResult.data;

  let isTicketOwner = false;
  if (currentUserResult.ok) {
    isTicketOwner = currentUserResult.data.currentUser?.id === ticket.userId;
  }
  return (
    <DefaultLayout>
      <div>
        <Card>
          <CardHeader>{ticket.title}</CardHeader>
          <CardBody>${ticket.price}</CardBody>
          <CardFooter>
            {isTicketOwner ? (
              <EditButton ticketId={ticketId} title={ticket.title} price={ticket.price} />
            ) : (
              <PurchaseButton ticketId={ticket.id} />
            )}
          </CardFooter>
        </Card>
      </div>
    </DefaultLayout>
  );
}
