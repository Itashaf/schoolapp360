import Link from "next/link";

export const metadata = {
  title: "Page not found",
  description: "SchoolApp 360 is launching soon. This page doesn't exist — head back to the homepage.",
};

export default function NotFound() {
  return (
    <section className="flex flex-1 flex-col items-center justify-center bg-white px-4 py-24 text-center">
      <p className="font-mono text-xs font-semibold uppercase tracking-wide text-brand-600">404</p>
      <h1 className="mt-3 font-display text-3xl font-bold text-ink-950 sm:text-4xl">
        We couldn&apos;t find that page.
      </h1>
      <p className="mt-4 max-w-md text-ink-600">
        SchoolApp 360 is launching soon — head back to the homepage to request early access.
      </p>
      <Link href="/" className="mt-8 rounded-full brand-gradient px-6 py-3 text-sm font-semibold text-white">
        Back to homepage
      </Link>
    </section>
  );
}
