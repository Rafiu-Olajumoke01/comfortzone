"use client";

import { useEffect, useRef, useState } from "react";
import { api, clearTokens, errorText, getTokens } from "../lib/api";
import { BellRing, Check, Clock, Scissors } from "lucide-react";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const POLL_MS = 8000;

const pad = (n) => String(n).padStart(2, "0");

const dayKey = (offset = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const dateLabel = (key) => {
  const [y, m, d] = key.split("-").map(Number);
  return `${DAY_NAMES[new Date(y, m - 1, d).getDay()]}, ${d} ${MONTHS[m - 1]}`;
};

const timeLabel = (t) => {
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 === 0 ? 12 : h % 12}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};

const clockLabel = (d) =>
  `${d.getHours() % 12 === 0 ? 12 : d.getHours() % 12}:${pad(d.getMinutes())} ${
    d.getHours() >= 12 ? "PM" : "AM"
  }`;

const mapBooking = (b) => ({
  id: b.id,
  name: String(b.customer_name || "Customer").split(" ")[0],
  service: b.service_name,
  date: b.date,
  time: String(b.start_time).slice(0, 5),
  status: b.status,
  paid: b.is_paid,
  home: /home/i.test(b.service_name || ""),
});

const ShopPage = () => {
  const [started, setStarted] = useState(false);
  const [bookings, setBookings] = useState([]);
  const [now, setNow] = useState(null);
  const [toast, setToast] = useState("");
  const [busyId, setBusyId] = useState(null);
  const audioRef = useRef(null);
  const seenRef = useRef(null);

  const beep = () => {
    const ctx = audioRef.current;
    if (!ctx) return;
    [0, 0.3, 0.6].forEach((t) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 880;
      osc.connect(gain);
      gain.connect(ctx.destination);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + t);
      osc.start(ctx.currentTime + t);
      osc.stop(ctx.currentTime + t + 0.2);
    });
  };

  const load = async () => {
    try {
      const list = await api("/api/bookings/", { auth: true });
      const mapped = list.map(mapBooking);
      const pendingIds = mapped.filter((b) => b.status === "pending" && b.paid).map((b) => b.id);
      if (seenRef.current && pendingIds.some((id) => !seenRef.current.has(id))) beep();
      seenRef.current = new Set(pendingIds);
      setBookings(mapped);
    } catch (err) {
      if (err?.status === 401) {
        clearTokens();
        window.location.href = "/login?next=/shop";
      }
    }
  };

  const start = async () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (Ctx) {
      audioRef.current = new Ctx();
      audioRef.current.resume();
    }
    try {
      await navigator.wakeLock?.request("screen");
    } catch {}
    setStarted(true);
  };

  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {}
    if (!getTokens() || !user || user.role !== "barber") {
      clearTokens();
      window.location.href = "/login?next=/shop";
    }
  }, []);

  useEffect(() => {
    if (!started) return;
    setNow(new Date());
    load();
    const poll = setInterval(load, POLL_MS);
    const tick = setInterval(() => setNow(new Date()), 30000);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
    };
  }, [started]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const accept = async (id) => {
    setBusyId(id);
    try {
      const updated = await api(`/api/bookings/${id}/status/`, {
        method: "POST",
        auth: true,
        body: { status: "confirmed" },
      });
      setBookings((list) => list.map((b) => (b.id === id ? mapBooking(updated) : b)));
      setToast("Booking accepted.");
    } catch (err) {
      setToast(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  const today = now ? dayKey(0) : "";
  const waiting = bookings
    .filter((b) => b.status === "pending" && b.paid)
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const acceptedToday = bookings
    .filter((b) => b.date === today && (b.status === "confirmed" || b.status === "completed"))
    .sort((a, b) => a.time.localeCompare(b.time));

  if (!started) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center">
        <Scissors className="mb-6 h-12 w-12 text-[#fdb515]" aria-hidden />
        <h1 className="text-5xl font-bold italic text-[#fdb515]" style={serif}>
          Comfort Zone
        </h1>
        <p className="mt-3 text-white/60">Shop bookings</p>
        <button
          type="button"
          onClick={start}
          style={slant}
          className="mt-10 bg-[#fdb515] px-12 py-5 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-white"
        >
          Start taking bookings
        </button>
      </main>
    );
  }

  if (!now) return null;

  return (
    <main className="min-h-screen bg-[#faf6ec]">
      <header className="flex items-center justify-between border-b-4 border-[#fdb515] bg-black px-8 py-5">
        <div>
          <p className="text-3xl font-bold italic text-[#fdb515]" style={serif}>
            Shop Bookings
          </p>
          <p className="text-xs text-white/50">{dateLabel(today)}</p>
        </div>
        <p className="flex items-center gap-3 text-3xl font-extrabold text-white">
          <Clock className="h-6 w-6 text-[#fdb515]" aria-hidden />
          {clockLabel(now)}
        </p>
      </header>

      <div className="grid gap-8 p-8 lg:grid-cols-5">
        <section className="lg:col-span-3">
          <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold italic text-black" style={serif}>
            <BellRing className="h-6 w-6 text-[#fdb515]" aria-hidden />
            New bookings
            <span className="bg-black px-3 py-0.5 text-sm font-extrabold not-italic text-[#fdb515]">
              {waiting.length}
            </span>
          </h2>

          {waiting.length === 0 ? (
            <p className="border border-dashed border-black/20 bg-white p-10 text-center text-lg text-black/50">
              No new bookings. This page updates by itself.
            </p>
          ) : (
            <ul className="space-y-4">
              {waiting.map((b) => (
                <li key={b.id} className="flex items-stretch border-2 border-[#fdb515] bg-white">
                  <span className="flex w-36 shrink-0 flex-col items-center justify-center bg-black px-2 text-center">
                    <span className="text-xl font-extrabold text-[#fdb515]">{timeLabel(b.time)}</span>
                    <span className="mt-1 text-xs text-white/60">{b.date === today ? "Today" : dateLabel(b.date)}</span>
                  </span>
                  <span className="flex flex-1 flex-wrap items-center justify-between gap-4 p-5">
                    <span>
                      <span className="block text-2xl font-extrabold text-black">{b.name}</span>
                      <span className="text-base text-black/60">
                        {b.service}
                        {b.home && " · home visit"}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={() => accept(b.id)}
                      disabled={busyId === b.id}
                      style={slant}
                      className="bg-[#fdb515] px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] disabled:opacity-40"
                    >
                      {busyId === b.id ? "Accepting..." : "Accept"}
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="lg:col-span-2">
          <h2 className="mb-4 text-2xl font-bold italic text-black" style={serif}>
            Accepted today
          </h2>
          {acceptedToday.length === 0 ? (
            <p className="border border-dashed border-black/20 bg-white p-6 text-sm text-black/50">
              Nothing accepted yet today.
            </p>
          ) : (
            <ul className="space-y-3">
              {acceptedToday.map((b) => (
                <li key={b.id} className="flex items-center justify-between gap-3 border border-black/10 bg-white p-4">
                  <span>
                    <span className="block font-extrabold text-black">
                      {timeLabel(b.time)} · {b.name}
                    </span>
                    <span className="text-sm text-black/60">{b.service}</span>
                  </span>
                  <span className="bg-green-100 px-3 py-1 text-xs font-extrabold text-green-800">Accepted</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {toast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 flex items-center gap-3 border-l-4 border-[#fdb515] bg-black px-6 py-4 text-sm font-bold text-white shadow-lg"
        >
          <Check className="h-4 w-4 text-[#fdb515]" aria-hidden />
          {toast}
        </div>
      )}
    </main>
  );
};

export default ShopPage;