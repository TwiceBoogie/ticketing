"use client";
import React from "react";
import { Button } from "@nextui-org/button";

const page = () => {
  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/test", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const responseData = await res.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  return <Button onPress={handleSubmit}>hi</Button>;
};

export default page;
