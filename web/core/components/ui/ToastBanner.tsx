"use client";

import { useEffect } from "react";
import { addToast } from "@heroui/toast";

export const ToastBanner = () => {
  useEffect(() => {
    addToast({
      title: "Ticket purchased successfully",
      color: "success",
    });
  }, []);

  return null;
};
