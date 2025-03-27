"use client";

import { API_BASE_URL } from "@/helpers/common.helper";
import { useAppRouter } from "@/hooks/use-app-router";
import DefaultLayout from "@/layouts/default-layout";
import { AuthService } from "@/services/auth.service";
import { Button } from "@heroui/react";
import React from "react";

const authService = new AuthService();

export default function CustomErrorComponent() {
  const router = useAppRouter();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleSignOut = async () => {
    await authService
      .signOut(API_BASE_URL)
      .catch(() => {
        console.log("error");
      })
      .finally(() => router.push("/"));
  };

  return (
    <DefaultLayout>
      <div className={`h-screen w-full overflow-hidden bg-custom-background-100`}>
        <div className="grid h-full place-items-center p-4">
          <div className="space-y-8 text-center">
            <div className="space-y-2 relative flex flex-col justify-center items-center">
              <h3 className="text-lg font-semibold">Yikes! That doesn{"'"}t look good.</h3>
              <p className="mx-auto md:w-1/2 text-sm text-custom-text-200">
                That crashed Plane, pun intended. No worries, though. Our engineers have been notified. If you have more
                details, please write to{" "}
                <a href="mailto:support@plane.so" className="text-custom-primary">
                  support@plane.so
                </a>{" "}
                or on our{" "}
                <a
                  href="https://discord.com/invite/A92xrEGCge"
                  target="_blank"
                  className="text-custom-primary"
                  rel="noopener noreferrer"
                >
                  Discord
                </a>
                .
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
