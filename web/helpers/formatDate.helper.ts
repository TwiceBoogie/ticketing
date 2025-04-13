import { FlattenedOrder, Order } from "@/types/order";

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const datePart = date
    .toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "2-digit",
    })
    .replace(/\//g, "-");

  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return `${datePart}, ${timePart}`;
}

export function flattenOrders<T extends Order>(orders: T[]): FlattenedOrder[] {
  return orders.map(({ ticket, ...rest }) => ({
    ...rest,
    ticketId: ticket.id,
    title: ticket.title,
    price: ticket.price,
    formattedCreatedAt: formatDate(rest.createdAt),
    formattedExpiresAt: formatDate(rest.expiresAt),
  }));
}
