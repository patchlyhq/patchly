import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-8 text-center">
      <p className="mb-3 font-mono text-xs text-black/25">404</p>
      <h1 className="mb-3 text-3xl font-black tracking-tight text-black">
        Page not found
      </h1>
      <p className="mb-8 text-sm text-black/45">
        This page doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded-xl bg-black px-5 py-2.5 text-sm font-semibold text-white hover:bg-black/85 transition-colors"
      >
        Go home
      </Link>
    </div>
  );
}
