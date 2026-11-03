"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CalendarPlus, Check, Clock, X } from "lucide-react";

// Must be the same address you use in the booking page
const API_URL = "";

const POLL_MS = 4000; // how often to re-check an unconfirmed payment
const MAX_POLLS = 30; // about 2 minutes

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (n) => String(n).padStart(2, "0");
const money = (n) => `₦${Number(n).toLocaleString("en-US")}`;

// "2026-10-30" -> "Fri, 30 Oct 2026"
const prettyDate = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${DAY_NAMES[dow]}, ${d} ${MONTH_NAMES[m - 1]} ${y}`;
};

// "16:35" -> "4:35 PM"
const prettyTime = (t) => {
  const [h, m] = t.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
};

const downloadCalendar = (data) => {
  const [y, mo, d] = data.date.split("-");
  const [hh, mm] = data.time.split(":").map(Number);
  const endTotal = Math.min(hh * 60 + mm + (data.duration_minutes || 30), 23 * 60 + 59);
  const stamp = new Date().toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Comfort Zone//Booking//EN",
    "BEGIN:VEVENT",
    `UID:${data.reference}@comfortzone`,
    `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Africa/Lagos:${y}${mo}${d}T${pad(hh)}${pad(mm)}00`,
    `DTEND;TZID=Africa/Lagos:${y}${mo}${d}T${pad(Math.floor(endTotal / 60))}${pad(endTotal % 60)}00`,
    `SUMMARY:${data.service} at Comfort Zone`,
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  const blob = new Blob([lines.join("\r\n")], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "comfort-zone-booking.ics";
  link.click();
  URL.revokeObjectURL(url);
};

const Card = ({ icon, iconClass, title, text, children }) => (
  <div className="mx-auto max-w-2xl border border-black/10 bg-white p-8 text-center sm:p-12">
    <span
      className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${iconClass}`}
    >
      {icon}
    </span>
    <h1
      className="mt-6 text-3xl font-bold italic text-black sm:text-4xl"
      style={serif}
    >
      {title}
    </h1>
    {text && <p className="mt-3 text-sm text-black/70 sm:text-base">{text}</p>}
    {children}
  </div>
);

