import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: `Terms of Service — ${APP_NAME}`,
};

export default function TermsOfServicePage() {
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
            Terms of <span style={{ color: "#ffb347" }}>Service</span>
          </h1>
          <p className="text-[#968a84]">Last updated: 22 March 2026</p>
        </header>

        {/* Financial Disclaimer — most important, comes first */}
        <section
          className="space-y-3 rounded-xl p-6"
          style={{
            background: "rgba(255,179,71,0.06)",
            border: "1px solid rgba(255,179,71,0.2)",
          }}
        >
          <h2 className="text-lg font-bold text-[#ffb347]">
            Financial Education Disclaimer
          </h2>
          <p>
            {APP_NAME} is a <strong>financial education platform</strong>. We
            do not provide regulated financial advice. We are not authorised by
            the Financial Conduct Authority (FCA), the Nigerian Securities and
            Exchange Commission (SEC), the Central Bank of Nigeria (CBN), or any
            other financial regulatory body in any jurisdiction.
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              All content, tools, projections, and AI-generated insights are
              for <strong>educational and informational purposes only</strong>.
            </li>
            <li>
              Nothing on this platform constitutes a personal recommendation or
              investment advice.
            </li>
            <li>
              Projected returns and hypothetical scenarios are{" "}
              <strong>illustrations, not predictions</strong>. The value of
              investments can go down as well as up. You may get back less than
              you invest.
            </li>
            <li>
              Past performance is not a reliable indicator of future results.
            </li>
            <li>
              Any actions you take based on our educational content are at your
              own risk and responsibility.
            </li>
            <li>
              For advice specific to your circumstances, consult a qualified
              financial adviser.
            </li>
          </ul>
        </section>

        <Section title="1. About the Service">
          <p>
            {APP_NAME} provides financial education tools including budget
            tracking, portfolio overview, AI-powered educational chat (Mo), and
            projection calculators. Our AI companion Mo provides general
            financial education and guidance only &mdash; Mo&apos;s responses
            should not be interpreted as personalised financial advice.
          </p>
        </Section>

        <Section title="2. AI-Generated Content">
          <p>
            Our platform uses artificial intelligence (OpenAI) to extract data
            from screenshots and to power Mo, our educational chatbot. You
            acknowledge that:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              AI can and does make errors. Always verify AI-extracted financial
              data against your actual accounts.
            </li>
            <li>
              AI-generated educational content may occasionally be inaccurate or
              incomplete.
            </li>
            <li>
              We disclaim liability for decisions made based on AI-generated
              content.
            </li>
          </ul>
        </Section>

        <Section title="3. Exchange Rate Display">
          <p>
            Currency conversion rates displayed on {APP_NAME} are sourced from
            third-party data providers and are{" "}
            <strong>indicative only</strong>. They do not represent guaranteed
            conversion rates. Actual conversion rates will differ due to market
            fluctuations, fees, and spreads. {APP_NAME} does not offer currency
            exchange services.
          </p>
        </Section>

        <Section title="4. User Accounts">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              You must be at least 18 years old to create an account.
            </li>
            <li>
              You are responsible for maintaining the security of your account
              credentials.
            </li>
            <li>
              You must not share your account or use another person&apos;s
              account.
            </li>
          </ul>
        </Section>

        <Section title="5. Subscriptions & Payments">
          <p>
            Free and paid subscription tiers are available. For paid
            subscriptions:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>UK users:</strong> Under the Consumer Contracts
              Regulations 2013, you have a 14-day cooling-off period from the
              date of purchase. For digital content, by accessing the service
              during this period you consent to begin delivery and acknowledge
              that you will lose your right of withdrawal.
            </li>
            <li>
              <strong>Nigerian users:</strong> Under the FCCPA 2018 (Section
              120), you have a right to cancel advance bookings subject to
              reasonable cancellation charges. We offer a 7-day refund window
              for new subscriptions.
            </li>
            <li>
              You may cancel your subscription at any time. Access continues
              until the end of the current billing period.
            </li>
          </ul>
        </Section>

        <Section title="6. Acceptable Use">
          <p>You agree not to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Use the platform for money laundering, fraud, or any illegal
              activity.
            </li>
            <li>
              Attempt to extract, scrape, or reverse-engineer our AI models or
              proprietary content.
            </li>
            <li>
              Upload malicious files, malware, or content that violates the
              rights of others.
            </li>
            <li>
              Attempt to access other users&apos; data or accounts.
            </li>
          </ul>
        </Section>

        <Section title="7. Intellectual Property">
          <p>
            All content, design, code, and branding on {APP_NAME} are owned by
            WealthMotley Ltd. You may not reproduce, distribute, or create
            derivative works without our written permission.
          </p>
        </Section>

        <Section title="8. Limitation of Liability">
          <p>
            To the maximum extent permitted by law, {APP_NAME} shall not be
            liable for any indirect, incidental, or consequential damages
            arising from your use of the platform, including but not limited to
            financial losses from decisions made based on our educational
            content.
          </p>
          <p className="mt-2">
            Under the UK Consumer Rights Act 2015, our digital content must be
            of satisfactory quality, fit for purpose, and as described. These
            statutory rights cannot be excluded.
          </p>
        </Section>

        <Section title="9. Governing Law">
          <p>
            For users in Nigeria, these terms are governed by the laws of the
            Federal Republic of Nigeria. For users in the United Kingdom, these
            terms are governed by the laws of England and Wales. Nothing in
            these terms affects your statutory rights as a consumer.
          </p>
        </Section>

        <Section title="10. Changes to These Terms">
          <p>
            We may update these terms from time to time. Material changes will
            be communicated via email or in-app notification at least 30 days
            before they take effect.
          </p>
        </Section>

        <footer className="border-t border-white/10 pt-6">
          <p className="text-[#968a84]">
            Questions? Contact{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#ffb347] underline">
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
