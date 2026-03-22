import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: `How We Make Money — ${APP_NAME}`,
};

export default function HowWeMakeMoneyPage() {
  return (
    <div
      className="min-h-screen px-6 py-16 md:px-12 lg:px-24"
      style={{ backgroundColor: "#0d0b0a", color: "#e5e5e5" }}
    >
      <article className="mx-auto max-w-3xl space-y-10 text-sm leading-relaxed">
        <header className="space-y-3 border-b border-white/10 pb-8">
          <h1
            className="text-4xl text-white"
            style={{ fontFamily: "DynaPuff, cursive" }}
          >
            How {APP_NAME}{" "}
            <span style={{ color: "#ffb347" }}>Makes Money</span>
          </h1>
          <p className="text-base text-[#e5e5e5]">
            We believe in full transparency about how we fund this platform.
          </p>
        </header>

        {/* Free Tier */}
        <Section title="Free Tier">
          <p>
            Our free tier is genuinely free &mdash; no hidden catches. We offer
            it because financial education should be accessible to everyone,
            regardless of income.
          </p>
        </Section>

        {/* Premium Subscriptions */}
        <Section title="Premium Subscriptions">
          <p>
            Our primary revenue comes from Pro and Premium subscription plans.
            These unlock advanced features like unlimited AI conversations with
            Mo, detailed portfolio analytics, and priority support.
          </p>
        </Section>

        {/* Affiliate Partnerships */}
        <section
          className="space-y-3 rounded-xl p-6"
          style={{
            background: "rgba(255,179,71,0.06)",
            border: "1px solid rgba(255,179,71,0.2)",
          }}
        >
          <h2 className="text-lg font-bold text-[#ffb347]">
            Affiliate Partnerships (Future)
          </h2>
          <p>
            In the future, we may earn referral fees when we recommend
            third-party financial products (like savings accounts or investment
            platforms). When we do:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Every affiliate recommendation will be clearly labelled with a
              disclosure tag.
            </li>
            <li>
              Our editorial content is never influenced by commercial
              relationships.
            </li>
            <li>
              We will never recommend a product we wouldn&apos;t use ourselves.
            </li>
            <li>
              Affiliate partnerships will never affect the order or ranking of
              recommendations.
            </li>
          </ul>
        </section>

        {/* What We Will Never Do */}
        <section
          className="space-y-3 rounded-xl p-6"
          style={{
            background: "rgba(239,68,68,0.06)",
            border: "1px solid rgba(239,68,68,0.15)",
          }}
        >
          <h2 className="text-lg font-bold text-white">
            What We Will Never Do
          </h2>
          <ul className="list-disc space-y-2 pl-6">
            <li>Sell your personal or financial data.</li>
            <li>Show you targeted advertising.</li>
            <li>Share your information with data brokers.</li>
            <li>Charge hidden fees.</li>
          </ul>
        </section>

        {/* Our Commitment */}
        <Section title="Our Commitment">
          <p>
            If our business model ever changes, we&apos;ll update this page and
            notify you directly.
          </p>
        </Section>

        <footer className="border-t border-white/10 pt-6">
          <p className="text-[#968a84]">
            Questions about how we make money? Contact{" "}
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="text-[#ffb347] underline"
            >
              {SUPPORT_EMAIL}
            </a>
          </p>
        </footer>
      </article>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h2 className="text-lg font-bold text-white">{title}</h2>
      {children}
    </section>
  );
}
