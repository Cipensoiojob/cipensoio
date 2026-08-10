"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Home,
  LoaderCircle,
  UserRound,
} from "lucide-react";
import { publishListing } from "@/app/pubblica/actions";
import type { ListingIntent, WorkType } from "@/lib/types";
import { WORK_TYPE_LABELS, WORK_TYPES } from "@/lib/types";
import {
  VERTICALS,
  formatVerticalCategoryLabel,
  getVertical,
  type VerticalSlug,
} from "@/lib/verticals";

const STEPS = ["Categoria", "Annuncio", "Contatti"] as const;

type Props = {
  initialVertical?: VerticalSlug;
  initialCategory?: string;
  initialCity?: string;
  initialIntent?: ListingIntent;
};

export function PublishListingForm({
  initialVertical,
  initialCategory,
  initialCity,
  initialIntent,
}: Props) {
  const router = useRouter();
  const startVertical =
    (initialVertical && getVertical(initialVertical)?.slug) ||
    "assistenza-care";
  const startMeta = getVertical(startVertical)!;
  const normalizedCategory = initialCategory?.replace(/-/g, "_").trim();
  const startCategory =
    normalizedCategory && startMeta.categories.includes(normalizedCategory)
      ? normalizedCategory
      : startMeta.categories[0];
  const startIntent: ListingIntent =
    initialIntent === "offro" || initialIntent === "cerco"
      ? initialIntent
      : "cerco";

  const [step, setStep] = useState(0);
  const [intent, setIntent] = useState<ListingIntent>(startIntent);
  const [verticalSlug, setVerticalSlug] =
    useState<VerticalSlug>(startVertical);
  const [category, setCategory] = useState(startCategory);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [company, setCompany] = useState("");
  const [city, setCity] = useState(initialCity ?? "");
  const [zone, setZone] = useState("");
  const [isRemote, setIsRemote] = useState(false);
  const [workType, setWorkType] = useState<WorkType>("ad_ore");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const vertical = getVertical(verticalSlug)!;
  const categories = useMemo(() => [...vertical.categories], [vertical]);

  function goNext() {
    setError(null);
    if (step === 0) {
      setStep(1);
      return;
    }
    if (step === 1) {
      if (!title.trim() || !description.trim() || !company.trim() || !city.trim()) {
        setError("Compila titolo, descrizione, nome e città.");
        return;
      }
      setStep(2);
      return;
    }
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(0, s - 1));
  }

  function onVerticalChange(slug: VerticalSlug) {
    setVerticalSlug(slug);
    const next = getVertical(slug)!;
    setCategory(next.categories[0]);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!phone.trim()) {
      setError("Inserisci un telefono di contatto.");
      return;
    }

    startTransition(async () => {
      const result = await publishListing({
        macro_branch: vertical.macroBranch,
        category,
        title,
        description,
        company_or_family_name: company,
        location_city: city,
        location_zone: zone || null,
        is_remote: isRemote,
        work_type: workType,
        salary_custom: salary || null,
        contact_phone: phone,
        contact_whatsapp: whatsapp || null,
        intent,
      });

      if (result.error || !result.slug) {
        setError(result.error ?? "Pubblicazione non riuscita.");
        return;
      }

      router.push("/pubblica/grazie");
    });
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto w-full max-w-xl">
      <ol className="mb-8 flex items-center gap-2" aria-label="Passi del form">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={`inline-flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                i <= step
                  ? "bg-[var(--brand)] text-white"
                  : "bg-[var(--brand-soft)] text-[var(--brand-deep)]"
              }`}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </span>
            <span
              className={`hidden text-sm sm:inline ${
                i === step ? "font-semibold text-[var(--foreground)]" : "text-[var(--muted)]"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <span className="mx-1 h-px flex-1 bg-[var(--line)]" aria-hidden />
            )}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <fieldset className="animate-rise space-y-6">
          <legend className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
            Categoria e Offro / Cerco
          </legend>

          <div>
            <p className="mb-2 text-sm font-medium">1. Settore</p>
            <div className="grid gap-2">
              {VERTICALS.map((v) => (
                <button
                  key={v.slug}
                  type="button"
                  onClick={() => onVerticalChange(v.slug)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                    verticalSlug === v.slug
                      ? "border-transparent text-white"
                      : "border-[var(--line)] bg-white"
                  }`}
                  style={
                    verticalSlug === v.slug
                      ? { backgroundColor: v.color }
                      : undefined
                  }
                >
                  <span className="font-semibold">{v.label}</span>
                  <span
                    className={`mt-0.5 block text-xs ${
                      verticalSlug === v.slug
                        ? "text-white/85"
                        : "text-[var(--muted)]"
                    }`}
                  >
                    {v.description}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-medium">2. Offro o Cerco?</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setIntent("offro")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  intent === "offro"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--line)] bg-white"
                }`}
              >
                <UserRound className="size-5 text-[var(--brand)]" />
                <p className="mt-2 font-semibold">Offro lavoro</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {vertical.offroHint}
                </p>
              </button>
              <button
                type="button"
                onClick={() => setIntent("cerco")}
                className={`rounded-2xl border p-4 text-left transition-colors ${
                  intent === "cerco"
                    ? "border-[var(--brand)] bg-[var(--brand-soft)]"
                    : "border-[var(--line)] bg-white"
                }`}
              >
                <Home className="size-5 text-[var(--brand)]" />
                <p className="mt-2 font-semibold">Cerco lavoro</p>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {vertical.cercoHint}
                </p>
              </button>
            </div>
          </div>

          {categories.length > 1 ? (
            <div>
              <p className="mb-2 text-sm font-medium">3. Ruolo preciso</p>
              <div className="flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold ${
                      category === c
                        ? "bg-[var(--brand)] text-white"
                        : "border border-[var(--line)] bg-white"
                    }`}
                  >
                    {formatVerticalCategoryLabel(vertical, c)}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
        </fieldset>
      )}

      {step === 1 && (
        <fieldset className="animate-rise space-y-4">
          <legend className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
            Dettagli{" "}
            {intent === "offro" ? "(Offro lavoro)" : "(Cerco lavoro)"}
          </legend>

          <p className="rounded-xl bg-[var(--brand-soft)] px-3 py-2 text-sm text-[var(--brand-deep)]">
            {vertical.label}
            {categories.length > 1
              ? ` · ${formatVerticalCategoryLabel(vertical, category)}`
              : ""}{" "}
            · {intent === "offro" ? "Offro lavoro" : "Cerco lavoro"}
          </p>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Titolo</span>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                intent === "cerco"
                  ? `Es. Cerco ${formatVerticalCategoryLabel(vertical, category).toLowerCase()} a Milano`
                  : `Es. ${formatVerticalCategoryLabel(vertical, category)} disponibile a Milano`
              }
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Descrizione</span>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descrivi cosa cerchi o offri in poche righe chiare."
              className="w-full resize-y rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">
              {intent === "cerco" ? "Nome famiglia / azienda" : "Il tuo nome"}
            </span>
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
            />
          </label>

          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Città</span>
              <input
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block font-medium">Zona (opz.)</span>
              <input
                value={zone}
                onChange={(e) => setZone(e.target.value)}
                className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
              />
            </label>
          </div>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Tipo di contratto</span>
            <select
              value={workType}
              onChange={(e) => setWorkType(e.target.value as WorkType)}
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
            >
              {WORK_TYPES.map((t) => (
                <option key={t} value={t}>
                  {WORK_TYPE_LABELS[t]}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">
              Retribuzione (opz.)
            </span>
            <input
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="Es. 12€/ora, CCNL, RAL 35k"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 outline-none focus:border-[var(--brand)]"
            />
          </label>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={isRemote}
              onChange={(e) => setIsRemote(e.target.checked)}
              className="size-4 rounded border-[var(--line)]"
            />
            Lavoro full remote / da remoto
          </label>
        </fieldset>
      )}

      {step === 2 && (
        <fieldset className="animate-rise space-y-4">
          <legend className="font-[family-name:var(--font-syne)] text-xl font-semibold tracking-tight">
            Telefono e WhatsApp
          </legend>
          <p className="text-sm text-[var(--muted)]">
            I numeri restano nascosti fino al click. WhatsApp è spesso il modo
            più semplice.
          </p>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">Telefono (obbligatorio)</span>
            <input
              required
              type="tel"
              inputMode="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Es. 340 1234567"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-base outline-none focus:border-[var(--brand)]"
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block font-medium">
              WhatsApp (consigliato)
            </span>
            <input
              type="tel"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="Stesso numero o un altro cellulare"
              className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-3 text-base outline-none focus:border-[var(--brand)]"
            />
          </label>

          <p className="text-xs leading-relaxed text-[var(--muted)]">
            Nota: il lavoro domestico in Italia va dichiarato (es. CCNL).
            CiPensoIo serve a farvi incontrare; non sostituisce obblighi fiscali
            o previdenziali.
          </p>
        </fieldset>
      )}

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800"
        >
          {error}
        </p>
      )}

      <div className="mt-8 flex items-center justify-between gap-3">
        {step > 0 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--line)] px-4 py-2.5 text-sm font-medium"
          >
            <ArrowLeft className="size-4" />
            Indietro
          </button>
        ) : (
          <span />
        )}

        {step < 2 ? (
          <button
            type="button"
            onClick={goNext}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)]"
          >
            Continua
            <ArrowRight className="size-4" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[var(--brand-deep)] disabled:opacity-60"
          >
            {pending && (
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
            )}
            {intent === "offro" ? "Metti in vetrina" : "Pubblica annuncio"}
          </button>
        )}
      </div>
    </form>
  );
}
