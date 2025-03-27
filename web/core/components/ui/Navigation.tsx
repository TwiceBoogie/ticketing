"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useAuth } from "@/lib/AuthContext";
import { useRouter } from "next/navigation";

import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from "@heroui/navbar";
import { Button } from "@heroui/button";

import BlackHorizontalLogo from "@/public/twicetickets-logos/twicetickets_logo_black.png";
import WhiteHorizontalLogo from "@/public/twicetickets-logos/twicetickets_logo_white.png";

export const Navigation = () => {
  const { resolvedTheme } = useTheme();
  const { user, setUser } = useAuth();
  const router = useRouter();
  const [logo, setLogo] = useState(BlackHorizontalLogo);

  useEffect(() => {
    setLogo(resolvedTheme === "light" ? BlackHorizontalLogo : WhiteHorizontalLogo);
  }, [resolvedTheme]);

  const handleSignOut = async () => {
    try {
      await fetch("http://auth-srv:3000/api/auth/signout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  type LinkConfig = {
    label: string;
    href?: string;
    onClick?: () => void;
    show: boolean;
  };

  const navItems = (
    [
      { label: "Sports", href: "/sports", show: true },
      { label: "Sign Up", href: "/register", show: !user },
      { label: "Sign In", href: "/login", show: !user },
      { label: "Sell Tickets", href: "/tickets", show: !user },
      { label: "My Orders", href: "/orders", show: !user },
      { label: "Sign Out", onClick: handleSignOut, show: !!user },
    ] as LinkConfig[]
  )
    .filter((item) => item.show)
    .map((item) => (
      <NavbarItem key={item.label}>
        {item.href ? (
          <Link href={item.href} className="hover:text-primary transition-colors">
            {item.label}
          </Link>
        ) : (
          <Button variant="light" onPress={item.onClick} className="text-current hover:text-primary">
            {item.label}
          </Button>
        )}
      </NavbarItem>
    ));

  return (
    <Navbar maxWidth="full" shouldHideOnScroll isBlurred={false}>
      <NavbarBrand>
        <Link href={`/`}>
          <Image src={logo} className="h-[30px] w-[133px]" alt="TT logo" />
        </Link>
      </NavbarBrand>

      <NavbarContent className="hidden sm:flex gap-4" justify="end">
        {navItems}
      </NavbarContent>
    </Navbar>
  );
};
