"use client";

import { useEffect, useState } from "react";
import Toast from "./Toast";

const inputClass =
  "block w-full rounded-lg border border-black/10 bg-white px-3.5 py-2.5 text-ink-950 shadow-sm placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/30";

function Field({ id, label, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-white">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-sm text-red-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function EarlyAccessForm() {
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timer);
  }, [toast]);

  async function handleSubmit(event) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      email: formData.get("email"),
      schoolName: formData.get("schoolName"),
      phone: formData.get("phone"),
      company: formData.get("company"),
    };

    try {
      const response = await fetch("/api/early-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setErrors(data.errors || {});
        setToast({
          variant: "error",
          message: data.errors?.form || "Please fill all required fields correctly.",
        });
        return;
      }

      form.reset();
      setToast({ variant: "success", message: "You're in — we'll reach out about beta testing." });
    } catch {
      setToast({ variant: "error", message: "Something went wrong. Please try again." });
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <input
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute left-[-9999px] h-0 w-0 opacity-0"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field id="name" label="Your name" error={errors.name}>
            <input
              id="name"
              name="name"
              type="text"
              required
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "name-error" : undefined}
              className={inputClass}
              placeholder="Your name"
            />
          </Field>

          <Field id="email" label="Email address" error={errors.email}>
            <input
              id="email"
              name="email"
              type="email"
              required
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
              className={inputClass}
              placeholder="you@school.edu"
            />
          </Field>

          <Field id="schoolName" label="School name" error={errors.schoolName}>
            <input
              id="schoolName"
              name="schoolName"
              type="text"
              required
              aria-invalid={Boolean(errors.schoolName)}
              aria-describedby={errors.schoolName ? "schoolName-error" : undefined}
              className={inputClass}
              placeholder="Your school"
            />
          </Field>

          <Field id="phone" label="Phone" error={errors.phone}>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              aria-invalid={Boolean(errors.phone)}
              aria-describedby={errors.phone ? "phone-error" : undefined}
              className={inputClass}
              placeholder="+91 90000 00000"
            />
          </Field>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="inline-flex w-full items-center justify-center rounded-full bg-white px-7 py-3.5 text-base font-semibold text-ink-950 shadow-lg shadow-black/20 transition-transform hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Submitting…" : "Join beta testing"}
        </button>

        <p className="text-center text-xs text-white/70">
          No spam — we&apos;ll only reach out about your beta testing spot.
        </p>
      </form>

      <Toast message={toast?.message} variant={toast?.variant} onClose={() => setToast(null)} />
    </>
  );
}
