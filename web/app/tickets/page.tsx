"use client";

import React, { useActionState, useState } from "react";

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";

import DefaultLayout from "@/layouts/default-layout";
import { sellTicketAction } from "@/actions/sellTicketAction";

export default function Tickets() {
  const [state, formAction] = useActionState(sellTicketAction, null);
  const [touchedFields, setTouchedFields] = useState({
    title: false,
    price: false,
  });

  const handleInputChange = (fieldName: "title" | "price") => {
    if (!touchedFields[fieldName]) {
      setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
    }
  };

  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">Sell tickets</h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <Form action={formAction}>
            <Input
              label="Title"
              name="title"
              type="text"
              onChange={() => handleInputChange("title")}
              isInvalid={!touchedFields.title && !!state?.errors?.find((e) => e.path === "title")}
              errorMessage={!touchedFields.title ? state?.errors?.find((e) => e.path === "title")?.message : ""}
            />
            <Input
              label="Price"
              name="price"
              type="number"
              placeholder="0.00"
              startContent={
                <div className="pointer-events-none flex items-center">
                  <span className="text-default-400 text-small">$</span>
                </div>
              }
              onChange={() => handleInputChange("price")}
              isInvalid={!touchedFields.price && !!state?.errors?.find((e) => e.path === "price")}
              errorMessage={!touchedFields.price ? state?.errors?.find((e) => e.path === "price")?.message : ""}
            />
            <Button type="submit" color="primary">
              Sell
            </Button>
          </Form>
        </div>
      </div>
    </DefaultLayout>
  );
}
