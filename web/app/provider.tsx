import ProviderClient from "./providerClient";

interface ICurrentUser {
  id: number;
  email: string;
}

async function getCurrentUser(): Promise<ICurrentUser | undefined> {
  try {
    const res = await fetch("http://auth-srv:3000/api/users/currentuser", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return res.json();
  } catch (error) {
    console.error("Failed to fetch current user:", error);
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
