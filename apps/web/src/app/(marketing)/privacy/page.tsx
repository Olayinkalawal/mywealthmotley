import { APP_NAME, SUPPORT_EMAIL } from "@/lib/constants";

export const metadata = {
  title: `Privacy Policy — ${APP_NAME}`,
};

export default function PrivacyPolicyPage() {
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
            Privacy <span style={{ color: "#ffb347" }}>Policy</span>
          </h1>
          <p className="text-[#968a84]">Last updated: 22 March 2026</p>
          <p className="text-[#968a84]">
            This policy applies to users in Nigeria (governed by the Nigeria
            Data Protection Act 2023, NDPA) and the United Kingdom (governed by
            the UK General Data Protection Regulation, UK GDPR). Where the two
            frameworks differ, we apply the stricter standard.
          </p>
        </header>

        <Section title="1. Who We Are">
          <p>
            {APP_NAME} is operated by WealthMotley Ltd. We are a financial
            education platform &mdash; we are <strong>not</strong> authorised by
            the FCA, the Nigerian SEC, or any other financial regulatory body.
            For questions about this policy, contact us at{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#ffb347] underline">
              {SUPPORT_EMAIL}
            </a>.
          </p>
        </Section>

        <Section title="2. Data We Collect">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Account data:</strong> Name, email address, country of
              residence, and preferred currency (provided during sign-up via
              Clerk).
            </li>
            <li>
              <strong>Bank transaction data:</strong> Transaction amounts, dates,
              categories, and institution names obtained via Mono API with your
              explicit consent. We do not store full account numbers or BVNs.
            </li>
            <li>
              <strong>Screenshot uploads:</strong> Images you upload for AI
              portfolio extraction. Original images are{" "}
              <strong>automatically deleted from our servers immediately
              after data extraction</strong>. Only extracted text data (asset
              names, values, quantities) is retained.
            </li>
            <li>
              <strong>AI chat messages:</strong> Conversations with Mo (our AI
              companion) are stored to provide continuity. These are never shared
              with third parties.
            </li>
            <li>
              <strong>Usage analytics:</strong> Anonymous interaction data to
              improve the platform (only with your consent).
            </li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Data">
          <ul className="list-disc space-y-2 pl-6">
            <li>To display your financial overview and budget tracking.</li>
            <li>
              To provide AI-powered educational insights (via OpenAI). Your
              financial data is sent in aggregated, summarised form &mdash;
              never raw transaction details with merchant names.
            </li>
            <li>To maintain and improve the platform.</li>
            <li>To send product updates (only with your marketing consent).</li>
          </ul>
          <p className="mt-3">
            We do <strong>not</strong> sell your data, use it for targeted
            advertising, or share it with data brokers.
          </p>
        </Section>

        <Section title="4. Data Processors & Cross-Border Transfers">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Clerk</strong> (authentication) &mdash; SOC 2 Type II
              certified, US-based.
            </li>
            <li>
              <strong>Convex</strong> (database) &mdash; SOC 2 Type II
              certified, hosted on AWS with AES-256 encryption at rest.
            </li>
            <li>
              <strong>OpenAI</strong> (AI processing) &mdash; Zero data
              retention configured. Data Processing Agreement in place.
            </li>
            <li>
              <strong>Mono</strong> (bank connections, Nigeria only) &mdash; ISO
              27001:2022 certified, acts as Data Processor.
            </li>
          </ul>
          <p className="mt-3">
            Where data is transferred outside Nigeria or the UK, we ensure
            adequate safeguards through contractual clauses and the UK
            International Data Transfer Agreement (IDTA) where applicable.
          </p>
        </Section>

        <Section title="5. Your Rights">
          <p>Under both the NDPA and UK GDPR, you have the right to:</p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Access</strong> your personal data (data export available
              in Settings).
            </li>
            <li>
              <strong>Rectify</strong> inaccurate data.
            </li>
            <li>
              <strong>Erase</strong> your data (account deletion available in
              Settings &mdash; completed within 30 days).
            </li>
            <li>
              <strong>Withdraw consent</strong> at any time via Settings &gt;
              Data &amp; Privacy.
            </li>
            <li>
              <strong>Lodge a complaint</strong> with the Nigeria Data Protection
              Commission (NDPC) or the UK Information Commissioner&apos;s Office
              (ICO).
            </li>
          </ul>
        </Section>

        <Section title="6. Data Retention">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Screenshot images: Deleted immediately after AI extraction.
            </li>
            <li>
              Transaction data: Retained while your account is active;
              anonymised 12 months after last activity.
            </li>
            <li>
              Account data: Deleted within 30 days of account deletion request.
            </li>
            <li>
              AI chat history: Retained while your account is active; deleted
              with account.
            </li>
          </ul>
        </Section>

        <Section title="7. Security">
          <p>
            We implement encryption in transit (TLS) and at rest (AES-256),
            enforce multi-factor authentication, and conduct regular security
            reviews. In the event of a data breach, we will notify affected
            users and the relevant authorities (NDPC and/or ICO) within 72 hours
            as required by law.
          </p>
        </Section>

        <Section title="8. Cookies">
          <p>
            We use essential cookies for authentication and session management
            only. Analytics cookies are used only with your explicit consent.
            We do not use advertising or tracking cookies.
          </p>
        </Section>

        <Section title="9. Changes to This Policy">
          <p>
            We may update this policy from time to time. Material changes will
            be communicated via email or in-app notification. Continued use of
            the platform after changes constitutes acceptance.
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
