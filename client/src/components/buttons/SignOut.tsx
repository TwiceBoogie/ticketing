"use client";
import { Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import React from "react";

const SignOut = () => {
  const router = useRouter();
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/signout", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const responseData = await res.json();
      if (res.ok) {
        router.refresh();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return <Button onPress={handleSignout}>SignOut</Button>;
};

export default SignOut;
