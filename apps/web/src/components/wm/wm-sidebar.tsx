"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";
import {
  Wallet,
  SquaresFour,
  ArrowsLeftRight,
  ChartPie,
  PiggyBank,
  Users,
  AirplaneTilt,
  TrendUp,
  BookOpen,
  Sparkle,
  Robot,
  GearSix,
  SignOut,
  DotsThreeOutline,
  CaretDown,
  ChartBar,
  FileText,
  CurrencyDollar,
  Path,
  CaretDoubleLeft,
  CaretDoubleRight,
} from "@phosphor-icons/react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import { ROUTES, APP_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/* ------------------------------------------------------------------ */
/*  Style constants (matching template exactly)                        */
/* ------------------------------------------------------------------ */

const glowDot: React.CSSProperties = {
  boxShadow: "0 0 20px rgba(255, 179, 71, 0.15)",
};

const activeShadow: React.CSSProperties = {
  boxShadow: "inset 0 0 10px rgba(255, 179, 71, 0.05)",
};

const bgBlur: React.CSSProperties = {
  background: "rgba(18, 16, 14, 0.8)",
  backdropFilter: "blur(24px)",
};

/* ------------------------------------------------------------------ */
/*  Custom scrollbar (injected once)                                   */
/* ------------------------------------------------------------------ */

const scrollbarCSS = `
  .wm-sidebar-scroll::-webkit-scrollbar { width: 4px; }
  .wm-sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
  .wm-sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 4px; }
  .wm-sidebar-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255, 255, 255, 0.2); }
`;

function useScrollbarStyles() {
  React.useEffect(() => {
    const id = "wm-sidebar-scrollbar";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = scrollbarCSS;
    document.head.appendChild(style);
    return () => {
      const el = document.getElementById(id);
      if (el) document.head.removeChild(el);
    };
  }, []);
}

/* ------------------------------------------------------------------ */
/*  Badge components                                                   */
/* ------------------------------------------------------------------ */

