import React from "react";

// import { Form } from "@heroui/form";
// import { Input } from "@heroui/input";
// import { Button } from "@heroui/button";

import DefaultLayout from "@/layouts/default-layout";
import { CsrfProvider } from "@/components/forms/CsrfProvider";
// import { SecureFormRoot } from "@/components/forms/SecureFormRoot";
// import { ITicketResponse } from "@/types/ticket";
// import { sellTicketAction } from "@/actions/sellTicketAction";
import { SellTicketForm } from "@/components/forms/SellTicketForm";
// import { sellTicketAction } from "@/actions/sellTicketAction";
// import { addToast } from "@heroui/react";

export default function Tickets() {
  // const [state, formAction] = useActionState(sellTicketAction, null);
  // const [touchedFields, setTouchedFields] = useState({
  //   title: false,
  //   price: false,
  // });

  // const handleInputChange = (fieldName: "title" | "price") => {
  //   if (!touchedFields[fieldName]) {
  //     setTouchedFields((prev) => ({ ...prev, [fieldName]: true }));
  //   }
  // };

  // const getError = (field: string): string | undefined => {
  //   if (!state || state.ok) return;
  //   return state.error.find((e) => e.field === field)?.message;
  // };

  // useEffect(() => {
  //   if (state && !state.ok) {
  //     setTouchedFields({ title: false, price: false });
  //     const formError = state.error.find((e) => e.field === "form");
  //     if (formError) {
  //       addToast({
  //         title: "Form Error",
  //         description: formError.message,
  //         color: "danger",
  //       });
  //     }
  //   } else if (state && state.ok) {
  //     setTouchedFields({ title: false, price: false });
  //     addToast({
  //       title: "Ticket created successfully",
  //       description: `${state.data.title} - $${state.data.price}`,
  //       color: "success",
  //     });
  //   }
  // }, [state]);

  return (
    <DefaultLayout>
      <div className="flex flex-1 flex-col justify-center px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900 dark:text-gray-300">
            Sell tickets
          </h2>
        </div>
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <CsrfProvider>
            <SellTicketForm />
          </CsrfProvider>
          {/* <Form action={formAction}>
            <Input
              label="Title"
              name="title"
              type="text"
              onChange={() => handleInputChange("title")}
              isInvalid={!touchedFields.title && !!getError("title")}
              errorMessage={!touchedFields.title ? getError("title") : ""}
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
              isInvalid={!touchedFields.price && !!getError("price")}
              errorMessage={!touchedFields.price ? getError("price") : ""}
            />
            <Button type="submit" color="primary">
              Sell
            </Button>
          </Form> */}
        </div>
      </div>
    </DefaultLayout>
  );
}
