"use client";

export default function Toast({ message, variant = "success", onClose }) {
  if (!message) return null;

  const styles =
    variant === "success"
      ? "border-emerald-500/20 bg-emerald-50 text-emerald-800"
      : "border-red-200 bg-red-50 text-red-700";

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      <div
        role="alert"
        className={`animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg ${styles}`}
      >
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss"
          className="shrink-0 text-sm font-semibold opacity-60 hover:opacity-100"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
