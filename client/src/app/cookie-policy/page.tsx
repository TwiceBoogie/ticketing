import Header from "@/components/Header";
import { TicketForm } from "@/components/forms/TicketForm";
import { Suspense } from "react";

export default function CookiePolicy() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Cookie Policy</h1>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">What are cookies?</h2>
        <p className="mb-2">
          Cookies are small data files placed on your computer or mobile device
          when you visit a website.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Where can I get further information?
        </h2>
        <p className="mb-2">
          If you have any questions about our use of cookies or other
          technologies, please contact us at:
        </p>
      </section>
    </div>
  );
}
