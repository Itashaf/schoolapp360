import { NextResponse } from "next/server";
import { rateLimit } from "@/lib/rate-limit";
import { sendEarlyAccessNotification } from "@/lib/email";
import { getDb } from "@/lib/mongodb";

const MAX_REQUESTS_PER_WINDOW = 5;
const WINDOW_MS = 60_000;
const MAX_FIELD_LENGTH = 200;
const MAX_BODY_BYTES = 10_000; // generous cap for a 4-field JSON form

function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  return request.headers.get("x-real-ip") || "unknown";
}

function tooLong(value) {
  return typeof value === "string" && value.length > MAX_FIELD_LENGTH;
}

export async function POST(request) {
  const ip = getClientIp(request);

  // Rate limit first — cheapest check, keeps abusive clients off everything below.
  const { allowed, retryAfterMs } = rateLimit(`early-access:${ip}`, {
    max: MAX_REQUESTS_PER_WINDOW,
    windowMs: WINDOW_MS,
  });

  if (!allowed) {
    return NextResponse.json(
      {
        status: "error",
        errors: { form: "Too many requests. Please try again in a minute." },
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) },
      }
    );
  }

  if (!request.headers.get("content-type")?.includes("application/json")) {
    return NextResponse.json(
      { status: "error", errors: { form: "Invalid request body." } },
      { status: 415 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") || 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { status: "error", errors: { form: "Request too large." } },
      { status: 413 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: "error", errors: { form: "Invalid request body." } },
      { status: 400 }
    );
  }

  // Honeypot: a hidden field real users never fill in. Bots that
  // autofill every field trip it — pretend success, do nothing further.
  if (body?.company) {
    return NextResponse.json({ status: "success", errors: {} });
  }

  const name = body?.name?.toString().trim();
  const email = body?.email?.toString().trim();
  const schoolName = body?.schoolName?.toString().trim();
  const phone = body?.phone?.toString().trim();

  const errors = {};
  if (!name) errors.name = "Your name is required.";
  else if (tooLong(name)) errors.name = "Name is too long.";

  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = "Enter a valid email address.";
  else if (tooLong(email)) errors.email = "Email is too long.";

  if (!schoolName) errors.schoolName = "School name is required.";
  else if (tooLong(schoolName)) errors.schoolName = "School name is too long.";

  if (!phone) errors.phone = "Phone number is required.";
  else if (phone.length > 30) errors.phone = "Phone number is too long.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ status: "error", errors }, { status: 422 });
  }

  try {
    const db = await getDb();
    await db.collection("early_access_requests").insertOne({
      name,
      email,
      schoolName,
      phone,
      ip,
      userAgent: request.headers.get("user-agent") || "",
      createdAt: new Date(),
    });
  } catch (error) {
    console.error("Failed to store early access request:", error);
    return NextResponse.json(
      { status: "error", errors: { form: "Something went wrong. Please try again." } },
      { status: 500 }
    );
  }

  try {
    await sendEarlyAccessNotification({ name, email, schoolName, phone });
  } catch (error) {
    // Don't fail the visitor's submission just because the notification
    // email didn't go out — the request is already stored above.
    console.error("Failed to send early access notification email:", error);
  }

  return NextResponse.json({ status: "success", errors: {} });
}
