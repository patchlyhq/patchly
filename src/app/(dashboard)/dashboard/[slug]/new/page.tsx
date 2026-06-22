'use client';
import { ArrowLeft, Eye, X } from 'lucide-react';
import Link from 'next/link';
import { use, useState } from 'react';
import { toast } from 'sonner';

const SUGGESTED_TAGS = [
  'New',
  'Fix',
  'Performance',
  'UX',
  'Editor',
  'Security',
  'Breaking',
];

function renderPreview(text: string) {
  return text.split('\n').map((line, i) => {
    if (line.startsWith('# '))
      return (
        <h1 key={i} className="mb-3 mt-6 text-lg font-black text-black">
          {line.slice(2)}
        </h1>
      );
    if (line.startsWith('## '))
      return (
        <h2 key={i} className="mb-2 mt-5 text-base font-bold text-black/85">
          {line.slice(3)}
        </h2>
      );
    if (line.startsWith('### '))
      return (
        <h3 key={i} className="mb-1 mt-4 text-sm font-semibold text-black/80">
          {line.slice(4)}
        </h3>
      );
    if (line.startsWith('- ') || line.startsWith('* '))
      return (
        <li
          key={i}
          className="ml-4 list-disc text-sm leading-relaxed text-black/70"
        >
          {line.slice(2)}
        </li>
      );
    if (line.trim() === '') return <div key={i} className="h-3" />;
    return (
      <p key={i} className="text-sm leading-relaxed text-black/70">
        {line.split(/(`[^`]+`)/g).map((part, j) =>
          part.startsWith('`') && part.endsWith('`') ? (
            <code
              key={j}
              className="rounded bg-black/6 px-1 py-0.5 font-mono text-[0.8em] text-black/65"
            >
              {part.slice(1, -1)}
            </code>
          ) : (
            part
          )
        )}
      </p>
    );
  });
}

export default function NewEntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [title, setTitle] = useState('');
  const [version, setVersion] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [preview, setPreview] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const toggleTag = (tag: string) =>
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );

  const handlePublish = () => {
    if (!title) {
      toast.error('Add a title before publishing.');
      return;
    }
    if (!version) {
      toast.error('Add a version number before publishing.');
      return;
    }
    toast.success('Entry published!', { description: `${version} — ${title}` });
  };

  const handleDraft = () => {
    toast('Draft saved', { description: title || 'Untitled entry' });
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link
            href={`/dashboard/${slug}`}
            className="text-sm text-black/35 hover:text-black/60 transition-colors flex items-center gap-1"
          >
            <ArrowLeft size={13} />
            {slug}
          </Link>
          <span className="text-black/20">/</span>
          <span className="text-sm text-black/55">New entry</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPreview((p) => !p)}
            className="flex items-center gap-1.5 rounded-lg border border-black/12 px-3 py-1.5 text-sm text-black/50 hover:bg-black/4 transition-colors"
          >
            <Eye size={13} />
            {preview ? 'Edit' : 'Preview'}
          </button>
          <button
            type="button"
            onClick={handleDraft}
            className="rounded-lg border border-black/12 px-4 py-1.5 text-sm text-black/50 hover:bg-black/4 transition-colors"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={handlePublish}
            className="rounded-lg bg-black px-4 py-1.5 text-sm font-semibold text-white hover:bg-black/85 transition-all"
          >
            Publish
          </button>
        </div>
      </div>

      <div className="space-y-5">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Entry title"
          className="w-full rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-5 py-3.5 text-lg font-semibold text-[var(--color-text)] placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition"
        />

        <div className="flex gap-3">
          <input
            type="text"
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="Version (e.g. v2.5.0)"
            className="flex-1 rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-4 py-2.5 font-mono text-sm text-[var(--color-text)] placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition"
          />
          <input
            type="date"
            defaultValue={today}
            className="rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-4 py-2.5 text-sm text-black/55 outline-none focus:border-black/25 focus:bg-white transition"
          />
        </div>

        <div>
          <p className="mb-2 text-xs text-black/35">Tags</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleTag(tag)}
                className={`flex items-center gap-1 rounded-full border px-3 py-1 text-xs transition-colors ${
                  tags.includes(tag)
                    ? 'border-black/30 bg-black text-white'
                    : 'border-black/12 text-black/45 hover:border-black/25 hover:text-black/65'
                }`}
              >
                {tag}
                {tags.includes(tag) && <X size={10} />}
              </button>
            ))}
          </div>
        </div>

        {preview ? (
          <div className="min-h-[320px] rounded-xl border border-black/10 bg-[oklch(98%_0_0)] p-6">
            {content ? (
              <div className="space-y-0.5">{renderPreview(content)}</div>
            ) : (
              <p className="text-sm text-black/25 italic">
                Nothing to preview yet.
              </p>
            )}
          </div>
        ) : (
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={`Write your release notes in Markdown...\n\n## What's new\n- Feature one\n- Feature two\n\n## Bug fixes\n- Fixed the thing`}
              rows={16}
              className="w-full resize-none rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-5 py-4 font-mono text-sm text-[var(--color-text)] placeholder:text-black/20 outline-none focus:border-black/25 focus:bg-white transition leading-relaxed"
            />
            <span className="absolute bottom-3 right-4 text-xs text-black/20">
              Markdown
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
