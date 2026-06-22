export const revalidate = 3600;

import { Marked, Renderer } from 'marked';
import type { Metadata } from 'next';
import { getSingletonHighlighter } from 'shiki';
import { ChangelogClient } from './changelog-client';

const PROJECTS: Record<string, { name: string; description: string }> = {
  patchly: {
    name: 'Patchly',
    description: 'Building in public. Every release, documented.',
  },
  'acme-app': {
    name: 'Acme App',
    description: 'The best app for acme things.',
  },
  'dev-tools': { name: 'Dev Tools', description: 'Tools for developers.' },
};

const ENTRIES = [
  {
    id: '1',
    version: 'v2.4.0',
    date: 'Jun 18, 2026',
    title: 'Faster search and new keyboard shortcuts',
    content:
      'We overhauled the search index — results now appear in under 50ms. Added `⌘K` to open global search and `⌘/` to open the shortcuts panel.',
    tags: ['Performance', 'UX'],
  },
  {
    id: '2',
    version: 'v2.3.0',
    date: 'Jun 5, 2026',
    title: 'Markdown support in release notes',
    content: `You can now write release notes in full Markdown — headings, **code blocks**, bold, links, everything.

Embed the changelog widget with one line:

\`\`\`ts
import Patchly from 'patchly'

Patchly.init({ project: 'my-app', theme: 'light' })
\`\`\`

Or drop in the script tag directly:

\`\`\`html
<script src="https://patchly.io/widget.js" data-project="my-app"></script>
\`\`\``,
    tags: ['Editor', 'New'],
  },
  {
    id: '3',
    version: 'v2.2.1',
    date: 'May 28, 2026',
    title: 'Bug fixes and stability improvements',
    content:
      'Fixed a race condition in the widget loader that caused duplicate entries on slow connections. Improved error messages across the dashboard.',
    tags: ['Fix'],
  },
  {
    id: '4',
    version: 'v2.2.0',
    date: 'May 12, 2026',
    title: 'Embeddable widget is live',
    content:
      'Add one `<script>` tag to your site and your users see your latest changelog entries in a floating card. Fully themeable, zero dependencies.',
    tags: ['New'],
  },
];

async function renderContent(content: string): Promise<string> {
  const highlighter = await getSingletonHighlighter({
    themes: ['github-dark'],
    langs: ['typescript', 'javascript', 'bash', 'json'],
  });

  const renderer = new Renderer();
  renderer.code = ({ text, lang }) => {
    const loadedLangs = highlighter.getLoadedLanguages();
    if (lang && loadedLangs.includes(lang)) {
      return highlighter.codeToHtml(text, { lang, theme: 'github-dark' });
    }
    return `<pre><code>${text.replace(/</g, '&lt;')}</code></pre>`;
  };

  const m = new Marked({ renderer, gfm: true, breaks: true });
  return m.parse(content) as string;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS[slug];
  const name = project?.name ?? slug;
  return {
    title: `${name} — Changelog`,
    description: project?.description ?? `Changelog for ${name}`,
  };
}

export default async function PublicChangelogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const projectData = PROJECTS[slug] ?? { name: slug, description: '' };
  const project = { ...projectData, slug };

  const entries = await Promise.all(
    ENTRIES.map(async (e) => ({
      ...e,
      contentHtml: await renderContent(e.content),
    }))
  );

  return <ChangelogClient project={project} entries={entries} />;
}
