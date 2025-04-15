import React from "react";

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";

import DefaultLayout from "@/layouts/default-layout";
import { SERVICES } from "@/constants/serverUrls";
import PurchaseButton from "@/components/tickets/PurchaseButton";
import { cookies } from "next/headers";

interface ITicketProps {
  params: Promise<{ ticketId: string }>;
}

interface ITicket {
  id: string;
  title: string;
  price: string;
  userId: string;
}

async function getTicket(ticketId: string): Promise<ITicket | undefined> {
  try {
    const res = await fetch(`${SERVICES.tickets}/api/tickets/${ticketId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

    const data = await res.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("error has occured: ", error);
  }
}

interface ICurrentUser {
  id: string;
  email: string;
}

interface ICurrentUserResponse {
  currentUser: ICurrentUser | null;
}

async function getCurrentUser(): Promise<ICurrentUser | null> {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) {
      return null;
    }
    const res = await fetch(`${SERVICES.auth}/api/users/currentuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data: ICurrentUserResponse = await res.json();
    return data.currentUser;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
  }
}

export default async function Ticket({ params }: ITicketProps) {
  const { ticketId } = await params;
  const ticket: ITicket | undefined = await getTicket(ticketId);
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    // do something
    return;
  }
  if (!ticket) {
    return (
      <div>
        <div className="p-4 text-red-500">Failed to load ticket. Please try again later.</div>
      </div>
    );
  }
  if (currentUser.id === ticket.userId) {
    return (
      <div>
        <div className="p-4 text-red-500">Cannot purchase your own ticket.</div>
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
