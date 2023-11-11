import { Button } from "@nextui-org/react";
import React from "react";

const SignOut = () => {
  const handleSignout = async () => {
    try {
      const res = await fetch("/api/signout", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });
      const responseData = await res.json();
      console.log(responseData);
    } catch (error) {
      console.log(error);
    }
  };
  return <Button onPress={handleSignout}>SignOut</Button>;
};

export default SignOut;
