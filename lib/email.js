import { Resend } from "resend";
import { siteConfig } from "./site-config";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Sender must be on a domain verified with Resend. Falls back to Resend's
// shared test sender, which only delivers to the email tied to the Resend
// account — fine for launch, swap for a verified schoolapp360.com address
// once one exists.
const FROM_ADDRESS = process.env.EARLY_ACCESS_FROM_EMAIL || "SchoolApp 360 <onboarding@resend.dev>";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]
  ));
}

export async function sendEarlyAccessNotification({ name, email, schoolName, phone }) {
  if (!resend) {
    console.warn("RESEND_API_KEY is not set — skipping early access notification email.");
    return;
  }

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: siteConfig.email,
    replyTo: email,
    subject: `New early access request — ${name}`,
    html: `
      <h2>New early access request</h2>
      <p><strong>Name:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>School:</strong> ${escapeHtml(schoolName) || "—"}</p>
      <p><strong>Phone:</strong> ${escapeHtml(phone) || "—"}</p>
    `,
  });
}
