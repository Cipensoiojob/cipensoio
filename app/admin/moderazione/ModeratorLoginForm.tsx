"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginModerator } from "@/app/admin/moderazione/actions";

export function ModeratorLoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setError(null);
        const fd = new FormData(e.currentTarget);
        startTransition(async () => {
          const result = await loginModerator({ error: null }, fd);
          if (result.error) {
            setError(result.error);
            return;
          }
          router.refresh();
        });
      }}
      className="mx-auto w-full max-w-sm rounded-2xl border border-[var(--line)] bg-white p-6 shadow-[var(--shadow-soft)]"
    >
      <h1 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
        Moderazione
      </h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Area riservata. Inserisci la password di moderazione.
      </p>
      <label className="mt-5 block text-sm">
        <span className="mb-1.5 block font-medium">Password</span>
        <input
          type="password"
          name="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-[var(--line)] px-3 py-2.5 outline-none focus:border-[var(--brand)]"
        />
      </label>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="mt-5 w-full rounded-xl bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:opacity-60"
      >
        {pending ? "Accesso…" : "Entra"}
      </button>
    </form>
  );
}
