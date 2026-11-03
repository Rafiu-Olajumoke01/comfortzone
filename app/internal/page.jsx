"use client";

import { useEffect, useState } from "react";
import {
  CalendarDays,
  CreditCard,
  Eye,
  EyeOff,
  ImagePlus,
  LayoutDashboard,
  Scissors,
  Trash2,
} from "lucide-react";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const inputClass =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-[#fdb515] focus:ring-2 focus:ring-[#fdb515]/40";

const btnClass =
  "bg-[#fdb515] px-8 py-3 text-xs font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] disabled:cursor-not-allowed disabled:opacity-40";

const NAV = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarDays },
  { id: "payments", label: "Payments", icon: CreditCard },
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

const CATEGORIES = ["Haircuts", "Fades", "Beards", "Line-ups"];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const pad = (n) => String(n).padStart(2, "0");
const money = (n) => `₦${n.toLocaleString("en-US")}`;

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

const seedBookings = () => [
  { id: 1, ref: "CZ-48213", name: "Tunde Bakare", phone: "08031234567", service: "Fade", date: dayKey(0), time: "10:00", status: "confirmed", paid: 6000, method: "Transfer", home: false, refunded: false },
  { id: 2, ref: "CZ-77120", name: "Emeka Obi", phone: "08099887766", service: "Classic Haircut", date: dayKey(0), time: "12:30", status: "pending", paid: 5000, method: "Card", home: false, refunded: false },
  { id: 3, ref: "CZ-31904", name: "David Adeyemi", phone: "07012345678", service: "Home Service", date: dayKey(0), time: "16:00", status: "confirmed", paid: 5000, method: "QR", home: true, refunded: false },
  { id: 4, ref: "CZ-90455", name: "Sola Martins", phone: "08123450987", service: "Beard Trim", date: dayKey(1), time: "11:00", status: "pending", paid: 3000, method: "USSD", home: false, refunded: false },
  { id: 5, ref: "CZ-12098", name: "Kelvin Okoro", phone: "09011223344", service: "Line-up & Shape-up", date: dayKey(-1), time: "15:00", status: "completed", paid: 2000, method: "Card", home: false, refunded: false },
  { id: 6, ref: "CZ-66512", name: "Ife Balogun", phone: "08077665544", service: "Fade", date: dayKey(-2), time: "13:00", status: "cancelled", paid: 6000, method: "Transfer", home: false, refunded: false },
  { id: 7, ref: "CZ-20871", name: "Chidi Nwosu", phone: "08055443322", service: "Classic Haircut", date: dayKey(-3), time: "09:30", status: "completed", paid: 5000, method: "Transfer", home: false, refunded: false },
];

const seedStyles = () => [
  { id: 1, title: "Low taper fade", category: "Fades", image: "", live: true },
  { id: 2, title: "Clean beard shape", category: "Beards", image: "", live: true },
  { id: 3, title: "Sharp line-up", category: "Line-ups", image: "", live: false },
];

const seedServices = () => [
  { id: "classic-haircut", name: "Classic Haircut", price: 5000, duration: 30 },
  { id: "fade", name: "Fade", price: 6000, duration: 45 },
  { id: "beard-trim", name: "Beard Trim", price: 3000, duration: 30 },
  { id: "lineup", name: "Line-up & Shape-up", price: 2000, duration: 30 },
  { id: "home-service", name: "Home Service", price: 15000, duration: 60 },
];

const Title = ({ children, sub }) => (
  <div className="mb-6">
    <h2 className="text-3xl font-bold italic text-black" style={serif}>
      {children}
    </h2>
    {sub && <p className="mt-1 text-sm text-black/60">{sub}</p>}
  </div>
);

const Stat = ({ label, value, note }) => (
  <div className="border border-black/10 bg-white p-5">
    <p className="text-sm text-black/60">{label}</p>
    <p className="mt-2 text-3xl font-extrabold text-black">{value}</p>
    {note && <p className="mt-1 text-xs text-black/50">{note}</p>}
  </div>
);

const Badge = ({ status }) => (
  <span className={`inline-block px-3 py-1 text-xs font-extrabold capitalize ${STATUS_CLASS[status]}`}>
    {status}
  </span>
);

