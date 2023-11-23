import { cookies } from "next/headers";
import { Suspense } from "react";
import Link from "next/link";
import NavBar from "./NavBar";

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
    const res = await fetch(
      `${process.env.AUTH_ENDPOINT!}/api/users/currentuser`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Cookie: `jwt=${jwt?.value}`,
        },
      }
    );
    const responseData: CurrentUserI = await res.json();
    return responseData;
  } catch (error) {
    console.log(error);
    return { currentUser: null };
  }
}

interface Props {
  pageSite: string;
}

const Header = async ({ pageSite }: Props) => {
  const user: CurrentUserI = await getCurrentUser();
  let loggedIn = user.currentUser ? true : false;

  return (
    <header className="bg-white dark:bg-gray-800">
      <Suspense>
        <NavBar loggedIn={loggedIn} pageSite={pageSite} />
      </Suspense>
    </header>
  );
};

export default Header;
