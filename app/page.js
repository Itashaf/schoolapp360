import Image from "next/image";
import EarlyAccessForm from "@/components/EarlyAccessForm";
import { siteConfig } from "@/lib/site-config";

export const metadata = {
  title: "Enroll for Beta Testing Program",
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden bg-white">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full brand-gradient opacity-10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-accent-blue opacity-10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex w-full max-w-360 flex-1 flex-col px-6 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <div className="flex items-center justify-center lg:-ml-8 lg:justify-start">
          <Image
            src="/schoolapp360.webp"
            alt={siteConfig.shortName}
            width={1786}
            height={618}
            priority
            className="h-27 w-auto"
          />
        </div>

        <div className="grid flex-1 grid-cols-1 items-center gap-10 py-8 sm:gap-12 sm:py-10 lg:grid-cols-12 lg:gap-16 lg:py-16">
          <div className="text-center lg:col-span-7 lg:text-left">
            <p className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-brand-50 px-4 py-1.5 font-mono text-xs font-medium text-brand-700">
              <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              Launching soon
            </p>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.15] tracking-tight text-ink-950 sm:text-5xl lg:text-7xl">
              Still running your school on Excel and WhatsApp?
              <span className="block brand-gradient-text-light">We fixed that.</span>
            </h1>

            {/* <p className="mx-auto mt-6 text-sm text-center text-ink-600 lg:mx-0 lg:max-w-xl lg:text-left px-4">
              SchoolApp 360 replaces attendance registers, fee reminders, and mark sheets with
              one connected system for admins, teachers, and parents.
            </p> */}

            <p className="mx-auto mt-6 max-w-64 text-center font-mono text-xs leading-relaxed text-ink-500 lg:mx-0 lg:max-w-none lg:text-left">
              60-sec attendance · instant exam alerts · automatic fee reconciliation · many more
            </p>
          </div>

          <div className="lg:col-span-5">
            <div className="w-full rounded-2xl brand-gradient-dark p-6 shadow-sm sm:p-8 lg:ml-auto lg:max-w-md">
              <h2 className="font-display text-2xl font-bold text-white">Join beta testing</h2>
              <p className="mt-1.5 text-sm text-white/80">
                Spots are limited — leave your details and we&apos;ll reach out personally.
              </p>
              <div className="mt-6">
                <EarlyAccessForm />
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-ink-500 lg:text-right">
              Questions? Reach us at{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="underline decoration-brand-500 underline-offset-2 hover:text-ink-950"
              >
                {siteConfig.email}
              </a>
            </p>
          </div>
        </div>
      </div>

      <footer className="relative border-t border-black/5 py-6 text-center text-xs text-ink-500">
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </footer>
    </div>
  );
}
