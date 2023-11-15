import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import SellTicketButton from "./buttons/SellTicketButton";
import DarkModeToggle from "./buttons/DarkModeToggle";
import SignButton from "./buttons/SignButton";
import SignOut from "./buttons/SignOut";
import { cookies } from "next/headers";
import { createRedisInstance } from "@/core/config";
import { Button } from "@nextui-org/button";
import { Suspense } from "react";

const redis = createRedisInstance();

type LinkConfig = {
  label: string;
  href: string;
};

interface CurrentUserI {
  currentUser: {
    id: string;
    email: string;
  } | null;
}

async function getCurrentUser() {
  try {
    const jwt = cookies().get("jwt");
    const res = await fetch("http://localhost:3001/api/users/currentuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt?.value}`,
      },
    });
    const responseData: CurrentUserI = await res.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return { currentUser: null };
  }
}

export const Header = async () => {
  const user: CurrentUserI = await getCurrentUser();
  let loggedIn = user.currentUser ? true : false;

  return (
    <Navbar>
      <NavbarBrand>
        <Link href="/" className="font-bold ">
          GitTix
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {loggedIn ? (
          <>
            <NavbarItem>
              <Suspense>
                <SellTicketButton />
              </Suspense>
            </NavbarItem>
            <NavbarItem>
              <Suspense>
                <SignOut />
              </Suspense>
            </NavbarItem>
          </>
        ) : (
          <>
            <NavbarItem>
              <Suspense>
                <SignButton url="/api/signup" title="Sign Up" />
              </Suspense>
            </NavbarItem>
            <NavbarItem>
              <Suspense>
                <SignButton url="/api/signin" title="Sign In" />
              </Suspense>
            </NavbarItem>
          </>
        )}
        <Suspense>
          <DarkModeToggle />
        </Suspense>
      </NavbarContent>
    </Navbar>
  );
};
