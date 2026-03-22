"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WmSidebar } from "@/components/wm/wm-sidebar";
import { WmHeader } from "@/components/wm/wm-header";
import { WmMfaPrompt } from "@/components/wm/wm-mfa-prompt";
import { useEnsureUser } from "@/hooks/use-ensure-user";
import { useSessionTimeout } from "@/hooks/use-session-timeout";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  useEnsureUser();
  useSessionTimeout();

  return (
    <SidebarProvider>
      <WmSidebar variant="default" />
      <SidebarInset className="!bg-[#0d0b0a]">
        <WmHeader />
        <WmMfaPrompt />
        {/* Ambient glow effects */}
        <div
          className="pointer-events-none fixed -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full z-0"
          style={{
            background: "radial-gradient(circle, rgba(255, 179, 71, 0.06) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <div
          className="pointer-events-none fixed -bottom-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full z-0"
          style={{
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.04) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative z-10 flex-1 px-4 py-6 md:px-6 lg:px-8"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </SidebarInset>
    </SidebarProvider>
  );
}
