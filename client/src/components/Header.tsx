"use client";
import Link from "next/link";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import SellTicketButton from "./buttons/SellTicketButton";
import { Suspense, useEffect, useState } from "react";
import DarkModeToggle from "./buttons/DarkModeToggle";
import SignButton from "./buttons/SignButton";
import SignOut from "./buttons/SignOut";

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

export const Header = () => {
  const [user, setUser] = useState<CurrentUserI>();
  const [links, setLinks] = useState<LinkConfig[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // Generate the links based on the user's authentication status
    if (!user) {
      const fetchData = async () => {
        try {
          const res = await fetch("/api/signin", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data: CurrentUserI = await res.json();

          setUser({ ...data });
        } catch (error) {
          console.log(error);
        }
      };
      fetchData();
    }

    user?.currentUser ? setLoggedIn(true) : setLoggedIn(false);
  }, [user]);
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
            <SellTicketButton />
            <SignOut />
          </>
        ) : (
          <>
            <NavbarItem key={1}>
              <SignButton
                setUser={setUser}
                url={`/api/signup`}
                title="Sign Up"
              />
            </NavbarItem>
            <NavbarItem key={2}>
              <SignButton
                setUser={setUser}
                url={`/api/signin`}
                title="Sign In"
              />
            </NavbarItem>
          </>
        )}

        <DarkModeToggle />
      </NavbarContent>
    </Navbar>
  );
};
