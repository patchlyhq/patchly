import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Docs — Patchly',
  description: 'How to set up Patchly, connect integrations, and publish your first changelog.',
};

function Code({ children }: { children: string }) {
  return (
    <code className="rounded bg-black/5 px-1.5 py-0.5 font-mono text-[0.8em] text-black/70">
      {children}
    </code>
  );
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-black/6 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-1.5 text-xs text-black/35 hover:text-black/60 transition-colors w-fit">
          <ArrowLeft size={12} />
          Patchly
        </Link>
      </nav>

      <main className="mx-auto max-w-2xl px-5 py-16 sm:px-8 sm:py-24">
        <p className="mb-3 font-mono text-xs text-black/30 uppercase tracking-widest">Documentation</p>
        <h1 className="mb-2 text-3xl font-black tracking-tight text-black sm:text-4xl">How Patchly works</h1>
        <p className="mb-14 text-sm text-black/35">Everything you need to ship and share a changelog.</p>

        <div className="space-y-14 text-sm leading-relaxed text-black/65">

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">Quick start</h2>
            <ol className="space-y-4 pl-0">
              <li className="flex gap-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/10 font-mono text-[10px] text-black/35">1</span>
                <div>
                  <p className="font-medium text-black/75">Create an account</p>
                  <p className="mt-0.5">Sign in with Google or your email at <Link href="/" className="text-black/75 underline underline-offset-2 hover:text-black transition-colors">patchly.dawit.dev</Link>. No credit card required.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/10 font-mono text-[10px] text-black/35">2</span>
                <div>
                  <p className="font-medium text-black/75">Create a project</p>
                  <p className="mt-0.5">From the dashboard, click <strong className="text-black/75">New project</strong>. Give it a name and a slug — the slug becomes your public URL: <Code>patchly.dawit.dev/your-slug</Code>.</p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-black/10 font-mono text-[10px] text-black/35">3</span>
                <div>
                  <p className="font-medium text-black/75">Publish your first entry</p>
                  <p className="mt-0.5">Open the project, click <strong className="text-black/75">New entry</strong>, write in Markdown, then hit <strong className="text-black/75">Publish</strong>. It appears on your public changelog immediately and notifies subscribers.</p>
                </div>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">GitHub integration</h2>
            <p className="mb-4">Connect a GitHub repo to pull releases directly into Patchly. Each GitHub release becomes a draft entry you can edit before publishing.</p>
            <ol className="space-y-3 pl-0">
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p><strong className="text-black/75">Connect:</strong> Go to <strong className="text-black/75">Integrations → GitHub</strong> and click <strong className="text-black/75">Connect repo</strong>. Authorize Patchly to read releases from your chosen repository.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p><strong className="text-black/75">Backfill:</strong> After connecting, click <strong className="text-black/75">Sync releases</strong> to import existing GitHub releases as draft entries.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p><strong className="text-black/75">Webhook:</strong> Patchly registers a webhook on your repo automatically. New releases trigger a draft entry without any manual action.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p><strong className="text-black/75">Manual sync:</strong> Use the <strong className="text-black/75">Sync</strong> button on the integration card any time to pull the latest releases.</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">Embeddable widget</h2>
            <p className="mb-3">The embeddable widget lets your users see the latest changelog entries without leaving your product — a floating card, one script tag, zero dependencies.</p>
            <div className="rounded-lg border border-black/8 bg-black/[0.02] px-4 py-3.5">
              <p className="font-mono text-xs text-black/40">Coming soon — available when Pro launches</p>
              <p className="mt-1.5 text-xs text-black/45">The widget snippet and configuration docs will appear here once the Pro plan is live. If you want early access, email <a href="mailto:info@clientreach.ai" className="text-black/65 underline underline-offset-2 hover:text-black transition-colors">info@clientreach.ai</a>.</p>
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">Zapier</h2>
            <p className="mb-3">Trigger any Zapier workflow when you publish a changelog entry.</p>
            <ol className="space-y-3 pl-0">
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>In Zapier, create a new Zap with the <strong className="text-black/75">Webhooks by Zapier</strong> trigger, set it to <strong className="text-black/75">Catch Hook</strong>, and copy the generated URL.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>In Patchly, open your project → <strong className="text-black/75">Integrations → Zapier</strong> and paste the URL. Click <strong className="text-black/75">Save</strong>.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>Every time you publish an entry, Patchly sends a POST to that URL with <Code>title</Code>, <Code>version</Code>, <Code>tag</Code>, and <Code>url</Code> fields you can use in downstream Zap actions.</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">Slack and Discord</h2>
            <p className="mb-3">Post a message to a Slack channel or Discord server automatically when you publish an entry.</p>
            <ol className="space-y-3 pl-0">
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>Go to <strong className="text-black/75">Integrations → Slack</strong> (or Discord) and click <strong className="text-black/75">Connect</strong>. Complete the OAuth flow to authorize Patchly.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>Choose the channel or server you want notifications posted to.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>The next time you publish an entry, Patchly posts the title, version, tag, and a link to the public changelog. No further setup required.</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">Sentry</h2>
            <p className="mb-3">Import Sentry releases as draft changelog entries, so your changelog stays in sync with your deploy pipeline.</p>
            <ol className="space-y-3 pl-0">
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>Go to <strong className="text-black/75">Integrations → Sentry</strong> and click <strong className="text-black/75">Connect</strong>. Complete the OAuth flow.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>Once connected, click <strong className="text-black/75">Configure</strong> and enter your Sentry <strong className="text-black/75">organization slug</strong> and <strong className="text-black/75">project slug</strong> — both visible in the Sentry dashboard URL: <Code>sentry.io/organizations/[org]/projects/[project]/</Code>.</p>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 text-black/25">—</span>
                <p>Click <strong className="text-black/75">Sync releases</strong> to pull the latest Sentry releases as draft entries. Edit and publish them from the Patchly dashboard.</p>
              </li>
            </ol>
          </section>

          <section>
            <h2 className="mb-4 text-base font-semibold text-black/85">Public changelog URL</h2>
            <p className="mb-3">Every project has a public changelog page at:</p>
            <div className="rounded-lg border border-black/8 bg-black/[0.02] px-4 py-3">
              <code className="font-mono text-sm text-black/60">patchly.dawit.dev/<span className="text-black/85">your-slug</span></code>
            </div>
            <p className="mt-3">The slug is set when you create a project and can be changed from <strong className="text-black/75">Project settings</strong>. Only published entries appear on the public page. Visitors can subscribe to receive email notifications for new entries.</p>
          </section>

        </div>
      </main>

      <footer className="border-t border-black/6 px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-2xl items-center justify-between gap-4 flex-wrap">
          <span className="text-xs text-black/25">Patchly &copy; 2026</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-black/35 hover:text-black/60 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-xs text-black/35 hover:text-black/60 transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
