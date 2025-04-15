import React from "react";

import DefaultLayout from "@/layouts/default-layout";
import { SellTicketForm } from "@/components/forms/SellTicketForm";

export default function Tickets() {
  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">
            Sell tickets
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <SellTicketForm />
        </div>
      </div>
    </DefaultLayout>
  );
}
