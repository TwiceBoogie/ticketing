"use client";

import React from "react";

import { Button } from "@heroui/button";
import { addToast } from "@heroui/toast";

import { signOutAction } from "@/actions/signOutAction";
import { useAuth } from "@/lib/AuthContext";
import { useAppRouter } from "@/hooks/use-app-router";
import DefaultLayout from "@/layouts/default-layout";

export default function CustomErrorComponent() {
  const { setUser } = useAuth();
  const router = useAppRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    try {
      const res = await signOutAction();
      if (!res.ok) {
        throw new Error(res.message);
      }
      setUser(null);
      addToast({
        title: res.message,
        color: "success",
      });
      router.push("/");
    } catch (error) {
      console.error("Sign out failed:", error);
      addToast({
        title: "Sign out failed",
        color: "danger",
      });
    }
  };

  return (
    <DefaultLayout>
      <div className={`h-screen w-full overflow-hidden bg-custom-background-100`}>
        <div className="grid h-full place-items-center p-4">
          <div className="space-y-8 text-center">
            <div className="space-y-2 relative flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold">Yikes! That doesn{"'"}t look good.</h3>
              <p className="mx-auto md:w-1/2 text-sm text-custom-text-200">
                It looks like an unexpected error occurred. We're aware of the issue and are looking into it. You can
                try refreshing the page or signing out and back in. if the problem persists, feel free to reach out to{" "}
                <a href="mailto:support@random.so" className="text-custom-primary">
                  support@random.so
                </a>
              </p>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Button size="md" onPress={handleRefresh}>
                Refresh
              </Button>
              <Button size="md" onPress={handleSignOut}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
