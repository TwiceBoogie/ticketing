import { cookies } from "next/headers";

import ProviderClient from "./providerClient";
import { apiRequest } from "@/lib/api/apiRequest";

import { SERVICES } from "@/constants/serverUrls";
import { ICurrentUser, ICurrentUserResponse } from "@/types/auth";

export async function Providers({ children }: { children: React.ReactNode }) {
  let currentUser: ICurrentUser | null = null;
  const session = (await cookies()).get("session")?.value;
  const result = await apiRequest<ICurrentUserResponse>(`${SERVICES.auth}/api/users/currentuser`, {
    method: "GET",
    headers: {
      Cookie: `session=${session}`,
    },
  });
  if (result.ok) {
    currentUser = result.data.currentUser;
  }

  return (
    <>
      <ProviderClient currentUser={currentUser}>{children}</ProviderClient>
    </>
  );
}