const AdminPage = () => {
  const [tab, setTab] = useState("overview");
  const [bookings, setBookings] = useState(null);
  const [styles, setStyles] = useState(seedStyles);
  const [services, setServices] = useState(seedServices);
  const [filter, setFilter] = useState("all");
  const [draft, setDraft] = useState({ title: "", category: CATEGORIES[0], image: "" });

  useEffect(() => {
    setBookings(seedBookings());
  }, []);

  if (!bookings) {
    return <main className="min-h-screen bg-[#faf6ec] p-10 text-sm text-black/60">Loading dashboard...</main>;
  }

  const today = dayKey(0);
  const monthPrefix = today.slice(0, 7);

  const todays = bookings
    .filter((b) => b.date === today && b.status !== "cancelled")
    .sort((a, b) => a.time.localeCompare(b.time));
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const refundsDue = bookings.filter((b) => b.status === "cancelled" && b.paid > 0 && !b.refunded);
  const received = bookings
    .filter((b) => b.status !== "cancelled" && b.date.startsWith(monthPrefix))
    .reduce((sum, b) => sum + b.paid, 0);

  const visible = bookings
    .filter((b) => filter === "all" || b.status === filter)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  const payments = bookings
    .filter((b) => b.paid > 0)
    .sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));

  const setStatus = (id, status) =>
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, status } : b)));

  const markRefunded = (id) =>
    setBookings((list) => list.map((b) => (b.id === id ? { ...b, refunded: true } : b)));

  const pickImage = (e) => {
    const file = e.target.files?.[0];
    if (file) setDraft((d) => ({ ...d, image: URL.createObjectURL(file) }));
  };

  const addStyle = () => {
    if (!draft.title.trim() || !draft.image) return;
    setStyles((list) => [{ id: Date.now(), ...draft, title: draft.title.trim(), live: true }, ...list]);
    setDraft({ title: "", category: CATEGORIES[0], image: "" });
  };

  const toggleStyle = (id) =>
    setStyles((list) => list.map((s) => (s.id === id ? { ...s, live: !s.live } : s)));

  const removeStyle = (id) => setStyles((list) => list.filter((s) => s.id !== id));

  const editService = (id, field, value) =>
    setServices((list) =>
      list.map((s) => (s.id === id ? { ...s, [field]: Math.max(0, Number(value) || 0) } : s))
    );

  return (
    <main className="min-h-screen bg-[#faf6ec] lg:flex">
      <aside className="bg-black text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0">
        <div className="border-b-4 border-[#fdb515] px-6 py-6">
          <p className="text-2xl font-bold italic text-[#fdb515]" style={serif}>
            Owner Dashboard
          </p>
          <p className="mt-1 text-xs text-white/50">Sample data. Nothing is saved yet.</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-3 lg:flex-col">
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-3 px-4 py-3 text-sm font-bold transition ${
                tab === id ? "bg-[#fdb515] text-black" : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" aria-hidden />
              {label}
              {id === "bookings" && pendingCount > 0 && (
                <span className="ml-auto bg-white px-2 text-xs font-extrabold text-black">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
      </aside>

      <section className="min-w-0 flex-1 px-5 py-8 sm:px-10 sm:py-12">
        {tab === "overview" && (
          <div>
            <Title sub={dateLabel(today)}>Good day, here is the shop</Title>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Stat label="Bookings today" value={todays.length} />
              <Stat label="Waiting for confirmation" value={pendingCount} />
              <Stat label="Received this month" value={money(received)} />
              <Stat
                label="Refunds to send"
                value={refundsDue.length}
                note={refundsDue.length ? money(refundsDue.reduce((s, b) => s + b.paid, 0)) : "All clear"}
              />
            </div>

            <h3 className="mb-4 mt-10 text-xl font-bold italic text-black" style={serif}>
              Today&apos;s schedule
            </h3>
            {todays.length === 0 ? (
              <p className="border border-black/10 bg-white p-6 text-sm text-black/60">
                No bookings today. New bookings appear here as customers pay.
              </p>
            ) : (
              <ul className="space-y-3">
                {todays.map((b) => (
                  <li key={b.id} className="flex items-stretch border border-black/10 bg-white">
                    <span className="flex w-28 shrink-0 items-center justify-center bg-black text-sm font-extrabold text-[#fdb515]">
                      {timeLabel(b.time)}
                    </span>
                    <span className="flex flex-1 flex-wrap items-center justify-between gap-3 p-4">
                      <span>
                        <span className="block font-extrabold text-black">{b.name}</span>
                        <span className="text-sm text-black/60">
                          {b.service}
                          {b.home && " · at their home"}
                        </span>
                      </span>
                      <Badge status={b.status} />
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "bookings" && (
          <div>
            <Title sub="Confirm, complete or cancel bookings.">Bookings</Title>
            <div className="mb-5 flex flex-wrap gap-2">
              {["all", ...STATUSES].map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`border-2 px-4 py-2 text-xs font-extrabold capitalize transition ${
                    filter === f
                      ? "border-[#fdb515] bg-[#fdb515] text-black"
                      : "border-black/10 bg-white text-black hover:border-black/40"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {visible.length === 0 ? (
              <p className="border border-black/10 bg-white p-6 text-sm text-black/60">
                No {filter} bookings yet.
              </p>
            ) : (
              <ul className="space-y-3">
                {visible.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-4 border border-black/10 bg-white p-5">
                    <div className="min-w-[180px]">
                      <p className="font-extrabold text-black">{b.name}</p>
                      <a href={`tel:${b.phone}`} className="text-sm text-[#8a5f00] underline underline-offset-4">
                        {b.phone}
                      </a>
                    </div>
                    <div className="min-w-[160px] text-sm text-black/70">
                      <p className="font-bold text-black">{b.service}</p>
                      <p>
                        {dateLabel(b.date)}, {timeLabel(b.time)}
                      </p>
                      {b.home && <p className="text-xs font-bold text-[#8a5f00]">Home visit</p>}
                    </div>
                    <p className="text-sm font-extrabold text-black">{money(b.paid)}</p>
                    <select
                      aria-label={`Status for ${b.name}`}
                      value={b.status}
                      onChange={(e) => setStatus(b.id, e.target.value)}
                      className="border border-black/20 bg-white px-3 py-2 text-sm font-bold capitalize text-black outline-none focus:border-[#fdb515]"
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "payments" && (
          <div>
            <Title sub="Every payment from Paystack, with refunds you still owe.">Payments</Title>
            <div className="mb-6 grid gap-4 sm:grid-cols-2">
              <Stat label="Received this month" value={money(received)} />
              <Stat label="Refunds to send" value={money(refundsDue.reduce((s, b) => s + b.paid, 0))} />
            </div>

            <div className="overflow-x-auto border border-black/10 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="px-4 py-3 font-bold">Reference</th>
                    <th className="px-4 py-3 font-bold">Customer</th>
                    <th className="px-4 py-3 font-bold">Paid with</th>
                    <th className="px-4 py-3 font-bold">Amount</th>
                    <th className="px-4 py-3 font-bold">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/10">
                  {payments.map((b) => {
                    const owed = b.status === "cancelled" && !b.refunded;
                    return (
                      <tr key={b.id}>
                        <td className="px-4 py-3 font-bold text-black">{b.ref}</td>
                        <td className="px-4 py-3 text-black/70">{b.name}</td>
                        <td className="px-4 py-3 text-black/70">{b.method}</td>
                        <td className="px-4 py-3 font-extrabold text-black">{money(b.paid)}</td>
                        <td className="px-4 py-3">
                          {owed ? (
                            <button
                              type="button"
                              onClick={() => markRefunded(b.id)}
                              className="bg-red-100 px-3 py-1 text-xs font-extrabold text-red-700 hover:bg-red-200"
                            >
                              Refund due. Mark as sent
                            </button>
                          ) : b.refunded ? (
                            <span className="text-xs font-extrabold text-black/50">Refunded</span>
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
          </div>
        )}

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

            <ul className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {styles.map((s) => (
                <li key={s.id} className="border border-black/10 bg-white">
                  <div className="relative aspect-[4/3] bg-black">
                    {s.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={s.image} alt={s.title} className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full items-center justify-center px-4 text-center text-lg font-bold italic text-[#fdb515]" style={serif}>
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
                        className="flex h-10 w-10 items-center justify-center border border-black/20 text-black transition hover:bg-black hover:text-[#fdb515]"
                      >
                        {s.live ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStyle(s.id)}
                        aria-label="Delete style"
                        className="flex h-10 w-10 items-center justify-center border border-black/20 text-red-600 transition hover:bg-red-600 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "services" && (
          <div>
            <Title sub="Change prices and how long each service takes.">Services</Title>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.id} className="flex flex-wrap items-center justify-between gap-4 border border-black/10 bg-white p-5">
                  <p className="min-w-[180px] font-extrabold text-black">{s.name}</p>
                  <div className="flex gap-4">
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
};

export default AdminPage;