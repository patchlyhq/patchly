'use client';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import * as Dialog from '@radix-ui/react-dialog';
import { ArrowUpRight, Loader2, Plus, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import type { Project } from '@/db/schema';

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function formatDate(date: Date) {
  const diff = Date.now() - date.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function NewProjectDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [name, setName] = useState('');
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const slugPreview = toSlug(name);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim() }),
      });
      if (!res.ok) throw new Error('Failed');
      setName('');
      onOpenChange(false);
      toast.success(`"${name.trim()}" created`);
      router.refresh();
    } catch {
      toast.error('Failed to create project. Try again.');
    } finally {
      setCreating(false);
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
                  className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-black/10 bg-white p-5 shadow-[0_20px_60px_rgba(0,0,0,0.12)] sm:p-6"
                  initial={{ opacity: 0, y: -12, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                >
                  <div className="mb-5 flex items-center justify-between">
                    <Dialog.Title className="text-base font-bold text-black">
                      New project
                    </Dialog.Title>
                    <Dialog.Close className="rounded-lg p-1.5 text-black/30 hover:bg-black/5 hover:text-black/60 transition-colors">
                      <X size={15} />
                    </Dialog.Close>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-black/70">
                        Project name
                      </label>
                      <input
                        autoFocus
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                        placeholder="My App"
                        className="w-full rounded-xl border border-black/10 bg-[oklch(98%_0_0)] px-4 py-2.5 text-sm text-black/85 placeholder:text-black/25 outline-none focus:border-black/25 focus:bg-white transition"
                      />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-medium text-black/70">
                        Public URL
                      </label>
                      <div className="flex items-center gap-1.5 rounded-xl border border-black/8 bg-[oklch(98%_0_0)] px-4 py-2.5">
                        <span className="text-sm text-black/30">patchly.io/</span>
                        <span className="text-sm font-mono text-black/60">
                          {slugPreview || 'my-app'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-2">
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
                      onClick={handleSubmit}
                      disabled={!name.trim() || creating}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-black py-2.5 text-sm font-semibold text-white hover:bg-black/85 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {creating && <Loader2 size={13} className="animate-spin" />}
                      Create project
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

export function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [gridRef] = useAutoAnimate();

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)]">Projects</h1>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Each project gets its own public changelog page.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDialogOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black/85"
        >
          <Plus size={14} />
          New project
        </button>
      </div>

      {initialProjects.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/10 px-8 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-black/8 bg-[oklch(98%_0_0)]">
            <Plus size={18} className="text-black/30" />
          </div>
          <h3 className="mb-1.5 text-sm font-semibold text-black/60">No projects yet</h3>
          <p className="mb-5 text-xs text-black/35">
            Create your first project to get a public changelog URL and embeddable widget.
          </p>
          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black/85"
          >
            <Plus size={13} />
            Create your first project
          </button>
        </div>
      ) : (
        <div ref={gridRef} className="grid gap-3 sm:grid-cols-2">
          {initialProjects.map((project) => (
            <Link
              key={project.id}
              href={`/dashboard/${project.slug}`}
              className="group rounded-xl border border-black/8 bg-[oklch(98%_0_0)] p-5 transition-colors hover:border-black/15 hover:bg-white"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-[var(--color-text)]">{project.name}</h3>
                  <p className="mt-0.5 text-xs text-black/30">/{project.slug}</p>
                </div>
                <span className="p-1.5 text-black/20 transition-colors group-hover:text-black/45">
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-black/25">
                  Created {formatDate(new Date(project.createdAt))}
                </span>
              </div>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setDialogOpen(true)}
            className="group rounded-xl border border-dashed border-black/10 p-5 text-left transition-colors hover:border-black/20"
          >
            <div className="flex items-center gap-3 text-black/25 transition-colors group-hover:text-black/45">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-black/10 group-hover:border-black/20">
                <Plus size={13} />
              </div>
              <span className="text-sm">New project</span>
            </div>
          </button>
        </div>
      )}

      <NewProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </>
  );
}
