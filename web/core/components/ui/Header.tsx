"use client";

import { useAuth } from "@/lib/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Header = () => {
  const { user, setUser } = useAuth();
  // const router = useRouter();

  const handleSignOut = async () => {
    try {
      await fetch("http://auth-srv:3000/api/auth/signout", { method: "POST", credentials: "include" });
      setUser(null); // Clear client state
      // router.push('/'); // Redirect to home
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  type LinkConfig = { label: string; href?: string; onClick?: () => void };

  const links = (
    [
      !user && { label: "Sign Up", href: "/register" },
      !user && { label: "Sign In", href: "/login" },
      user && { label: "Sell Tickets", href: "/tickets/new" },
      user && { label: "My Orders", href: "/orders" },
      user && { label: "Sign Out", onClick: handleSignOut }, // Changed to button
    ] as Array<false | LinkConfig>
  )
    .filter((item): item is LinkConfig => Boolean(item))
    .map((item) => (
      <li key={item.label} className="px-4 py-2 hover:bg-gray-100 rounded transition-colors">
        {item.href ? (
          <Link href={item.href} className="text-gray-700 hover:text-gray-900">
            {item.label}
          </Link>
        ) : (
          <button onClick={item.onClick} className="text-gray-700 hover:text-gray-900">
            {item.label}
          </button>
        )}
      </li>
    ));

  return (
    <nav className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
      <Link href="/" className="text-xl font-bold text-gray-800 hover:text-gray-600">
        GitTix
      </Link>
      <div className="flex items-center space-x-2">
        <ul className="flex items-center space-x-2">{links}</ul>
      </div>
    </nav>
  );
};

export default Header;
