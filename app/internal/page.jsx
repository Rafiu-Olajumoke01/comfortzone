"use client";

import { useEffect, useMemo, useState } from "react";
import { api, clearTokens, errorText, getTokens } from "../lib/api";
import {
  CalendarDays,
  Check,
  Clock,
  CreditCard,
  Download,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutDashboard,
  MessageCircle,
  Phone,
  Plus,
  Scissors,
  Search,
  Trash2,
  TrendingDown,
  TrendingUp,
  Users,
  X,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Config                                                             */
/* ------------------------------------------------------------------ */

// Set to true once this page is wired to the backend. It sends anyone who is
// not signed in as an admin to /login.
const REQUIRE_ADMIN = false;

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const inputClass =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-[#fdb515] focus:ring-2 focus:ring-[#fdb515]/40";
const btnClass =
  "bg-[#fdb515] px-8 py-3 text-xs font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] disabled:cursor-not-allowed disabled:opacity-40";
const smallBtn =
  "bg-black px-3 py-1.5 text-xs font-extrabold text-[#fdb515] transition hover:bg-[#fdb515] hover:text-black";
const dangerBtn =
  "border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-extrabold text-red-700 transition hover:bg-red-600 hover:text-white";
const iconBtn =
  "flex h-8 w-8 items-center justify-center border border-black/15 text-black transition hover:bg-black hover:text-[#fdb515]";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "team", label: "Team", icon: Users },
  { id: "styles", label: "Styles", icon: ImagePlus },
  { id: "services", label: "Services", icon: Scissors },
];

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];
const STATUS_CLASS = {
  pending: "bg-[#fdb515]/25 text-[#8a5f00]",
  confirmed: "bg-black text-[#fdb515]",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
};

