'use client';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import NumberFlow from '@number-flow/react';
import * as Dialog from '@radix-ui/react-dialog';
import { Check, Copy, Edit2, Globe, Loader2, Plus, Trash2, X } from 'lucide-react';
import { AnimatePresence, motion, useInView } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { toast } from 'sonner';
import type { Entry } from '@/db/schema';
import type { Project } from '@/db/schema';

const SUGGESTED_TAGS = ['New', 'Fix', 'Performance', 'UX', 'Editor', 'Security', 'Breaking'];

interface UiEntry {
  id: string;
  version: string;
  title: string;
  tags: string[];
  date: string;
  status: 'published' | 'draft';
  content: string;
}

function dbToUi(e: Entry): UiEntry {
  const d = new Date(e.createdAt);
  return {
    id: e.id,
    version: e.version ?? '',
    title: e.title,
    tags: e.tag ? e.tag.split(',').filter(Boolean) : [],
    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    status: e.published ? 'published' : 'draft',
    content: e.content,
  };
}

function StatCard({ label, value }: { label: string; value: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  return (
    <div ref={ref} className="rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-5 py-4">
      <p className="text-xs text-black/35">{label}</p>
      <p className="mt-1 text-2xl font-bold text-[var(--color-text)]">
        <NumberFlow value={inView ? value : 0} />
      </p>
    </div>
  );
}

function EditEntryDialog({
  entry,
  slug,
  open,
  onOpenChange,
  onSave,
}: {
  entry: UiEntry;
  slug: string;
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onSave: (updated: UiEntry) => void;
}) {
  const [title, setTitle] = useState(entry.title);
  const [version, setVersion] = useState(entry.version ?? '');
  const [content, setContent] = useState(entry.content);
  const [tags, setTags] = useState<string[]>(entry.tags);
  const [saving, setSaving] = useState(false);

  const toggleTag = (tag: string) =>
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Title is required.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/projects/${slug}/entries/${entry.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          version: version || null,
          tag: tags.join(','),
          content,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      onSave({ ...entry, title: title.trim(), version, content, tags });
      onOpenChange(false);
      toast.success('Entry updated');
    } catch {
      toast.error('Failed to save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <AnimatePresence>
          {open && (
            <>
              <Dialog.Overlay asChild>
                <motion.div
                  className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="fixed left-1/2 top-[8%] z-50 w-full max-w-xl -translate-x-1/2 max-h-[85vh] overflow-y-auto rounded-2xl border border-black/10 bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)]"
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <Dialog.Title className="text-base font-bold text-black">Edit entry</Dialog.Title>
                    <Dialog.Close className="rounded-lg p-1.5 text-black/30 hover:bg-black/5 hover:text-black/60 transition-colors">
                      <X size={15} />
                    </Dialog.Close>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Entry title"
                      className="w-full rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-4 py-3 text-sm font-semibold text-black/85 placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition"
                    />
                    <input
                      type="text"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      placeholder="Version (e.g. v2.5.0)"
                      className="w-full rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-4 py-2.5 font-mono text-sm text-black/80 placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition"
                    />
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
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Write release notes in Markdown…"
                      rows={6}
                      className="w-full resize-none rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-4 py-3 font-mono text-sm text-black/80 placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition leading-relaxed"
                    />
                  </div>

                  <div className="mt-5 flex gap-2">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="flex-1 rounded-xl border border-black/10 py-2.5 text-sm text-black/50 hover:bg-black/3 transition-colors"
                      >
                        Cancel
                      </button>
                    </Dialog.Close>
                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-semibold text-white hover:bg-black/85 transition-all disabled:opacity-40"
                    >
                      {saving && <Loader2 size={13} className="animate-spin" />}
                      Save changes
                    </button>
                  </div>
                </motion.div>
              </Dialog.Content>
            </>
          )}
        </AnimatePresence>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

export function EntriesClient({
  project,
  initialEntries,
}: {
  project: Project;
  initialEntries: Entry[];
}) {
  const slug = project.slug;
  const [entries, setEntries] = useState<UiEntry[]>(initialEntries.map(dbToUi));
  const [copied, setCopied] = useState(false);
  const [editingEntry, setEditingEntry] = useState<UiEntry | null>(null);
  const [tbodyRef] = useAutoAnimate();
  const router = useRouter();

  const publishedCount = entries.filter((e) => e.status === 'published').length;
  const draftCount = entries.filter((e) => e.status === 'draft').length;

  const snippet = `<script src="https://patchly.io/widget.js" data-project="${slug}"></script>`;

  const copySnippet = async () => {
    await navigator.clipboard.writeText(snippet);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async (id: string, title: string) => {
    const prev = entries;
    setEntries((e) => e.filter((x) => x.id !== id));
    try {
      const res = await fetch(`/api/projects/${slug}/entries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      toast(`"${title}" deleted`, {
        action: { label: 'Undo', onClick: () => setEntries(prev) },
      });
      router.refresh();
    } catch {
      setEntries(prev);
      toast.error('Failed to delete entry.');
    }
  };

  const handleSaveEdit = (updated: UiEntry) => {
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    router.refresh();
  };

  return (
    <div className="max-w-4xl">
      <div className="mb-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Link
              href="/dashboard"
              className="text-sm text-black/35 hover:text-black/60 transition-colors"
            >
              Projects
            </Link>
            <span className="text-black/20">/</span>
            <span className="text-sm capitalize text-black/70">{slug.replace(/-/g, ' ')}</span>
          </div>
          <h1 className="text-2xl font-bold capitalize text-[var(--color-text)]">
            {project.name}
          </h1>
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="mt-1 flex items-center gap-1 text-xs text-black/35 hover:text-black/60 transition-colors"
          >
            <Globe size={11} />
            patchly.io/{slug}
          </a>
        </div>
        <Link
          href={`/dashboard/${slug}/new`}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black/85"
        >
          <Plus size={14} />
          New entry
        </Link>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard label="Total entries" value={entries.length} />
        <StatCard label="Published" value={publishedCount} />
        <StatCard label="Drafts" value={draftCount} />
      </div>

      {entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-black/8 bg-[oklch(98%_0_0)]">
            <Plus size={18} className="text-black/30" />
          </div>
          <h3 className="mb-1.5 text-sm font-semibold text-black/60">No entries yet</h3>
          <p className="mb-5 text-xs text-black/35">
            Write your first release note to publish it on your public changelog.
          </p>
          <Link
            href={`/dashboard/${slug}/new`}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black/85"
          >
            <Plus size={13} />
            Write first entry
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-black/8">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-black/8 bg-[oklch(98%_0_0)]">
                <th className="px-5 py-3 text-left font-medium text-black/35">Version</th>
                <th className="px-5 py-3 text-left font-medium text-black/35">Title</th>
                <th className="hidden px-5 py-3 text-left font-medium text-black/35 sm:table-cell">Tags</th>
                <th className="hidden px-5 py-3 text-left font-medium text-black/35 md:table-cell">Date</th>
                <th className="px-5 py-3 text-left font-medium text-black/35">Status</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody ref={tbodyRef} className="divide-y divide-black/5 bg-white">
              {entries.map((entry) => (
                <tr key={entry.id} className="group transition-colors hover:bg-black/[0.02]">
                  <td className="px-5 py-3.5 font-mono text-xs text-black/45">{entry.version}</td>
                  <td className="max-w-xs truncate px-5 py-3.5 font-medium text-black/80">
                    {entry.title}
                  </td>
                  <td className="hidden px-5 py-3.5 sm:table-cell">
                    <div className="flex flex-wrap gap-1.5">
                      {entry.tags.map((tag) => (
                        <span key={tag} className="rounded border border-black/10 px-2 py-0.5 text-xs text-black/40">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="hidden px-5 py-3.5 text-black/35 md:table-cell">{entry.date}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        entry.status === 'published' ? 'bg-black/6 text-black/55' : 'bg-amber-50 text-amber-600'
                      }`}
                    >
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => setEditingEntry(entry)}
                        className="rounded-lg p-1.5 text-black/30 transition-colors hover:bg-black/6 hover:text-black/60"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(entry.id, entry.title)}
                        className="rounded-lg p-1.5 text-black/30 transition-colors hover:bg-red-50 hover:text-red-400"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-black/8 bg-[oklch(98%_0_0)] p-5">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-xs font-medium text-black/40">Widget snippet</p>
          <button
            type="button"
            onClick={copySnippet}
            className="flex items-center gap-1.5 rounded-lg border border-black/10 px-2.5 py-1 text-xs text-black/45 transition-colors hover:bg-black/5 hover:text-black/65"
          >
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <pre className="overflow-x-auto rounded-lg bg-black/[0.03] p-3 font-mono text-xs text-black/55">
          {snippet}
        </pre>
      </div>

      {editingEntry && (
        <EditEntryDialog
          entry={editingEntry}
          slug={slug}
          open={!!editingEntry}
          onOpenChange={(v) => !v && setEditingEntry(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