const SuccessContent = () => {
  const params = useSearchParams();
  const reference = params.get("reference");
  const mock = params.get("mock") === "1";
  const forced = params.get("status"); // test mode only: ?status=pending|failed|expired

  const [state, setState] = useState("checking");
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!reference) {
      setState("missing");
      return undefined;
    }

    // Test mode: read the booking saved by the booking page
    if (mock) {
      try {
        const stored = JSON.parse(sessionStorage.getItem("cz-booking") || "null");
        if (stored) {
          setData(stored);
          setState(forced || "paid");
        } else {
          setState("missing");
        }
      } catch (e) {
        setState("missing");
      }
      return undefined;
    }

    if (!API_URL) {
      setState("missing");
      return undefined;
    }

    // Real mode: ask your backend whether Paystack confirmed the payment.
    // GET {API_URL}/bookings/status/?reference=CZ-12345 should return:
    // { status: "paid" | "pending" | "failed" | "expired", reference, service,
    //   home_service, date: "YYYY-MM-DD", time: "HH:MM", duration_minutes,
    //   name, email, address, area, amount_paid, retry_url }
    let cancelled = false;
    let polls = 0;
    let timer;

    const check = async () => {
      try {
        const res = await fetch(
          `${API_URL}/bookings/status/?reference=${encodeURIComponent(reference)}`
        );
        if (!res.ok) throw new Error("bad response");
        const d = await res.json();
        if (cancelled) return;

        setData(d);
        if (d.status === "paid") {
          setState("paid");
        } else if (d.status === "failed" || d.status === "expired") {
          setState(d.status);
        } else {
          setState("checking");
          polls += 1;
          if (polls < MAX_POLLS) timer = setTimeout(check, POLL_MS);
          else setState("slow");
        }
      } catch (e) {
        if (cancelled) return;
        polls += 1;
        if (polls < MAX_POLLS) timer = setTimeout(check, POLL_MS);
        else setState("error");
      }
    };

    check();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [reference, mock, forced]);

  const retry = data?.retry_url;

  return (
    <main className="min-h-screen bg-[#faf6ec] px-6 pb-20 pt-36">
      {state === "checking" && (
        <Card
          icon={<Clock className="h-8 w-8" aria-hidden />}
          iconClass="bg-black text-[#fdb515]"
          title="Confirming your payment"
          text="This only takes a moment. Please keep this page open."
        />
      )}

      {state === "slow" && (
        <Card
          icon={<Clock className="h-8 w-8" aria-hidden />}
          iconClass="bg-black text-[#fdb515]"
          title="Still waiting for your bank"
          text="Banks can be slow. If your account was debited, your booking will be confirmed and we will email you. You do not need to pay again."
        >
          <Link
            href="/contact"
            className="mt-8 inline-block border-2 border-black/40 px-8 py-[14px] text-sm font-bold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white"
          >
            Contact us
          </Link>
        </Card>
      )}

      {state === "pending" && (
        <Card
          icon={<Clock className="h-8 w-8" aria-hidden />}
          iconClass="bg-black text-[#fdb515]"
          title="Payment not completed yet"
          text="We have not received your payment. You can finish it now, or choose another time."
        >
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {retry && (
              <a
                href={retry}
                style={slant}
                className="w-full bg-[#fdb515] px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] sm:w-auto"
              >
                Finish payment
              </a>
            )}
            <Link
              href="/booking"
              className="w-full border-2 border-black/40 px-8 py-[14px] text-sm font-bold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white sm:w-auto"
            >
              Start again
            </Link>
          </div>
        </Card>
      )}

      {(state === "failed" || state === "expired") && (
        <Card
          icon={<X className="h-8 w-8" aria-hidden />}
          iconClass="bg-red-600 text-white"
          title={
            state === "expired"
              ? "Your time is no longer held"
              : "Your payment did not go through"
          }
          text={
            state === "expired"
              ? "The payment was not completed in time, so the slot was released. Please choose a time again."
              : "No money was taken. You can try again, or choose another time."
          }
        >
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            {state === "failed" && retry && (
              <a
                href={retry}
                style={slant}
                className="w-full bg-[#fdb515] px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] sm:w-auto"
              >
                Try again
              </a>
            )}
            <Link
              href="/booking"
              className="w-full border-2 border-black/40 px-8 py-[14px] text-sm font-bold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white sm:w-auto"
            >
              Choose another time
            </Link>
          </div>
        </Card>
      )}

      {(state === "missing" || state === "error") && (
        <Card
          icon={<X className="h-8 w-8" aria-hidden />}
          iconClass="bg-black text-[#fdb515]"
          title="We could not find this booking"
          text="If you have paid, check your email for the confirmation, or contact us and we will help."
        >
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/contact"
              style={slant}
              className="w-full bg-[#fdb515] px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] sm:w-auto"
            >
              Contact us
            </Link>
            <Link
              href="/booking"
              className="w-full border-2 border-black/40 px-8 py-[14px] text-sm font-bold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white sm:w-auto"
            >
              Book again
            </Link>
          </div>
        </Card>
      )}

      {state === "paid" && data && (
        <Card
          icon={<Check className="h-8 w-8" aria-hidden />}
          iconClass="bg-[#fdb515] text-black"
          title="You are booked!"
          text={`A confirmation email is on its way to ${data.email}.`}
        >
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-black/50">
            Booking reference
          </p>
          <p className="mt-1 text-2xl font-extrabold tracking-wider text-black">
            {data.reference || reference}
          </p>

          <ul className="mt-8 space-y-2 border-y border-black/10 py-6 text-left text-sm text-black/80">
            <li className="flex justify-between gap-4">
              <span className="font-bold text-black">Service</span>
              {data.service}
            </li>
            <li className="flex justify-between gap-4">
              <span className="font-bold text-black">Date</span>
              {prettyDate(data.date)}
            </li>
            <li className="flex justify-between gap-4">
              <span className="font-bold text-black">Time</span>
              {prettyTime(data.time)} (Lagos time)
            </li>
            {data.home_service && data.address && (
              <li className="flex justify-between gap-4">
                <span className="font-bold text-black">Address</span>
                <span className="text-right">
                  {data.address}
                  {data.area ? `, ${data.area}` : ""}
                </span>
              </li>
            )}
            <li className="flex justify-between gap-4">
              <span className="font-bold text-black">Paid</span>
              {money(data.amount_paid)}
            </li>
          </ul>

          {data.home_service && (
            <p className="mt-4 text-xs text-black/60">
              This was your deposit. We will confirm the balance once we check
              your area.
            </p>
          )}

          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={() => downloadCalendar({ ...data, reference: data.reference || reference })}
              style={slant}
              className="flex w-full items-center justify-center gap-2 bg-[#fdb515] px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] sm:w-auto"
            >
              <CalendarPlus className="h-5 w-5" aria-hidden />
              Add to calendar
            </button>
            <Link
              href="/"
              className="w-full border-2 border-black/40 px-8 py-[14px] text-sm font-bold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white sm:w-auto"
            >
              Back to home
            </Link>
          </div>

          <p className="mt-6 text-xs text-black/50">
            Need to change or cancel?{" "}
            <Link href="/contact" className="font-bold underline underline-offset-4">
              Contact us
            </Link>
            .
          </p>
        </Card>
      )}
    </main>
  );
};

const BookingSuccessPage = () => (
  <Suspense fallback={<main className="min-h-screen bg-[#faf6ec]" />}>
    <SuccessContent />
  </Suspense>
);

export default BookingSuccessPage;