const METHODS = ["Card", "Transfer", "QR", "USSD"];
const CATEGORIES = ["Haircuts", "Fades", "Beards", "Line-ups"];
const SLOTS = ["09:00", "10:00", "11:30", "12:30", "14:00", "15:30", "16:30", "18:00"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const PAGE_SIZE = 12;

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

const pad = (n) => String(n).padStart(2, "0");
const money = (n) => `₦${Number(n).toLocaleString("en-NG")}`;
const shortMoney = (n) =>
  n >= 1000 ? `₦${(n / 1000).toFixed(n % 1000 ? 1 : 0)}k` : n ? `₦${n}` : "";

const dayKey = (offset) => {
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
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};
const initials = (name) =>
  name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
const whatsapp = (phone) => `https://wa.me/234${phone.replace(/^0/, "")}`;

// Turns a booking from the API into the shape this page uses.
const mapBooking = (b) => ({
  id: b.id,
  ref: `CZ-${b.id}`,
  name: b.customer_name,
  phone: b.customer_phone || "",
  service: b.service_name,
  amount: Number(b.service_price) || 0,
  date: b.date,
  time: String(b.start_time).slice(0, 5),
  status: b.status,
  barber: b.barber,
  barberFull: b.barber_name,
  paid: b.is_paid,
  home: false,
});

const mapService = (s) => ({
  id: s.id,
  name: s.name,
  price: Number(s.price) || 0,
  duration: s.duration_minutes,
  active: s.is_active,
});

const downloadCsv = (filename, rows) => {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const csv = rows.map((r) => r.map(esc).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ------------------------------------------------------------------ */
/*  Sample data. Replace these with calls to your API when ready.      */
/* ------------------------------------------------------------------ */

const TEAM = [
  { id: "mustapha", name: "Mustapha Oladimeji", clockedIn: true, since: "09:02" },
  { id: "tunde", name: "Tunde", clockedIn: false, since: null },
];

const SERVICES_SEED = [
  { id: "classic-haircut", name: "Classic Haircut", price: 5000, duration: 30, active: true },
  { id: "fade", name: "Fade", price: 6000, duration: 45, active: true },
  { id: "beard-trim", name: "Beard Trim", price: 3000, duration: 30, active: true },
  { id: "lineup", name: "Line-up & Shape-up", price: 2000, duration: 30, active: true },
  { id: "home-service", name: "Home Service", price: 15000, duration: 60, active: true },
];

const PEOPLE = [
  ["Tunde Bakare", "08031234567"],
  ["Emeka Obi", "08099887766"],
  ["David Adeyemi", "07012345678"],
  ["Sola Martins", "08123450987"],
  ["Kelvin Okoro", "09011223344"],
  ["Ife Balogun", "08077665544"],
  ["Chidi Nwosu", "08055443322"],
  ["Femi Johnson", "08066778899"],
  ["Bayo Adewale", "07033445566"],
  ["Segun Ojo", "08122334455"],
  ["Ahmed Yusuf", "09088776655"],
  ["Peter Eze", "08011220099"],
];

const seedBookings = () => {
  let seed = 11;
  const rnd = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
  const list = [];

  const add = (offset, time, status) => {
    const svc = pick(SERVICES_SEED);
    const [name, phone] = pick(PEOPLE);
    const n = list.length + 1;
    list.push({
      id: n,
      ref: `CZ-${40000 + ((n * 731) % 59999)}`,
      name,
      phone,
      service: svc.name,
      amount: svc.price,
      date: dayKey(offset),
      time,
      status,
      method: pick(METHODS),
      barber: pick(TEAM).id,
      home: svc.id === "home-service",
    });
  };

  ["09:30", "11:00", "13:00", "15:00", "17:00"].forEach((t, i) =>
    add(0, t, ["completed", "confirmed", "confirmed", "pending", "pending"][i])
  );
  [
    [1, "10:00", "pending"],
    [1, "14:30", "confirmed"],
    [2, "12:00", "pending"],
    [3, "16:00", "confirmed"],
    [5, "11:30", "pending"],
  ].forEach(([o, t, s]) => add(o, t, s));
  for (let i = 0; i < 40; i++) {
    add(-(1 + Math.floor(i * 1.45)), pick(SLOTS), rnd() < 0.1 ? "cancelled" : "completed");
  }
  return list;
};

const seedStyles = () => [
  { id: 1, title: "Low taper fade", category: "Fades", image: "", live: true },
  { id: 2, title: "Clean beard shape", category: "Beards", image: "", live: true },
  { id: 3, title: "Sharp line-up", category: "Line-ups", image: "", live: false },
];

/* ------------------------------------------------------------------ */
/*  Small UI pieces                                                    */
/* ------------------------------------------------------------------ */

const Title = ({ children, sub, action }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      <h2 className="text-3xl font-bold italic text-black" style={serif}>
        {children}
      </h2>
      {sub && <p className="mt-1 text-sm text-black/60">{sub}</p>}
    </div>
    {action}
  </div>
);

const Panel = ({ title, sub, children, className = "" }) => (
  <section className={`border border-black/10 bg-white p-5 sm:p-6 ${className}`}>
    {title && (
      <div className="mb-4">
        <h3 className="text-xl font-bold italic text-black" style={serif}>
          {title}
        </h3>
        {sub && <p className="mt-0.5 text-xs text-black/50">{sub}</p>}
      </div>
    )}
    {children}
  </section>
);

const Stat = ({ label, value, note, delta }) => (
  <div className="border border-black/10 bg-white p-5">
    <p className="text-xs font-bold uppercase tracking-wider text-black/50">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-black">{value}</p>
    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
      {delta != null && (
        <span
          className={`inline-flex items-center gap-1 font-extrabold ${
            delta >= 0 ? "text-green-700" : "text-red-600"
          }`}
        >
          {delta >= 0 ? (
            <TrendingUp className="h-3.5 w-3.5" aria-hidden />
          ) : (
            <TrendingDown className="h-3.5 w-3.5" aria-hidden />
          )}
          {Math.abs(delta)}%
        </span>
      )}
      {note && <span className="text-black/50">{note}</span>}
    </div>
  </div>
);

const Badge = ({ status }) => (
  <span className={`inline-block px-3 py-1 text-xs font-extrabold capitalize ${STATUS_CLASS[status]}`}>
    {status}
  </span>
);

const Empty = ({ children }) => (
  <p className="border border-dashed border-black/20 bg-white p-6 text-sm text-black/60">{children}</p>
);

const Chip = ({ active, onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className={`border-2 px-4 py-2 text-xs font-extrabold capitalize transition ${
      active
        ? "border-[#fdb515] bg-[#fdb515] text-black"
        : "border-black/10 bg-white text-black hover:border-black/40"
    }`}
  >
    {children}
  </button>
);

const SearchBox = ({ value, onChange, placeholder }) => (
  <div className="relative min-w-[220px] flex-1">
    <Search
      className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black/40"
      aria-hidden
    />
    <input
      type="search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={placeholder}
      className={`${inputClass} pl-10`}
    />
  </div>
);

const Bar = ({ pct }) => (
  <div className="h-2 w-full bg-black/10">
    <div className="h-2 bg-[#fdb515]" style={{ width: `${pct}%` }} />
  </div>
);

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

const AdminPage = () => {
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState([]);
  const [styles, setStyles] = useState([]);
  const [services, setServices] = useState([]);
  const [servicesDirty, setServicesDirty] = useState(false);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState(null);

  // bookings view
  const [query, setQuery] = useState("");
  const [range, setRange] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [limit, setLimit] = useState(PAGE_SIZE);

  // payments view
  const [payQuery, setPayQuery] = useState("");
  const [payFilter, setPayFilter] = useState("all");

  // styles + services forms
  const [styleFilter, setStyleFilter] = useState("All");
  const [draft, setDraft] = useState({ title: "", category: CATEGORIES[0], image: "" });
  const [newSvc, setNewSvc] = useState({ name: "", price: "", duration: "30" });

  useEffect(() => {
    let user = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {}
    if (!getTokens() || !user || user.role !== "admin") {
      clearTokens();
      window.location.href = "/login?next=/internal";
      return;
    }
    api("/api/bookings/", { auth: true })
      .then((list) => setBookings(list.map(mapBooking)))
      .catch((err) => {
        if (err?.status === 401) {
          clearTokens();
          window.location.href = "/login?next=/internal";
        } else {
          setToast(errorText(err));
        }
      });
    setStyles(seedStyles());
    api("/api/services/admin/", { auth: true })
      .then((list) => setServices(list.map(mapService)))
      .catch((err) => setToast(errorText(err)));
    setReady(true);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setConfirm(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ----------------------------- numbers ----------------------------- */

  const stats = useMemo(() => {
    if (!ready) return null;
    const today = dayKey(0);
    const d30 = dayKey(-29);
    const d60 = dayKey(-59);
    const total = (arr) => arr.reduce((s, b) => s + b.amount, 0);
    const live = bookings.filter((b) => b.status !== "cancelled" && b.paid);
    const last30 = live.filter((b) => b.date >= d30 && b.date <= today);
    const prev30 = live.filter((b) => b.date >= d60 && b.date < d30);
    const upcoming = live.filter((b) => b.date > today);
    const cancelled30 = bookings.filter(
      (b) => b.status === "cancelled" && b.date >= d30 && b.date <= today
    );
    const week = Array.from({ length: 7 }, (_, i) => {
      const key = dayKey(i - 6);
      const [y, m, d] = key.split("-").map(Number);
      return {
        key,
        label: DAY_NAMES[new Date(y, m - 1, d).getDay()],
        total: total(live.filter((b) => b.date === key)),
        isToday: i === 6,
      };
    });
    const weekMax = Math.max(...week.map((w) => w.total), 1);

    const group = (arr, keyFn) => {
      const map = new Map();
      arr.forEach((b) => {
        const k = keyFn(b);
        const cur = map.get(k) || { name: k, count: 0, revenue: 0 };
        cur.count += 1;
        cur.revenue += b.amount;
        map.set(k, cur);
      });
      return [...map.values()].sort((a, b) => b.count - a.count);
    };

    const revenue30 = total(last30);
    const revenuePrev = total(prev30);

    return {
      today,
      last30,
      revenue30,
      delta: revenuePrev ? Math.round(((revenue30 - revenuePrev) / revenuePrev) * 100) : null,
      avgTicket: last30.length ? Math.round(revenue30 / last30.length) : 0,
      upcomingCount: upcoming.length,
      upcomingValue: total(upcoming),
      cancelRate:
        last30.length + cancelled30.length
          ? Math.round((cancelled30.length / (last30.length + cancelled30.length)) * 100)
          : 0,
      allTimeValue: total(live),
      week,
      weekMax,
      topServices: group(last30, (b) => b.service).slice(0, 5),
      methods: group(last30, (b) => b.method),
    };
  }, [bookings, ready]);

  if (!ready) {
    return (
      <main className="min-h-screen bg-[#faf6ec] px-6 pt-32">
        <div className="mx-auto max-w-5xl animate-pulse space-y-4">
          <div className="h-10 w-72 bg-black/10" />
          <div className="grid gap-4 sm:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-black/10" />
            ))}
          </div>
          <div className="h-64 bg-black/10" />
        </div>
      </main>
    );
  }

  const { today } = stats;
  const todays = bookings
    .filter((b) => b.date === today && b.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));
  const pending = bookings
    .filter((b) => b.status === "pending")
    .sort((a, b) => `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`));
  const barberName = (id) =>
    bookings.find((b) => b.barber === id)?.barberFull?.split(" ")[0] ?? "Unassigned";

  /* ----------------------------- actions ----------------------------- */

  const notify = (text) => setToast(text);

  const setStatus = async (id, status, message) => {
    try {
      const path =
        status === "cancelled" ? `/api/bookings/${id}/cancel/` : `/api/bookings/${id}/status/`;
      const updated = await api(path, {
        method: "POST",
        auth: true,
        body: status === "cancelled" ? undefined : { status },
      });
      setBookings((list) => list.map((b) => (b.id === id ? mapBooking(updated) : b)));
      notify(message);
    } catch (err) {
      notify(errorText(err));
    }
  };

  const askCancel = (b) =>
    setConfirm({
      title: `Cancel ${b.name}'s booking?`,
      body: `${money(b.amount)} was already paid. Any refund is sent to the customer directly, outside this page.`,
      label: "Cancel booking",
      run: () => setStatus(b.id, "cancelled", "Booking cancelled."),
    });

  const bookingActions = (b) => (
    <div className="flex flex-wrap items-center gap-2">
      {b.status === "pending" && (
        <button type="button" className={smallBtn} onClick={() => setStatus(b.id, "confirmed", "Booking confirmed.")}>
          Confirm
        </button>
      )}
      {b.status === "confirmed" && (
        <button type="button" className={smallBtn} onClick={() => setStatus(b.id, "completed", "Marked as completed.")}>
          Complete
        </button>
      )}
      {(b.status === "pending" || b.status === "confirmed") && (
        <button type="button" className={dangerBtn} onClick={() => askCancel(b)}>
          Cancel
        </button>
      )}
      <a
        href={whatsapp(b.phone)}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp ${b.name}`}
        className={iconBtn}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
      </a>
      <a href={`tel:${b.phone}`} aria-label={`Call ${b.name}`} className={iconBtn}>
        <Phone className="h-4 w-4" aria-hidden />
      </a>
    </div>
  );

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setDraft((d) => ({ ...d, image: URL.createObjectURL(file) }));
  };

  const addStyle = () => {
    if (!draft.title.trim() || !draft.image) return;
    setStyles((list) => [{ id: Date.now(), ...draft, title: draft.title.trim(), live: true }, ...list]);
    setDraft({ title: "", category: CATEGORIES[0], image: "" });
    notify("Style published to the gallery.");
  };

  const toggleStyle = (id) =>
    setStyles((list) => list.map((s) => (s.id === id ? { ...s, live: !s.live } : s)));

  const askDeleteStyle = (s) =>
    setConfirm({
      title: `Delete "${s.title}"?`,
      body: "This removes the style from your gallery. You can always upload it again.",
      label: "Delete style",
      run: () => {
        setStyles((list) => list.filter((x) => x.id !== s.id));
        notify("Style deleted.");
      },
    });

  const editService = (id, field, value) => {
    setServices((list) =>
      list.map((s) => (s.id === id ? { ...s, [field]: Math.max(0, Number(value) || 0) } : s))
    );
    setServicesDirty(true);
  };

  const toggleService = (id) => {
    setServices((list) => list.map((s) => (s.id === id ? { ...s, active: !s.active } : s)));
    setServicesDirty(true);
  };

  const addService = async () => {
    const name = newSvc.name.trim();
    if (!name || !Number(newSvc.price)) return;
    try {
      const created = await api("/api/services/admin/", {
        method: "POST",
        auth: true,
        body: {
          name,
          description: "",
          price: Number(newSvc.price),
          duration_minutes: Number(newSvc.duration) || 30,
          is_active: true,
        },
      });
      setServices((list) => [...list, mapService(created)]);
      setNewSvc({ name: "", price: "", duration: "30" });
      notify("Service added.");
    } catch (err) {
      notify(errorText(err));
    }
  };

  const saveServices = async () => {
    try {
      await Promise.all(
        services.map((s) =>
          api(`/api/services/admin/${s.id}/`, {
            method: "PATCH",
            auth: true,
            body: { price: s.price, duration_minutes: s.duration, is_active: s.active },
          })
        )
      );
      setServicesDirty(false);
      notify("Services saved.");
    } catch (err) {
      notify(errorText(err));
    }
  };

  /* ----------------------------- filtered lists ----------------------------- */

  const q = query.trim().toLowerCase();
  const visibleBookings = bookings
    .filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      if (range === "today" && b.date !== today) return false;
      if (range === "upcoming" && b.date < today) return false;
      if (range === "past" && b.date >= today) return false;
      if (q && !`${b.name} ${b.phone} ${b.ref} ${b.service}`.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => {
      const order = `${a.date}${a.time}`.localeCompare(`${b.date}${b.time}`);
      return range === "upcoming" || range === "today" ? order : -order;
    });

  const statusCount = (s) => bookings.filter((b) => s === "all" || b.status === s).length;

  const payState = (b) =>
    b.status === "cancelled" ? "cancelled" : "paid";

  const pq = payQuery.trim().toLowerCase();
  const visiblePayments = bookings
    .filter((b) => {
      if (payFilter !== "all" && payState(b) !== payFilter) return false;
      if (pq && !`${b.name} ${b.ref} ${b.method}`.toLowerCase().includes(pq)) return false;
      return true;
    })
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  const exportBookings = () =>
    downloadCsv("comfort-zone-bookings.csv", [
      ["Reference", "Customer", "Phone", "Service", "Date", "Time", "Barber", "Amount", "Status"],
      ...visibleBookings.map((b) => [b.ref, b.name, b.phone, b.service, b.date, b.time, barberName(b.barber), b.amount, b.status]),
    ]);

  const exportPayments = () =>
    downloadCsv("comfort-zone-payments.csv", [
      ["Reference", "Customer", "Date", "Method", "Amount", "State"],
      ...visiblePayments.map((b) => [b.ref, b.name, b.date, b.method, b.amount, payState(b)]),
    ]);

  const visibleStyles = styles.filter((s) => styleFilter === "All" || s.category === styleFilter);

  /* ----------------------------- render ----------------------------- */

  return (
    <main className="min-h-screen bg-[#faf6ec] pt-20 lg:flex">
      {/* Sidebar */}
      <aside className="flex flex-col bg-black text-white lg:sticky lg:top-20 lg:h-[calc(100vh-5rem)] lg:w-64 lg:shrink-0 lg:overflow-y-auto">
        <div className="border-b-4 border-[#fdb515] px-6 py-6">
          <p className="text-2xl font-bold italic text-[#fdb515]" style={serif}>
            Owner Dashboard
          </p>
          <p className="mt-1 text-xs text-white/50">Comfort Zone, Ikorodu</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col" aria-label="Dashboard sections">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              aria-current={tab === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-bold transition ${
                tab === id ? "bg-[#fdb515] text-black" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              {id === "bookings" && pending.length > 0 && (
                <span className="ml-auto bg-white px-2 text-xs font-extrabold text-black">{pending.length}</span>
              )}
            </button>
          ))}
        </nav>
        <p className="mt-auto hidden border-t border-white/10 px-6 py-4 text-xs text-white/40 lg:block">
          Demo data. Changes are not saved yet.
        </p>
      </aside>

      <section className="min-w-0 flex-1 px-5 py-8 sm:px-10 sm:py-12">
        {/* ============================ OVERVIEW ============================ */}
        {tab === "overview" && (
          <div>
            <Title sub={dateLabel(today)}>{greeting()}, here is the shop</Title>

            <div className="grid gap-4 sm:grid-cols-3">
              <Stat
                label="Bookings today"
                value={todays.length}
                note={`${todays.filter((b) => b.status === "completed").length} done, ${
                  todays.filter((b) => b.status !== "completed").length
                } to go`}
              />
              <Stat
                label="Revenue, last 30 days"
                value={money(stats.revenue30)}
                delta={stats.delta}
                note="vs previous 30 days"
              />
              <Stat
                label="Waiting for confirmation"
                value={pending.length}
                note={pending.length ? "Confirm them in Bookings" : "All caught up"}
              />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <Stat label="Average per booking" value={money(stats.avgTicket)} note="last 30 days" />
              <Stat
                label="Prepaid and upcoming"
                value={money(stats.upcomingValue)}
                note={`${stats.upcomingCount} future bookings`}
              />
              <Stat label="Cancellation rate" value={`${stats.cancelRate}%`} note="last 30 days" />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <Panel title="Revenue, last 7 days" sub="Paid bookings by day" className="xl:col-span-2">
                <div className="mt-2 flex h-52 gap-3">
                  {stats.week.map((d) => (
                    <div key={d.key} className="flex flex-1 flex-col items-center gap-2">
                      <span className="h-4 text-[11px] font-bold text-black/60">{shortMoney(d.total)}</span>
                      <div className="flex w-full flex-1 items-end">
                        <div
                          className={`w-full ${d.isToday ? "bg-[#fdb515]" : "bg-black"}`}
                          style={{ height: `${Math.max((d.total / stats.weekMax) * 100, d.total ? 6 : 2)}%` }}
                          title={`${d.label}: ${money(d.total)}`}
                        />
                      </div>
                      <span className={`text-xs font-bold ${d.isToday ? "text-black" : "text-black/50"}`}>
                        {d.isToday ? "Today" : d.label}
                      </span>
                    </div>
                  ))}
                </div>
              </Panel>

              <Panel title="Needs your attention">
                {pending.length === 0 ? (
                  <p className="text-sm text-black/60">Nothing waiting. Good work.</p>
                ) : (
                  <ul className="space-y-3">
                    {pending.slice(0, 4).map((b) => (
                      <li key={b.id} className="flex items-center justify-between gap-3 border-b border-black/10 pb-3">
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-extrabold text-black">{b.name}</span>
                          <span className="text-xs text-black/50">
                            {b.service} · {dateLabel(b.date)}, {timeLabel(b.time)}
                          </span>
                        </span>
                        <button
                          type="button"
                          className={smallBtn}
                          onClick={() => setStatus(b.id, "confirmed", "Booking confirmed.")}
                        >
                          Confirm
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-3">
              <Panel title="Today's schedule" className="xl:col-span-2">
                {todays.length === 0 ? (
                  <Empty>No bookings today. New bookings appear here as customers pay.</Empty>
                ) : (
                  <ul className="space-y-3">
                    {todays.map((b) => (
                      <li key={b.id} className="flex items-stretch border border-black/10">
                        <span className="flex w-24 shrink-0 items-center justify-center bg-black text-sm font-extrabold text-[#fdb515]">
                          {timeLabel(b.time)}
                        </span>
                        <span className="flex flex-1 flex-wrap items-center justify-between gap-3 p-4">
                          <span>
                            <span className="block font-extrabold text-black">{b.name}</span>
                            <span className="text-sm text-black/60">
                              {b.service} · with {barberName(b.barber)}
                              {b.home && " · home visit"}
                            </span>
                          </span>
                          <span className="flex items-center gap-3">
                            <Badge status={b.status} />
                            {b.status === "pending" && (
                              <button type="button" className={smallBtn} onClick={() => setStatus(b.id, "confirmed", "Booking confirmed.")}>
                                Confirm
                              </button>
                            )}
                            {b.status === "confirmed" && (
                              <button type="button" className={smallBtn} onClick={() => setStatus(b.id, "completed", "Marked as completed.")}>
                                Complete
                              </button>
                            )}
                          </span>
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Panel>

              <div className="space-y-6">
                <Panel title="Top services" sub="By bookings, last 30 days">
                  <ul className="space-y-4">
                    {stats.topServices.map((s) => (
                      <li key={s.name}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-bold text-black">{s.name}</span>
                          <span className="text-black/60">
                            {s.count} · {shortMoney(s.revenue)}
                          </span>
                        </div>
                        <Bar pct={(s.count / stats.topServices[0].count) * 100} />
                      </li>
                    ))}
                  </ul>
                </Panel>

                <Panel title="How customers pay" sub="Share of bookings, last 30 days">
                  <ul className="space-y-4">
                    {stats.methods.map((m) => (
                      <li key={m.name}>
                        <div className="mb-1 flex justify-between text-sm">
                          <span className="font-bold text-black">{m.name}</span>
                          <span className="text-black/60">{Math.round((m.count / stats.last30.length) * 100)}%</span>
                        </div>
                        <Bar pct={(m.count / stats.last30.length) * 100} />
                      </li>
                    ))}
                  </ul>
                </Panel>
              </div>
            </div>
          </div>
        )}

        {/* ============================ BOOKINGS ============================ */}
        {tab === "bookings" && (
          <div>
            <Title
              sub="Search, filter and manage every booking."
              action={
                <button type="button" onClick={exportBookings} className={`${smallBtn} inline-flex items-center gap-2 px-4 py-2.5`}>
                  <Download className="h-4 w-4" aria-hidden /> Export CSV
                </button>
              }
            >
              Bookings
            </Title>

            <div className="mb-4 flex flex-wrap gap-3">
              <SearchBox
                value={query}
                onChange={(v) => {
                  setQuery(v);
                  setLimit(PAGE_SIZE);
                }}
                placeholder="Search name, phone, reference or service"
              />
              <select
                aria-label="Date range"
                value={range}
                onChange={(e) => {
                  setRange(e.target.value);
                  setLimit(PAGE_SIZE);
                }}
                className={`${inputClass} w-auto font-bold`}
              >
                <option value="all">All dates</option>
                <option value="today">Today</option>
                <option value="upcoming">Today and upcoming</option>
                <option value="past">Past</option>
              </select>
            </div>

            <div className="mb-5 flex flex-wrap gap-2">
              {["all", ...STATUSES].map((f) => (
                <Chip
                  key={f}
                  active={statusFilter === f}
                  onClick={() => {
                    setStatusFilter(f);
                    setLimit(PAGE_SIZE);
                  }}
                >
                  {f} ({statusCount(f)})
                </Chip>
              ))}
            </div>

            {visibleBookings.length === 0 ? (
              <Empty>No bookings match these filters.</Empty>
            ) : (
              <>
                <div className="hidden overflow-x-auto border border-black/10 bg-white md:block">
                  <table className="w-full min-w-[820px] text-left text-sm">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="px-4 py-3 font-bold">Customer</th>
                        <th className="px-4 py-3 font-bold">Service</th>
                        <th className="px-4 py-3 font-bold">When</th>
                        <th className="px-4 py-3 font-bold">Barber</th>
                        <th className="px-4 py-3 font-bold">Paid</th>
                        <th className="px-4 py-3 font-bold">Status</th>
                        <th className="px-4 py-3 font-bold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-black/10">
                      {visibleBookings.slice(0, limit).map((b) => (
                        <tr key={b.id} className="align-middle">
                          <td className="px-4 py-3">
                            <p className="font-extrabold text-black">{b.name}</p>
                            <p className="text-xs text-black/50">
                              {b.ref} · {b.phone}
                            </p>
                          </td>
                          <td className="px-4 py-3 text-black/70">
                            {b.service}
                            {b.home && <span className="block text-xs font-bold text-[#8a5f00]">Home visit</span>}
                          </td>
                          <td className="px-4 py-3 text-black/70">
                            {dateLabel(b.date)}
                            <span className="block text-xs">{timeLabel(b.time)}</span>
                          </td>
                          <td className="px-4 py-3 text-black/70">{barberName(b.barber)}</td>
                          <td className="px-4 py-3 font-extrabold text-black">{money(b.amount)}</td>
                          <td className="px-4 py-3">
                            <Badge status={b.status} />
                          </td>
                          <td className="px-4 py-3">{bookingActions(b)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <ul className="space-y-3 md:hidden">
                  {visibleBookings.slice(0, limit).map((b) => (
                    <li key={b.id} className="space-y-3 border border-black/10 bg-white p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-extrabold text-black">{b.name}</p>
                          <p className="text-xs text-black/50">{b.ref}</p>
                        </div>
                        <Badge status={b.status} />
                      </div>
                      <p className="text-sm text-black/70">
                        {b.service}
                        {b.home && " · home visit"} · {dateLabel(b.date)}, {timeLabel(b.time)}
                      </p>
                      <p className="text-sm font-extrabold text-black">
                        {money(b.amount)} <span className="font-normal text-black/50">· {barberName(b.barber)}</span>
                      </p>
                      {bookingActions(b)}
                    </li>
                  ))}
                </ul>

                <div className="mt-4 flex items-center justify-between text-sm text-black/60">
                  <span>
                    Showing {Math.min(limit, visibleBookings.length)} of {visibleBookings.length}
                  </span>
                  {limit < visibleBookings.length && (
                    <button type="button" className={smallBtn} onClick={() => setLimit((l) => l + PAGE_SIZE)}>
                      Show more
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* ============================ PAYMENTS ============================ */}
        {tab === "payments" && (
          <div>
            <Title
              sub="Every Paystack payment."
              action={
                <button type="button" onClick={exportPayments} className={`${smallBtn} inline-flex items-center gap-2 px-4 py-2.5`}>
                  <Download className="h-4 w-4" aria-hidden /> Export CSV
                </button>
              }
            >
              Payments
            </Title>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <Stat label="Received, last 30 days" value={money(stats.revenue30)} delta={stats.delta} note="vs previous 30" />
              <Stat label="Received, all time" value={money(stats.allTimeValue)} />
            </div>

            <div className="mb-4 flex flex-wrap gap-3">
              <SearchBox value={payQuery} onChange={setPayQuery} placeholder="Search name, reference or method" />
            </div>
            <div className="mb-5 flex flex-wrap gap-2">
              {["all", "paid", "cancelled"].map((f) => (
                <Chip key={f} active={payFilter === f} onClick={() => setPayFilter(f)}>
                  {f}
                </Chip>
              ))}
            </div>

            {visiblePayments.length === 0 ? (
              <Empty>No payments match these filters.</Empty>
            ) : (
              <div className="overflow-x-auto border border-black/10 bg-white">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="px-4 py-3 font-bold">Reference</th>
                      <th className="px-4 py-3 font-bold">Customer</th>
                      <th className="px-4 py-3 font-bold">Date</th>
                      <th className="px-4 py-3 font-bold">Paid with</th>
                      <th className="px-4 py-3 font-bold">Amount</th>
                      <th className="px-4 py-3 font-bold">State</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/10">
                    {visiblePayments.slice(0, 25).map((b) => {
                      const state = payState(b);
                      return (
                        <tr key={b.id}>
                          <td className="px-4 py-3 font-bold text-black">{b.ref}</td>
                          <td className="px-4 py-3 text-black/70">{b.name}</td>
                          <td className="px-4 py-3 text-black/70">{dateLabel(b.date)}</td>
                          <td className="px-4 py-3 text-black/70">{b.method}</td>
                          <td className="px-4 py-3 font-extrabold text-black">{money(b.amount)}</td>
                          <td className="px-4 py-3">
                            {state === "cancelled" ? (
                              <span className="text-xs font-extrabold text-black/50">Cancelled</span>
                            ) : (
                              <span className="bg-green-100 px-3 py-1 text-xs font-extrabold text-green-800">Paid</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            {visiblePayments.length > 25 && (
              <p className="mt-3 text-xs text-black/50">
                Showing the latest 25 of {visiblePayments.length}. Export the CSV for the full list.
              </p>
            )}
          </div>
        )}

        {/* ============================== TEAM ============================== */}
        {tab === "team" && (
          <div>
            <Title sub="Who is in the shop, and how each barber is doing.">Team</Title>
            <ul className="grid gap-4 lg:grid-cols-2">
              {TEAM.map((t) => {
                const mine30 = stats.last30.filter((b) => b.barber === t.id);
                const todayCount = todays.filter((b) => b.barber === t.id).length;
                const next = todays.find((b) => b.barber === t.id && b.status !== "completed");
                return (
                  <li key={t.id} className="border border-black/10 bg-white p-6">
                    <div className="flex items-center gap-4">
                      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-black text-lg font-extrabold text-[#fdb515]">
                        {initials(t.name)}
                      </span>
                      <div>
                        <p className="text-lg font-extrabold text-black">{t.name}</p>
                        <p className="flex items-center gap-2 text-xs font-bold">
                          <span className={`h-2.5 w-2.5 rounded-full ${t.clockedIn ? "bg-green-500" : "bg-black/30"}`} />
                          <span className={t.clockedIn ? "text-green-700" : "text-black/50"}>
                            {t.clockedIn ? `Clocked in since ${timeLabel(t.since)}` : "Not clocked in"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                      <div className="bg-[#faf6ec] p-3">
                        <p className="text-2xl font-extrabold text-black">{todayCount}</p>
                        <p className="text-xs text-black/50">Today</p>
                      </div>
                      <div className="bg-[#faf6ec] p-3">
                        <p className="text-2xl font-extrabold text-black">{mine30.length}</p>
                        <p className="text-xs text-black/50">Last 30 days</p>
                      </div>
                      <div className="bg-[#faf6ec] p-3">
                        <p className="text-2xl font-extrabold text-black">
                          {shortMoney(mine30.reduce((s, b) => s + b.amount, 0)) || "₦0"}
                        </p>
                        <p className="text-xs text-black/50">Revenue</p>
                      </div>
                    </div>
                    <p className="mt-4 flex items-center gap-2 text-sm text-black/60">
                      <Clock className="h-4 w-4" aria-hidden />
                      {next ? `Next: ${next.name} at ${timeLabel(next.time)}` : "No more bookings today"}
                    </p>
                  </li>
                );
              })}
            </ul>
            <p className="mt-6 text-sm text-black/50">
              New barbers are added by the owner in the admin panel. Clock-in times come from the Attendance records.
            </p>
          </div>
        )}

        {/* ============================= STYLES ============================= */}
        {tab === "styles" && (
          <div>
            <Title sub="Photos you add here show on the gallery page.">Styles</Title>

            <div className="grid gap-5 border border-black/10 bg-white p-5 sm:grid-cols-2 sm:p-8">
              <div>
                <label htmlFor="style-title" className="mb-2 block text-sm font-bold text-black">
                  Style name
                </label>
                <input
                  id="style-title"
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                  placeholder="e.g. Skin fade with beard"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="style-category" className="mb-2 block text-sm font-bold text-black">
                  Category
                </label>
                <select
                  id="style-category"
                  value={draft.category}
                  onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}
                  className={inputClass}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="style-image" className="mb-2 block text-sm font-bold text-black">
                  Photo
                </label>
                <input
                  id="style-image"
                  type="file"
                  accept="image/*"
                  onChange={pickImage}
                  className="block w-full text-sm text-black file:mr-4 file:border-0 file:bg-black file:px-5 file:py-3 file:text-xs file:font-extrabold file:text-[#fdb515]"
                />
                {draft.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.image} alt="Preview" className="mt-4 h-40 w-40 object-cover" />
                )}
              </div>
              <div className="sm:col-span-2">
                <button
                  type="button"
                  onClick={addStyle}
                  disabled={!draft.title.trim() || !draft.image}
                  style={slant}
                  className={btnClass}
                >
                  Publish style
                </button>
              </div>
            </div>

            <div className="mb-5 mt-8 flex flex-wrap gap-2">
              {["All", ...CATEGORIES].map((c) => (
                <Chip key={c} active={styleFilter === c} onClick={() => setStyleFilter(c)}>
                  {c}
                </Chip>
              ))}
            </div>

            {visibleStyles.length === 0 ? (
              <Empty>No styles in this category yet.</Empty>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {visibleStyles.map((s) => (
                  <li key={s.id} className="border border-black/10 bg-white">
                    <div className="relative aspect-[4/3] bg-black">
                      {s.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                      ) : (
                        <span
                          className="flex h-full items-center justify-center px-4 text-center text-lg font-bold italic text-[#fdb515]"
                          style={serif}
                        >
                          {s.title}
                        </span>
                      )}
                      {!s.live && (
                        <span className="absolute left-3 top-3 bg-white px-3 py-1 text-xs font-extrabold text-black">
                          Hidden
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 p-4">
                      <span>
                        <span className="block font-extrabold text-black">{s.title}</span>
                        <span className="text-xs text-black/50">{s.category}</span>
                      </span>
                      <span className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => toggleStyle(s.id)}
                          aria-label={s.live ? "Hide from gallery" : "Show on gallery"}
                          className={`${iconBtn} h-10 w-10`}
                        >
                          {s.live ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                        </button>
                        <button
                          type="button"
                          onClick={() => askDeleteStyle(s)}
                          aria-label={`Delete ${s.title}`}
                          className="flex h-10 w-10 items-center justify-center border border-black/15 text-red-600 transition hover:bg-red-600 hover:text-white"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* ============================ SERVICES ============================ */}
        {tab === "services" && (
          <div>
            <Title
              sub="Prices and durations. Changes show on the booking page straight away."
              action={
                <button
                  type="button"
                  onClick={saveServices}
                  disabled={!servicesDirty}
                  style={slant}
                  className={btnClass}
                >
                  {servicesDirty ? "Save changes" : "Saved"}
                </button>
              }
            >
              Services
            </Title>

            <ul className="space-y-3">
              {services.map((s) => (
                <li
                  key={s.id}
                  className={`flex flex-wrap items-center justify-between gap-4 border border-black/10 bg-white p-5 ${
                    s.active ? "" : "opacity-60"
                  }`}
                >
                  <div className="min-w-[180px]">
                    <p className="font-extrabold text-black">{s.name}</p>
                    <p className="text-xs text-black/50">{s.active ? "Customers can book this" : "Hidden from booking"}</p>
                  </div>
                  <div className="flex flex-wrap items-end gap-4">
                    <label className="text-xs font-bold text-black/60">
                      Price (₦)
                      <input
                        type="number"
                        min="0"
                        value={s.price}
                        onChange={(e) => editService(s.id, "price", e.target.value)}
                        className={`${inputClass} mt-1 w-32`}
                      />
                    </label>
                    <label className="text-xs font-bold text-black/60">
                      Minutes
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={s.duration}
                        onChange={(e) => editService(s.id, "duration", e.target.value)}
                        className={`${inputClass} mt-1 w-24`}
                      />
                    </label>
                    <button type="button" onClick={() => toggleService(s.id)} className={`${s.active ? smallBtn : dangerBtn} h-[46px]`}>
                      {s.active ? "Active" : "Off"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <Panel title="Add a service" className="mt-8">
              <div className="grid gap-4 sm:grid-cols-4">
                <input
                  value={newSvc.name}
                  onChange={(e) => setNewSvc((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Service name"
                  aria-label="Service name"
                  className={`${inputClass} sm:col-span-2`}
                />
                <input
                  type="number"
                  min="0"
                  value={newSvc.price}
                  onChange={(e) => setNewSvc((v) => ({ ...v, price: e.target.value }))}
                  placeholder="Price (₦)"
                  aria-label="Price"
                  className={inputClass}
                />
                <input
                  type="number"
                  min="5"
                  step="5"
                  value={newSvc.duration}
                  onChange={(e) => setNewSvc((v) => ({ ...v, duration: e.target.value }))}
                  placeholder="Minutes"
                  aria-label="Duration in minutes"
                  className={inputClass}
                />
              </div>
              <button
                type="button"
                onClick={addService}
                disabled={!newSvc.name.trim() || !Number(newSvc.price)}
                className={`${smallBtn} mt-4 inline-flex items-center gap-2 px-4 py-2.5 disabled:opacity-40`}
              >
                <Plus className="h-4 w-4" aria-hidden /> Add service
              </button>
            </Panel>
          </div>
        )}
      </section>

      {/* Confirm dialog */}
      {confirm && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          onClick={() => setConfirm(null)}
        >
          <div className="w-full max-w-md border-t-4 border-[#fdb515] bg-white p-6" onClick={(e) => e.stopPropagation()}>
            <h3 id="confirm-title" className="text-2xl font-bold italic text-black" style={serif}>
              {confirm.title}
            </h3>
            <p className="mt-2 text-sm text-black/70">{confirm.body}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setConfirm(null)}
                className="border border-black/20 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-black hover:bg-black/5"
              >
                Keep it
              </button>
              <button
                type="button"
                onClick={() => {
                  confirm.run();
                  setConfirm(null);
                }}
                className="bg-red-600 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-red-700"
              >
                {confirm.label}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          role="status"
          className="fixed bottom-5 right-5 z-[60] flex max-w-sm items-center gap-3 border-l-4 border-[#fdb515] bg-black px-5 py-3 text-sm font-bold text-white shadow-lg"
        >
          <Check className="h-4 w-4 shrink-0 text-[#fdb515]" aria-hidden />
          {toast}
          <button type="button" onClick={() => setToast("")} aria-label="Dismiss" className="ml-2 text-white/60 hover:text-white">
            <X className="h-4 w-4" aria-hidden />
          </button>
        </div>
      )}
    </main>
  );
};

export default AdminPage;