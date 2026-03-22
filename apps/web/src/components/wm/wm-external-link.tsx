"use client";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface WmExternalLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function WmExternalLink({ href, children, className, style }: WmExternalLinkProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowWarning(true);
  };

  const handleContinue = () => {
    window.open(href, "_blank", "noopener,noreferrer");
    setShowWarning(false);
  };

  return (
    <>
      <a href={href} onClick={handleClick} className={className} style={style}>
        {children}
      </a>
      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent style={{ background: "#141210", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }}>
          <DialogHeader>
            <DialogTitle style={{ fontFamily: "DynaPuff, cursive", color: "#ffb347" }}>
              You&apos;re leaving myWealthMotley
            </DialogTitle>
            <DialogDescription style={{ color: "#968a84" }}>
              You&apos;re about to visit an external website that is not operated by myWealthMotley.
              We are not responsible for the content, privacy practices, or security of external sites.
            </DialogDescription>
          </DialogHeader>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "12px 16px", fontSize: "0.8rem", color: "#968a84", wordBreak: "break-all" }}>
            {href}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWarning(false)} style={{ borderColor: "rgba(255,255,255,0.1)", color: "#fff" }}>
              Stay on myWealthMotley
            </Button>
            <Button onClick={handleContinue} style={{ background: "#ffb347", color: "#0d0b0a" }}>
              Continue to External Site
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