function NavBadge({
  children,
  color = "brand",
}: {
  children: React.ReactNode;
  color?: "brand" | "green";
}) {
  if (color === "green") {
    return (
      <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[rgba(52,211,153,0.1)] border border-[rgba(52,211,153,0.2)] group-data-[collapsible=icon]:hidden">
        <span className="w-1.5 h-1.5 rounded-full bg-[#34d399] animate-pulse" />
        <span className="text-[9px] wm-mono font-bold text-[#34d399] uppercase tracking-wide">
          {children}
        </span>
      </div>
    );
  }
  return (
    <span className="px-2 py-0.5 rounded text-[9px] wm-mono font-bold bg-[rgba(255,179,71,0.1)] text-[#ffb347] border border-[rgba(255,179,71,0.2)] uppercase tracking-wide group-data-[collapsible=icon]:hidden">
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/*  NavItem component                                                  */
/* ------------------------------------------------------------------ */

interface NavItemProps {
  href: string;
  active?: boolean;
  isLogout?: boolean;
  icon: React.ElementType;
  label: string;
  badge?: React.ReactNode;
  onClick?: (e: React.MouseEvent) => void;
}

function NavItem({
  href,
  active = false,
  isLogout = false,
  icon: Icon,
  label,
  badge,
  onClick,
}: NavItemProps) {
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed" && !isMobile;

  const baseClasses =
    "group/navitem w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 border";

  let stateClasses = "";
  if (active) {
    stateClasses =
      "text-[#ffb347] bg-[rgba(255,179,71,0.1)] border-[rgba(255,179,71,0.3)]";
  } else if (isLogout) {
    stateClasses =
      "text-[#968a84] hover:text-[#ef4444] hover:bg-[rgba(239,68,68,0.1)] border-transparent mt-2";
  } else {
    stateClasses =
      "text-[#968a84] hover:text-white hover:bg-[rgba(255,255,255,0.04)] border-transparent";
  }

  const inner = (
    <>
      <div className={cn(
        "flex items-center gap-3",
        isCollapsed && "justify-center w-full"
      )}>
        <Icon
          size={18}
          weight={active ? "fill" : "bold"}
          className="shrink-0"
        />
        <span className={cn(
          "text-sm font-medium group-hover/navitem:translate-x-1 transition-transform",
          "group-data-[collapsible=icon]:hidden"
        )}>
          {label}
        </span>
      </div>
      {badge}
    </>
  );

  const content = isLogout ? (
    <button
      type="button"
      className={cn(
        baseClasses,
        stateClasses,
        "cursor-pointer",
        isCollapsed && "justify-center px-0"
      )}
      onClick={onClick}
    >
      {inner}
    </button>
  ) : (
    <Link
      href={href}
      className={cn(
        baseClasses,
        stateClasses,
        isCollapsed && "justify-center px-0"
      )}
      style={active ? activeShadow : undefined}
      onClick={onClick}
    >
      {inner}
    </Link>
  );

  // When collapsed, wrap in a tooltip
  if (isCollapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          {content}
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          {label}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

/* ------------------------------------------------------------------ */
/*  Section label                                                      */
/* ------------------------------------------------------------------ */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10px] wm-mono text-[#968a84] uppercase tracking-wider mb-2 px-3 group-data-[collapsible=icon]:hidden">
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main export                                                        */
/* ------------------------------------------------------------------ */

interface WmSidebarProps {
  variant?: "default" | "admin";
}

export function WmSidebar({ variant = "default" }: WmSidebarProps) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { state, toggleSidebar, isMobile } = useSidebar();
  const isAdmin = variant === "admin";
  const [adminOpen, setAdminOpen] = React.useState(isAdmin);
  const isCollapsed = state === "collapsed" && !isMobile;

  useScrollbarStyles();

  // User info from Clerk
  const displayName =
    user?.fullName ?? user?.firstName ?? user?.username ?? "Welcome";
  const displayEmail =
    user?.primaryEmailAddress?.emailAddress ?? "";
  const initials = user
    ? `${(user.firstName?.[0] ?? "").toUpperCase()}${(user.lastName?.[0] ?? "").toUpperCase()}` ||
      "WM"
    : "WM";
  const avatarUrl = user?.imageUrl ?? "";

  const isActive = (href: string) => {
    if (href === ROUTES.admin) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <Sidebar
      collapsible="icon"
      className="!border-r !border-[rgba(255,255,255,0.08)] !bg-[#0d0b0a] !min-h-screen"
      style={
        {
          "--sidebar-width": "280px",
          "--sidebar-width-icon": "48px",
          "--sidebar-background": "#0d0b0a",
          "--sidebar-foreground": "#ffffff",
          background: "#0d0b0a",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          color: "#ffffff",
          minHeight: "100vh",
        } as React.CSSProperties
      }
    >
      {/* ---- Logo ---- */}
      <SidebarHeader className="!p-0 !bg-[#0d0b0a]">
        <div className={cn(
          "h-20 flex items-center justify-between border-b border-[rgba(255,255,255,0.08)] shrink-0",
          isCollapsed ? "px-2 justify-center" : "px-6"
        )}>
          <Link
            href={isAdmin ? ROUTES.admin : ROUTES.dashboard}
            className={cn(
              "flex items-center gap-2 group/logo",
              isCollapsed && "justify-center"
            )}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-[#ffb347] text-[#0d0b0a]">
              <span className="wm-heading text-sm font-bold">W</span>
            </div>
            <span className="wm-heading text-xl text-white group-hover/logo:text-[#ffb347] transition-colors tracking-tight group-data-[collapsible=icon]:hidden">
              {APP_NAME}
              <span className="text-[#ffb347]">.</span>
            </span>
          </Link>
          {/* Collapse toggle button -- hidden when collapsed (expand button shown in footer instead) */}
          <button
            type="button"
            onClick={toggleSidebar}
            className="hidden md:flex w-7 h-7 items-center justify-center rounded-lg text-[#968a84] hover:text-[#ffb347] hover:bg-white/5 transition-colors group-data-[collapsible=icon]:hidden"
          >
            <CaretDoubleLeft size={14} weight="bold" />
          </button>
        </div>
      </SidebarHeader>

      {/* ---- User Profile Card (hidden when collapsed) ---- */}
      <div className="p-5 border-b border-[rgba(255,255,255,0.08)] shrink-0 bg-[rgba(255,255,255,0.04)] group-data-[collapsible=icon]:hidden">
        <div className="flex items-center gap-3 rounded-xl cursor-pointer group">
          {/* Avatar */}
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-12 h-12 rounded-full border border-[rgba(255,179,71,0.3)] object-cover transition-all group-hover:border-[rgba(255,179,71,0.5)]"
              style={{ boxShadow: "0 0 20px rgba(255, 179, 71, 0.15)" }}
            />
          ) : (
            <div
              className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgba(255,179,71,0.2)] to-[rgba(230,126,34,0.2)] border border-[rgba(255,179,71,0.3)] flex items-center justify-center wm-heading text-[#ffb347] text-lg transition-all group-hover:border-[rgba(255,179,71,0.5)]"
              style={{ boxShadow: "0 0 20px rgba(255, 179, 71, 0.15)" }}
            >
              {initials[0]}
            </div>
          )}
          {/* Name / email */}
          <div className="flex-1 min-w-0">
            <p className="text-base font-semibold truncate text-white group-hover:text-[#ffb347] transition-colors">
              {displayName}
            </p>
            <p className="text-xs wm-mono text-[#968a84] truncate">
              {displayEmail}
            </p>
          </div>
          {/* Dots menu */}
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-white/10 transition-colors">
            <DotsThreeOutline
              size={16}
              className="text-[#968a84] group-hover:text-white"
              weight="bold"
            />
          </div>
        </div>
      </div>

      {/* ---- Navigation ---- */}
      <SidebarContent className="!overflow-y-auto !py-6 !px-4 !flex !flex-col !gap-6 !bg-[#0d0b0a] wm-sidebar-scroll group-data-[collapsible=icon]:!px-1 group-data-[collapsible=icon]:!py-3 group-data-[collapsible=icon]:!gap-2">
        {/* === Your Money === */}
        <div className="flex flex-col gap-1">
          <SectionLabel>Your Money</SectionLabel>
          <NavItem
            href={ROUTES.allMyMoney}
            active={isActive(ROUTES.allMyMoney)}
            icon={Wallet}
            label="All My Money"
          />
          <NavItem
            href={ROUTES.dashboard}
            active={isActive(ROUTES.dashboard)}
            icon={SquaresFour}
            label="Dashboard"
          />
          <NavItem
            href={ROUTES.transactions}
            active={isActive(ROUTES.transactions)}
            icon={ArrowsLeftRight}
            label="Transactions"
          />
          <NavItem
            href={ROUTES.budget}
            active={isActive(ROUTES.budget)}
            icon={ChartPie}
            label="Budget"
          />
          <NavItem
            href={ROUTES.savings}
            active={isActive(ROUTES.savings)}
            icon={PiggyBank}
            label="Savings"
          />
          <NavItem
            href={ROUTES.portfolio}
            active={isActive(ROUTES.portfolio)}
            icon={TrendUp}
            label="Portfolio"
          />
        </div>

        {/* === Grow === */}
        <div className="flex flex-col gap-1">
          <SectionLabel>Grow</SectionLabel>
          <NavItem
            href={ROUTES.learn}
            active={isActive(ROUTES.learn)}
            icon={BookOpen}
            label="Learn"
            badge={<NavBadge>Daily Tip</NavBadge>}
          />
          <NavItem
            href={ROUTES.moneyStory}
            active={isActive(ROUTES.moneyStory)}
            icon={Sparkle}
            label="Money Story"
          />
          <NavItem
            href={ROUTES.futureYou}
            active={isActive(ROUTES.futureYou)}
            icon={Path}
            label="Future You"
          />
          <NavItem
            href={ROUTES.sholz}
            active={isActive(ROUTES.sholz)}
            icon={Robot}
            label="Mo"
            badge={<NavBadge color="green">AI</NavBadge>}
          />
        </div>

        {/* === Admin Portal (only for admin variant, hidden when collapsed) === */}
        {isAdmin && (
          <div className="flex flex-col gap-1 border-y border-[rgba(255,255,255,0.08)] py-4 my-2 relative group-data-[collapsible=icon]:hidden">
            <button
              type="button"
              onClick={() => setAdminOpen(!adminOpen)}
              className="w-full flex items-center justify-between px-3 py-1 group hover:bg-white/5 rounded-lg transition-colors cursor-pointer mb-1"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] wm-mono text-[#968a84] uppercase tracking-wider group-hover:text-white transition-colors">
                  Admin Portal
                </span>
                <span className="px-1.5 py-0.5 rounded text-[8px] wm-mono bg-[rgba(255,179,71,0.2)] text-[#ffb347] border border-[rgba(255,179,71,0.3)] uppercase tracking-widest font-bold">
                  Superadmin
                </span>
              </div>
              <CaretDown
                size={14}
                className="text-[#968a84] group-hover:text-white transition-transform"
                style={{
                  transform: adminOpen ? "rotate(0deg)" : "rotate(-90deg)",
                  transition: "transform 0.3s ease",
                }}
                weight="bold"
              />
            </button>

            <div
              style={{
                maxHeight: adminOpen ? "500px" : "0",
                opacity: adminOpen ? 1 : 0,
                overflow: "hidden",
                transition:
                  "max-height 0.3s ease-in-out, opacity 0.3s ease-in-out",
              }}
              className="flex flex-col gap-1"
            >
              <NavItem
                href={ROUTES.admin}
                active={isActive(ROUTES.admin)}
                icon={SquaresFour}
                label="Overview"
              />
              <NavItem
                href={ROUTES.adminUsers}
                active={isActive(ROUTES.adminUsers)}
                icon={Users}
                label="Users"
              />
              <NavItem
                href={ROUTES.adminAnalytics}
                active={isActive(ROUTES.adminAnalytics)}
                icon={ChartBar}
                label="Analytics"
              />
              <NavItem
                href={ROUTES.adminContent}
                active={isActive(ROUTES.adminContent)}
                icon={FileText}
                label="Content"
              />
              <NavItem
                href={ROUTES.adminBilling}
                active={isActive(ROUTES.adminBilling)}
                icon={CurrencyDollar}
                label="Billing"
              />
            </div>
          </div>
        )}

        {/* === Account === */}
        <div className="flex flex-col gap-1 pb-4">
          <SectionLabel>Account</SectionLabel>
          <NavItem
            href={ROUTES.settings}
            active={isActive(ROUTES.settings)}
            icon={GearSix}
            label="Settings"
          />
          <NavItem
            href="#"
            isLogout
            icon={SignOut}
            label="Logout"
            onClick={(e) => {
              e.preventDefault();
              signOut({ redirectUrl: "/" });
            }}
          />
        </div>
      </SidebarContent>

      {/* ---- Footer: collapse/expand button + gradient bar ---- */}
      <SidebarFooter className="!p-0 !bg-[#0d0b0a]">
        {/* Expand button visible only when collapsed */}
        <div className="hidden group-data-[collapsible=icon]:flex items-center justify-center py-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={toggleSidebar}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-[#968a84] hover:text-[#ffb347] hover:bg-white/5 transition-colors"
              >
                <CaretDoubleRight size={14} weight="bold" />
              </button>
            </TooltipTrigger>
            <TooltipContent side="right">Expand Sidebar</TooltipContent>
          </Tooltip>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-transparent via-[rgba(255,179,71,0.2)] to-transparent shrink-0" />
      </SidebarFooter>
    </Sidebar>
  );
}
