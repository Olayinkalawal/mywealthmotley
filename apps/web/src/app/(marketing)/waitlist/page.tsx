"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  Shield,
  Sparkle,
  Users,
  Gift,
  ShareNetwork,
  TwitterLogo,
  EnvelopeSimple,
  CaretUp,
} from "@phosphor-icons/react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  APP_NAME,
  SUPPORTED_COUNTRIES,
  ROUTES,
} from "@/lib/constants";

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function WaitlistPage() {
  const searchParams = useSearchParams();
  const referralParam = searchParams.get("ref") || "";

  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [referredBy, setReferredBy] = useState(referralParam);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const [result, setResult] = useState<{
    position: number;
    referralCode: string;
    referralCount: number;
    alreadyExists: boolean;
  } | null>(null);

  const joinWaitlist = useMutation(api.waitlist.join);
  const waitlistCount = useQuery(api.waitlist.getCount);

  // Pre-fill referral from URL
  useEffect(() => {
    if (referralParam) {
      setReferredBy(referralParam);
    }
  }, [referralParam]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!country) {
      setError("Please select your country.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const res = await joinWaitlist({
        email: email.trim(),
        country,
        referredBy: referredBy.trim() || undefined,
      });
      if (res.success) {
        setResult({
          position: res.position,
          referralCode: res.referralCode,
          referralCount: res.referralCount,
          alreadyExists: res.alreadyExists,
        });
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyReferralLink() {
    if (!result) return;
    const link = `${window.location.origin}${ROUTES.waitlist}?ref=${result.referralCode}`;
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareOnTwitterLogo() {
    if (!result) return;
    const link = `${window.location.origin}${ROUTES.waitlist}?ref=${result.referralCode}`;
    const text = `I just joined the @wealthmotley waitlist! The first AI-powered financial companion built for Africans. Join me: ${link}`;
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }

  function shareViaEmail() {
    if (!result) return;
    const link = `${window.location.origin}${ROUTES.waitlist}?ref=${result.referralCode}`;
    const subject = "Join me on WealthMotley";
    const body = `Hey! I just joined the WealthMotley waitlist - it's the first AI-powered financial companion built for Africans. You should join too: ${link}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
  }

  const displayCount = waitlistCount !== undefined ? waitlistCount : 0;

  return (
    <main className="relative flex min-h-screen flex-col">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[600px] w-[600px] rounded-full bg-secondary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-primary/3 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="relative z-10 border-b border-border/40 bg-background/60 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-6xl items-center px-4 sm:px-6 lg:px-8">
          <Link
            href={ROUTES.home}
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            <span className="hidden sm:inline">Back to home</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-secondary text-white font-heading font-bold text-xs">
              W
            </div>
            <span className="font-heading text-sm font-bold text-foreground">
              {APP_NAME}
            </span>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 flex flex-1 items-center justify-center px-4 py-12 sm:px-6 sm:py-16">
        <div className="w-full max-w-md">
          <AnimatePresence mode="wait">
            {!result ? (
              <motion.div
                key="form"
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20, transition: { duration: 0.3 } }}
                variants={staggerContainer}
              >
                {/* Header */}
                <motion.div variants={fadeInUp} className="text-center">
                  <Badge
                    variant="outline"
                    className="mb-4 gap-1.5 border-secondary/20 bg-secondary/5 px-3 py-1.5 text-secondary"
                  >
                    <Sparkle className="size-3.5" />
                    <span className="text-xs font-medium">Early Access</span>
                  </Badge>
                  <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    Join the Waitlist
                  </h1>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    Be among the first to see all your money in one place.
                    We'll notify you the moment we launch.
                  </p>
                </motion.div>

                {/* Live counter */}
                {displayCount > 0 && (
                  <motion.div
                    variants={fadeInUp}
                    className="mt-6 flex items-center justify-center gap-2"
                  >
                    <div className="flex items-center gap-1.5 rounded-full border border-border/50 bg-card px-3 py-1.5">
                      <Users className="size-3.5 text-secondary" />
                      <span className="text-xs font-medium text-foreground">
                        {displayCount.toLocaleString()} people
                      </span>
                      <span className="text-xs text-muted-foreground">
                        already waiting
                      </span>
                    </div>
                  </motion.div>
                )}

                {/* Form */}
                <motion.form
                  variants={fadeInUp}
                  onSubmit={handleSubmit}
                  className="mt-8 space-y-4"
                >
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Email address
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11"
                      required
                      autoFocus
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1.5 block text-sm font-medium text-foreground"
                    >
                      Country
                    </label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger id="country" className="h-11 w-full">
                        <SelectValue placeholder="Where do you live?" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUPPORTED_COUNTRIES.map((c) => (
                          <SelectItem key={c.code} value={c.code}>
                            {c.flag} {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Referral code (optional, collapsed by default) */}
                  <div>
                    <label
                      htmlFor="referral"
                      className="mb-1.5 block text-sm font-medium text-muted-foreground"
                    >
                      Referral code{" "}
                      <span className="text-xs text-muted-foreground/60">
                        (optional)
                      </span>
                    </label>
                    <Input
                      id="referral"
                      type="text"
                      placeholder="WM-XXXXXX"
                      value={referredBy}
                      onChange={(e) =>
                        setReferredBy(e.target.value.toUpperCase())
                      }
                      className="h-11 font-mono text-sm tracking-wider"
                    />
                  </div>

                  {error && (
                    <p className="text-sm text-destructive">{error}</p>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="h-11 w-full bg-secondary text-white hover:bg-secondary/90"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="inline-block"
                        >
                          <Sparkle className="size-4" />
                        </motion.span>
                        Joining...
                      </span>
                    ) : (
                      <>
                        Join the Waitlist
                        <ArrowRight className="ml-1.5 size-4" />
                      </>
                    )}
                  </Button>
                </motion.form>

                {/* Trust signals */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-6 flex items-center justify-center gap-2 text-xs text-muted-foreground"
                >
                  <Shield className="size-3.5 text-success" />
                  <span>
                    We'll never share your email. Unsubscribe anytime.
                  </span>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="text-center"
              >
                {/* Success state */}
                <motion.div variants={fadeInUp}>
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success/10">
                    <Sparkle className="size-8 text-success" />
                  </div>
                  <h1 className="font-heading text-3xl font-bold text-foreground">
                    {result.alreadyExists
                      ? "Welcome back!"
                      : "You're on the list!"}
                  </h1>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {result.alreadyExists
                      ? "You've already joined. Here's your position."
                      : "We'll email you when it's your turn."}
                  </p>
                </motion.div>

                {/* Queue position */}
                <motion.div
                  variants={fadeInUp}
                  className="mt-8 rounded-xl border border-border/50 bg-card p-6"
                >
                  <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Your Position
                  </p>
                  <p className="mt-2 font-heading text-5xl font-bold text-secondary">
                    #{result.position.toLocaleString()}
                  </p>

                  <Separator className="my-5" />

                  {/* Referral CTA */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-2">
                      <Gift className="size-4 text-accent" />
                      <p className="text-sm font-medium text-foreground">
                        Share to move up the queue
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Each friend who joins with your code moves you up 5 spots.
                    </p>

                    {/* Referral code display */}
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-dashed border-accent/30 bg-accent/5 px-4 py-3">
                      <span className="font-mono text-lg font-bold tracking-widest text-accent">
                        {result.referralCode}
                      </span>
                      <button
                        onClick={copyReferralLink}
                        className="flex h-8 w-8 items-center justify-center rounded-md bg-accent/10 text-accent transition-colors hover:bg-accent/20"
                        aria-label="Copy referral link"
                      >
                        {copied ? (
                          <Check className="size-4" />
                        ) : (
                          <Copy className="size-4" />
                        )}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-xs text-success">
                        Link copied to clipboard!
                      </p>
                    )}

                    {/* Referral count */}
                    {result.referralCount > 0 && (
                      <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                        <CaretUp className="size-3.5 text-success" />
                        <span>
                          {result.referralCount}{" "}
                          {result.referralCount === 1
                            ? "friend"
                            : "friends"}{" "}
                          joined with your code
                        </span>
                      </div>
                    )}

                    {/* Share buttons */}
                    <div className="flex items-center justify-center gap-2 pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareOnTwitterLogo}
                        className="gap-1.5"
                      >
                        <TwitterLogo className="size-3.5" />
                        Share on X
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={shareViaEmail}
                        className="gap-1.5"
                      >
                        <EnvelopeSimple className="size-3.5" />
                        Email a friend
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={copyReferralLink}
                        className="gap-1.5"
                      >
                        <ShareNetwork className="size-3.5" />
                        Copy link
                      </Button>
                    </div>
                  </div>
                </motion.div>

                {/* Back to home */}
                <motion.div variants={fadeInUp} className="mt-6">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={ROUTES.home}>
                      <ArrowLeft className="mr-1.5 size-3.5" />
                      Back to homepage
                    </Link>
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom trust bar */}
      <div className="relative z-10 border-t border-border/40 bg-card/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 py-4 text-xs text-muted-foreground sm:px-6">
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-success" />
            <span>Bank-level encryption</span>
          </div>
          <Separator orientation="vertical" className="hidden h-3 sm:block" />
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-success" />
            <span>NDPA compliant</span>
          </div>
          <Separator orientation="vertical" className="hidden h-3 sm:block" />
          <div className="flex items-center gap-1.5">
            <Shield className="size-3.5 text-success" />
            <span>GDPR compliant</span>
          </div>
        </div>
      </div>
    </main>
  );
}
