import { useRouter } from "next/navigation";
import { useState } from "react";
import { SpinnerIcon } from "../icons";

const SignOut = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleSignout = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/signout", {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      });

      if (res.ok) {
        setIsLoading(false);
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
      {isLoading ? <SpinnerIcon /> : "Sign out"}
    </button>
  );
};

export default SignOut;
