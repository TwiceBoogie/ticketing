import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import ConfirmOrderButton from "@/components/buttons/ConfirmOrderButton";

interface Props {
  params: {
    ticketId: string;
  };
}

async function getTicket(ticketId: string) {
  try {
    const res = await fetch(`http://localhost:3004/api/tickets/${ticketId}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });
    const responseData = await res.json();

    return responseData;
  } catch (error) {
    console.log(error);
  }
}

export default async function Tickets({ params }: Props) {
  const data = await getTicket(params.ticketId);
  console.log(data, "in ticketId regular");

  return (
    <div className="flex justify-center">
      <Card className="w-96">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          <p className="text-tiny uppercase font-bold">Price:</p>
          <small className="text-default-500">${data.price}</small>
          <h4 className="font-bold text-large">{data.title}</h4>
        </CardHeader>
        <CardBody>{/* <ConfirmOrderButton ticketId={data.id} /> */}</CardBody>
      </Card>
    </div>
  );
}
