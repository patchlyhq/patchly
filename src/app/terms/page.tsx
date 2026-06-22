import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Terms of Service — Patchly',
  description: 'Terms governing your use of Patchly.',
};

const LAST_UPDATED = 'June 22, 2026';
const EMAIL = 'info@clientreach.ai';

export default function TermsPage() {
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
        <h1 className="mb-2 text-3xl font-black tracking-tight text-black sm:text-4xl">Terms of Service</h1>
        <p className="mb-14 text-sm text-black/35">Last updated {LAST_UPDATED}</p>

        <div className="space-y-10 text-sm leading-relaxed text-black/65">
          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">1. Acceptance</h2>
            <p>By creating an account or using Patchly (&quot;the Service&quot;), you agree to these Terms of Service. If you do not agree, do not use the Service.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">2. The Service</h2>
            <p>Patchly is a changelog infrastructure tool that lets you create, manage, and publish product changelogs. Features include public changelog pages, embeddable widgets, subscriber management, and integrations with third-party developer tools.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">3. Accounts</h2>
            <p className="mb-3">You must provide accurate information when creating an account. You are responsible for:</p>
            <ul className="space-y-2 pl-4">
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Maintaining the security of your account credentials</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">All activity that occurs under your account</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Notifying us immediately of any unauthorized access</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">4. Acceptable use</h2>
            <p className="mb-3">You agree not to use Patchly to:</p>
            <ul className="space-y-2 pl-4">
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Publish unlawful, harmful, or abusive content</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Spam subscribers or send unsolicited communications</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Circumvent rate limits or abuse the API</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Impersonate other individuals or organizations</li>
              <li className="before:content-['—'] before:mr-2 before:text-black/25">Violate any applicable law or regulation</li>
            </ul>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">5. Your content</h2>
            <p>You retain ownership of the changelog entries and other content you create on Patchly. By using the Service, you grant us a limited license to store, display, and distribute your content solely to operate the Service (e.g. rendering your public changelog page).</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">6. Third-party integrations</h2>
            <p>Patchly integrates with third-party services (GitHub, Sentry, Slack, Discord, Zapier). Your use of those services is governed by their respective terms. We are not responsible for the availability or behavior of third-party services.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">7. Availability</h2>
            <p>We aim for high availability but do not guarantee uninterrupted access to the Service. We may perform maintenance, update infrastructure, or temporarily restrict access when necessary. We are not liable for downtime or data loss caused by events outside our reasonable control.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">8. Termination</h2>
            <p>You may close your account at any time from your profile settings. We may suspend or terminate accounts that violate these terms. Upon termination, your public changelog pages will be taken offline and your data will be deleted within 30 days.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">9. Disclaimers</h2>
            <p>The Service is provided &quot;as is&quot; without warranties of any kind, express or implied. We disclaim all warranties including merchantability, fitness for a particular purpose, and non-infringement to the extent permitted by law.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">10. Limitation of liability</h2>
            <p>To the maximum extent permitted by law, Patchly shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service, even if we have been advised of the possibility of such damages.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">11. Changes to these terms</h2>
            <p>We may update these terms from time to time. We will notify you of material changes by email. Continued use of the Service after changes take effect constitutes acceptance.</p>
          </section>

          <section>
            <h2 className="mb-3 text-base font-semibold text-black/85">12. Contact</h2>
            <p>Questions about these terms? Email <a href={`mailto:${EMAIL}`} className="text-black/75 underline underline-offset-2 hover:text-black transition-colors">{EMAIL}</a>.</p>
          </section>
        </div>
      </main>

      <footer className="border-t border-black/6 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-black/25">Patchly &copy; 2026</span>
          <Link href="/privacy" className="text-xs text-black/35 hover:text-black/60 transition-colors">Privacy Policy</Link>
        </div>
      </footer>
    </div>
  );
}
