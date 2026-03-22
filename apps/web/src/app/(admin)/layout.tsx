"use client";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { WmSidebar } from "@/components/wm/wm-sidebar";
import { WmHeader } from "@/components/wm/wm-header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <WmSidebar variant="admin" />
      <SidebarInset className="!bg-[#0d0b0a]">
        <WmHeader title="Admin" />
        {/* Ambient glow effects */}
        <div
          className="pointer-events-none fixed -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full z-0"
          style={{
            background: "radial-gradient(circle, rgba(255, 179, 71, 0.04) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <div
          className="pointer-events-none fixed -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full z-0"
          style={{
            background: "radial-gradient(circle, rgba(239, 68, 68, 0.03) 0%, transparent 70%)",
            filter: "blur(120px)",
          }}
        />
        <main
          className="relative z-10 flex-1 px-4 py-6 md:px-6 lg:px-8 overflow-y-auto"
          style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}
        >
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
