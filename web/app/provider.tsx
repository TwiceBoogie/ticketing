import { SERVICES } from "@/constants/serverUrls";
import ProviderClient from "./providerClient";
import { cookies } from "next/headers";

interface ICurrentUser {
  id: number;
  email: string;
}

interface ICurrentUserResponse {
  currentUser: ICurrentUser | null;
}

async function getCurrentUser(): Promise<ICurrentUser | null> {
  try {
    const session = (await cookies()).get("session")?.value;
    if (!session) {
      return null;
    }
    const res = await fetch(`${SERVICES.auth}/api/users/currentuser`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session=${session}`,
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data: ICurrentUserResponse = await res.json();
    return data.currentUser;
  } catch (error) {
    console.error("Failed to fetch current user:", error);
    return null;
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
