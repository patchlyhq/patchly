'use client';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address.');
      return;
    }
    setError('');
    setLoading(true);
    const { error: err } = await authClient.signIn.magicLink({
      email,
      callbackURL: '/dashboard',
    });
    setLoading(false);
    if (err) {
      setError(err.message ?? 'Something went wrong. Try again.');
      return;
    }
    setSent(true);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/dashboard',
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-bg)] px-4">
      <Link
        href="/"
        className="mb-10 flex items-center gap-1.5 text-xs text-black/35 hover:text-black/60 transition-colors"
      >
        <ArrowLeft size={12} />
        Back to Patchly
      </Link>

      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[var(--color-text)]">
            Sign in
          </h1>
          <p className="mt-1.5 text-sm text-[var(--color-muted)]">
            Continue to Patchly
          </p>
        </div>

        {!sent ? (
          <div className="rounded-2xl border border-black/8 bg-white p-8 shadow-sm">
            <div className="space-y-3 mb-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  placeholder="you@example.com"
                  disabled={loading}
                  className={`w-full rounded-xl border bg-[oklch(98%_0_0)] px-4 py-3 text-sm text-[var(--color-text)] placeholder:text-black/25 outline-none transition ${
                    error
                      ? 'border-red-300 focus:border-red-400'
                      : 'border-black/10 focus:border-black/30 focus:bg-white'
                  } disabled:opacity-50`}
                />
                {error && (
                  <p className="mt-1.5 text-xs text-red-400">{error}</p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || !email}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white transition-all hover:bg-black/85 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading && <Loader2 size={14} className="animate-spin" />}
                {loading ? 'Sending link…' : 'Continue with email'}
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-px bg-black/8" />
              <span className="text-xs text-black/25">or</span>
              <div className="flex-1 h-px bg-black/8" />
            </div>

            <button
              type="button"
              onClick={handleGoogle}
              disabled={googleLoading}
              className="w-full rounded-xl border border-black/10 bg-white py-3 text-sm font-medium text-black/70 transition-all hover:bg-black/3 flex items-center justify-center gap-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {googleLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
              )}
              Continue with Google
            </button>
          </div>
        ) : (
          <div className="rounded-2xl border border-black/8 bg-white p-8 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-black/5">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="text-black/50"
                aria-hidden="true"
              >
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
            </div>
            <h2 className="text-base font-bold text-[var(--color-text)]">
              Check your email
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              We sent a sign-in link to{' '}
              <span className="font-medium text-black/70">{email}</span>
            </p>
            <button
              type="button"
              onClick={() => {
                setSent(false);
                setEmail('');
              }}
              className="mt-6 text-xs text-black/30 hover:text-black/55 transition-colors"
            >
              Use a different email
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-black/25">
          By continuing you agree to Patchly&rsquo;s{' '}
          <Link
            href="/terms"
            className="underline underline-offset-2 hover:text-black/45 transition-colors"
          >
            Terms
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-2 hover:text-black/45 transition-colors"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
