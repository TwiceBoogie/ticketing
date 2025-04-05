import { SERVICES } from "@/constants/serverUrls";
import ProviderClient from "./providerClient";
import { cookies } from "next/headers";

interface ICurrentUser {
  id: number;
  email: string;
}

async function getCurrentUser(): Promise<ICurrentUser | undefined> {
  try {
    const jwt = (await cookies()).get("jwt")?.value;
    const res = await fetch(`${SERVICES.auth}/api/users/currentuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `jwt=${jwt}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return undefined;
  }
}

export async function Providers({ children }: { children: React.ReactNode }) {
  const currentUser = await getCurrentUser();

  return (
    <>
      <ProviderClient currentUser={currentUser}>{children}</ProviderClient>
    </>
  );
}
