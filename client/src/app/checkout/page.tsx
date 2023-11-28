"use client";

import DarkModeToggle from "@/components/buttons/DarkModeToggle";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Checkout() {
  const router = useRouter();
  const [msg, setMsg] = useState("");
  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      setMsg("Purchase made successfully. Redirecting to homepage");
    }

    if (query.get("canceled")) {
      setMsg("Checkout cancelled, redirecting to homepage");
    }

    setTimeout(() => {
      router.push("/");
      router.refresh();
    }, 3000);
  }, []);

  return (
    <div className="bg-gray-100 dark:bg-gray-800 min-h-screen flex flex-col">
      <div className="hidden">
        <DarkModeToggle />
      </div>
      <div className="flex flex-col justify-center items-center flex-grow w-full">
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Checkout status
          </h5>
          <p className="font-normal text-gray-700 dark:text-gray-400">{msg}</p>
        </div>
      </div>
    </div>
  );
}
