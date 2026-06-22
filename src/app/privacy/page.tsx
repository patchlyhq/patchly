import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Policy — Patchly',
  description: 'How Patchly collects, uses, and protects your data.',
};

const LAST_UPDATED = 'June 22, 2026';
const EMAIL = 'info@clientreach.ai';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-black/6 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-black/35 hover:text-black/60 transition-colors w-fit">
          <ArrowLeft size={12} />
          Patchly
        </Link>
      </nav>

      <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-3 font-mono text-xs text-black/30 uppercase tracking-widest">Legal</p>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-black sm:text-4xl">Privacy Policy</h1>
        <p className="mb-14 text-sm text-black/35">Last updated {LAST_UPDATED}</p>

        <div className="space-y-10 text-sm leading-relaxed text-black/65">
          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">1. Information we collect</h2>
            <p className="mb-3">When you use Patchly, we collect:</p>
            <ul className="space-y-2 pl-4">
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Account information</strong> — your name and email address when you sign up via email or Google OAuth.</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Usage data</strong> — pages visited, features used, and timestamps, to understand how the product is used.</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Changelog content</strong> — entries, projects, and subscriber emails you create or import.</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Integration tokens</strong> — OAuth access tokens from GitHub, Sentry, Slack, and Discord when you connect those services. Stored encrypted at rest.</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Log data</strong> — IP address, browser type, and request logs retained for up to 30 days.</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">2. How we use your information</h2>
            <p className="mb-3">We use the information we collect to:</p>
            <ul className="space-y-2 pl-4">
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Provide, maintain, and improve Patchly</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Send transactional emails (magic links, subscriber notifications)</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Communicate product updates and changes</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Detect and prevent abuse</li>
            </ul>
            <p className="mt-3">We do not sell your data or use it for advertising.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">3. Data sharing</h2>
            <p className="mb-3">We share data only with the third-party services required to operate Patchly:</p>
            <ul className="space-y-2 pl-4">
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Neon</strong> — database hosting (your data is stored here)</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Vercel</strong> — application hosting and edge functions</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25"><strong className="text-black/75">Resend</strong> — transactional email delivery</li>
            </ul>
            <p className="mt-3">We do not share your data with any other third parties without your explicit consent.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">4. Data retention</h2>
            <p>Your account data is retained for as long as your account is active. You can delete your account at any time from your profile settings, which will permanently delete all associated projects, entries, and subscriber data within 30 days.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">5. Cookies</h2>
            <p>Patchly uses a single session cookie to keep you signed in. We do not use tracking cookies or third-party analytics cookies.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">6. Your rights</h2>
            <p className="mb-3">You have the right to:</p>
            <ul className="space-y-2 pl-4">
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Access the personal data we hold about you</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Correct inaccurate data</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Request deletion of your data</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Export your changelog data</li>
            </ul>
            <p className="mt-3">To exercise any of these rights, email <a href={`mailto:${EMAIL}`} className="text-black/75 underline underline-offset-2 hover:text-black transition-colors">{EMAIL}</a>.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">7. Security</h2>
            <p>We use industry-standard practices to protect your data: HTTPS everywhere, encrypted tokens at rest, and access controls. No security measure is perfect — if you discover a vulnerability, please disclose it responsibly to <a href={`mailto:${EMAIL}`} className="text-black/75 underline underline-offset-2 hover:text-black transition-colors">{EMAIL}</a>.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">8. Changes to this policy</h2>
            <p>We may update this policy from time to time. We will notify you of material changes by email or by a notice in the dashboard. Continued use of Patchly after changes take effect constitutes acceptance of the updated policy.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">9. Contact</h2>
            <p>Questions about this policy? Email <a href={`mailto:${EMAIL}`} className="text-black/75 underline underline-offset-2 hover:text-black transition-colors">{EMAIL}</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-black/6 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-black/25">Patchly &copy; 2026</span>
          <Link href="/terms" className="text-xs text-black/35 hover:text-black/60 transition-colors">Terms of Service</Link>
        </div>
      </footer>
    </div>
  );
}
