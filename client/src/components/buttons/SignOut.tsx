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
  return (
    <button
      className="inline-block shrink-0 rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
      onClick={handleSignout}
    >
      Sign out
    </button>
  );
};

export default SignOut;
