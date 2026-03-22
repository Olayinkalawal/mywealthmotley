"use client";

import * as React from "react";
import Link from "next/link";
import { List } from "@phosphor-icons/react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useSidebar } from "@/components/ui/sidebar";
import { WmCurrencySelector } from "@/components/wm/wm-currency-selector";
import { WmNotifications } from "@/components/wm/wm-notifications";
import { APP_NAME, ROUTES } from "@/lib/constants";

interface WmHeaderProps {
  title?: string;
}

export function WmHeader({ title }: WmHeaderProps) {
  const { toggleSidebar, isMobile } = useSidebar();
  const { user } = useUser();

  const initials = user
    ? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}` || "WM"
    : "WM";
  const avatarUrl = user?.imageUrl ?? "";

  return (
    <header
      className="sticky top-0 z-30 flex h-14 shrink-0 items-center border-b md:h-16"
      style={{
        background: "transparent",
        borderColor: "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex w-full items-center gap-3 px-4 md:px-6">
        {isMobile ? (
          <>
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleSidebar}
              className="md:hidden text-[#968a84] hover:text-[#ffb347] hover:bg-white/5"
            >
              <List className="size-5" weight="bold" />
              <span className="sr-only">Open menu</span>
            </Button>
            <div className="flex flex-1 items-center justify-center">
              <Link href={ROUTES.dashboard}>
                <span className="wm-heading text-lg font-bold tracking-tight text-white">
                  {APP_NAME}<span className="text-[#ffb347]">.</span>
                </span>
              </Link>
            </div>
            <WmNotifications />
            <Link href={ROUTES.settings}>
              <Avatar size="sm">
                <AvatarImage src={avatarUrl} alt="User" />
                <AvatarFallback className="bg-[#ffb347] text-[#0d0b0a] text-xs font-semibold wm-heading">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Link>
          </>
        ) : (
          <>
            <div className="flex flex-1 items-center gap-3">
              {title && (
                <h1 className="wm-heading text-lg font-semibold tracking-tight text-white">
                  {title}
                </h1>
              )}
            </div>
            <div className="flex items-center gap-2">
              <WmCurrencySelector />
              <Separator
                orientation="vertical"
                className="mx-1 h-6 bg-white/10"
              />
              <WmNotifications />
              <Link href={ROUTES.settings}>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer border"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    borderColor: "rgba(255,255,255,0.1)",
                  }}
                >
                  <Avatar size="sm">
                    <AvatarImage src={avatarUrl} alt="User" />
                    <AvatarFallback className="bg-[#ffb347] text-[#0d0b0a] text-xs font-semibold wm-heading">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
