"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import AOS from "aos";
import "aos/dist/aos.css";
import { api, getTokens, errorText } from "@/app/lib/api";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Clock,
  ShieldCheck,
} from "lucide-react";

const HEADER_IMAGE = "/background.jpg";

const OPEN_HOURS = { default: [8, 18] };

const MAX_MONTHS_AHEAD = 3;
const MINUTE_STEP = 5;
const MIN_NOTICE_MINUTES = 30;
const HOLD_MINUTES = 10;
const CANCEL_HOURS = 3;

const STEPS = ["Service", "Date & time", "Your details", "Pay"];
const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const HOURS_12 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
const MINUTES = Array.from({ length: 60 / MINUTE_STEP }, (_, i) => i * MINUTE_STEP);
const PEOPLE = [1, 2, 3, 4, 5, 6];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const inputClass =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-[#fdb515] focus:ring-2 focus:ring-[#fdb515]/40";

const pad = (n) => String(n).padStart(2, "0");
const dateValue = (y, m, d) => y * 10000 + m * 100 + d;
const money = (n) => `₦${n.toLocaleString("en-US")}`;

const priceLabel = (service) =>
  service.from ? `From ${money(service.price)}` : money(service.price);

const minutesLabel = (total) => {
  const h = Math.floor(total / 60);
  const m = total % 60;
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${pad(m)} ${suffix}`;
};

const prettyDate = (day) =>
  `${DAY_NAMES[day.dow]}, ${day.dayNum} ${MONTH_NAMES[day.month].slice(0, 3)} ${day.year}`;

const barberName = (b) => `${b.first_name} ${b.last_name}`.trim() || `Barber ${b.id}`;

const isHome = (name) => /home/i.test(name);

const toService = (s) => ({
  id: s.id,
  name: s.name,
  price: Number(s.price),
  duration: s.duration_minutes,
  home: isHome(s.name),
  from: isHome(s.name),
});

const createBooking = async ({ barber, service, date, time, notes }) => {
  const booking = await api("/api/bookings/", {
    method: "POST",
    auth: true,
    body: { barber, service, date, start_time: `${time}:00`, notes },
  });
  try {
    const pay = await api("/api/payments/initialize/", {
      method: "POST",
      auth: true,
      body: { booking: booking.id },
    });
    return { reference: pay.reference, authorizationUrl: pay.authorization_url };
  } catch (err) {
    await api(`/api/bookings/${booking.id}/cancel/`, {
      method: "POST",
      auth: true,
    }).catch(() => null);
    throw err;
  }
};

const BookingPage = () => {
  const router = useRouter();

  const [today, setToday] = useState(null);
  const [view, setView] = useState(null);
  const [step, setStep] = useState(0);
  const [service, setService] = useState(null);
  const [day, setDay] = useState(null);
  const [hour12, setHour12] = useState(null);
  const [minute, setMinute] = useState(null);
  const [ampm, setAmpm] = useState(null);
  const [details, setDetails] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    area: "",
    people: "1",
    notes: "",
  });
  const [showNote, setShowNote] = useState(false);
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [barber, setBarber] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  useEffect(() => {
    const now = new Date();
    setToday({
      y: now.getFullYear(),
      m: now.getMonth(),
      d: now.getDate(),
      minutes: now.getHours() * 60 + now.getMinutes(),
    });
    setView({ y: now.getFullYear(), m: now.getMonth() });
  }, []);

  useEffect(() => {
    if (!getTokens()) {
      router.replace("/login?next=/booking");
      return;
    }
    api("/api/services/")
      .then((list) => setServices(list.map(toService)))
      .catch(() => setServices([]));
    api("/api/barbers/")
      .then((list) => {
        setBarbers(list);
        if (list.length === 1) setBarber(list[0]);
      })
      .catch(() => setBarbers([]));
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user) {
        setDetails((d) => ({
          ...d,
          name: `${user.first_name} ${user.last_name}`.trim(),
          phone: user.phone || "",
          email: user.email || "",
        }));
      }
    } catch (e) {
      return;
    }
  }, [router]);

  const monthDiff = today && view ? (view.y - today.y) * 12 + (view.m - today.m) : 0;
  const canGoPrev = monthDiff > 0;
  const canGoNext = monthDiff < MAX_MONTHS_AHEAD;

  const goMonth = (delta) =>
    setView((v) => {
      const index = v.y * 12 + v.m + delta;
      return { y: Math.floor(index / 12), m: index % 12 };
    });

  const monthOptions = today
    ? Array.from({ length: MAX_MONTHS_AHEAD + 1 }, (_, i) => {
        const index = today.y * 12 + today.m + i;
        return { y: Math.floor(index / 12), m: index % 12 };
      })
    : [];

  const firstWeekday = view ? new Date(view.y, view.m, 1).getDay() : 0;
  const daysInMonth = view ? new Date(view.y, view.m + 1, 0).getDate() : 0;
  const calendarCells = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const chooseDate = (d) => {
    const dow = new Date(view.y, view.m, d).getDay();
    setDay({
      key: `${view.y}-${pad(view.m + 1)}-${pad(d)}`,
      year: view.y,
      month: view.m,
      dayNum: d,
      dow,
      isToday:
        dateValue(view.y, view.m, d) === dateValue(today.y, today.m, today.d),
    });
  };

  const timeChosen = hour12 !== null && minute !== null && ampm !== null;
  const timeMinutes = timeChosen
    ? ((hour12 % 12) + (ampm === "PM" ? 12 : 0)) * 60 + minute
    : null;
  const time24 = timeChosen
    ? `${pad(Math.floor(timeMinutes / 60))}:${pad(timeMinutes % 60)}`
    : null;

  let timeError = "";
  if (day && service && timeChosen) {
    const [openH, closeH] = OPEN_HOURS[day.dow] || OPEN_HOURS.default;
    const open = openH * 60;
    const close = closeH * 60;
    const latest = close - service.duration;

    if (timeMinutes < open || timeMinutes > latest) {
      timeError = `We are open ${minutesLabel(open)} to ${minutesLabel(close)} that day. For this service, the last start time is ${minutesLabel(latest)}.`;
    } else if (day.isToday && today && timeMinutes < today.minutes + MIN_NOTICE_MINUTES) {
      timeError = `Please choose a time at least ${MIN_NOTICE_MINUTES} minutes from now.`;
    }
  }

  const dateTimeOk = Boolean(day && timeChosen && !timeError);

  const updateDetail = (field) => (e) =>
    setDetails((d) => ({ ...d, [field]: e.target.value }));

  const phoneOk = details.phone.replace(/\D/g, "").length >= 10;
  const emailOk = /^\S+@\S+\.\S+$/.test(details.email.trim());
  const homeOk =
    !service?.home ||
    (details.address.trim().length > 4 && details.area.trim().length > 1);
  const detailsOk = details.name.trim().length > 1 && phoneOk && emailOk && homeOk;

  const canContinue =
    (step === 0 && service && barber) ||
    (step === 1 && dateTimeOk) ||
    (step === 2 && detailsOk);

  const pay = async () => {
    setPaying(true);
    setPayError("");
    try {
      const homeNote = service.home
        ? `Home service: ${details.address.trim()}, ${details.area.trim()}. People: ${details.people}.`
        : "";
      const response = await createBooking({
        barber: barber.id,
        service: service.id,
        date: day.key,
        time: time24,
        notes: [homeNote, details.notes.trim()].filter(Boolean).join(" "),
      });
      window.location.href = response.authorizationUrl;
    } catch (err) {
      if (err.status === 401) {
        router.push("/login?next=/booking");
        return;
      }
      setPayError(errorText(err));
      setPaying(false);
    }
  };

  const choiceClass = (selected) =>
    `border-2 py-2.5 text-sm font-bold transition ${
      selected
        ? "border-[#fdb515] bg-[#fdb515] text-black"
        : "border-black/10 text-black hover:border-black/40"
    }`;

  const labelClass =
    "mb-2 block text-xs font-extrabold uppercase tracking-wider text-black";

  return (
    <main>
      <section className="relative flex min-h-[60vh] items-center justify-center overflow-hidden border-b-4 border-[#fdb515] bg-black px-6 pb-16 pt-32 text-center text-white">
        <Image
          src={HEADER_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />

        <div className="relative z-10">
          <p
            data-aos="fade-down"
            className="text-sm font-bold uppercase tracking-[0.3em] text-[#fdb515] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          >
            Reserve your seat
          </p>
          <h1
            data-aos="fade-up"
            className="mt-3 text-5xl font-bold italic drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-7xl"
            style={serif}
          >
            Book <span className="text-[#fdb515]">Now</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-4 max-w-xl text-base text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            Pick a service, choose the date and time you want, and pay online.
            You will get a confirmation by email.
          </p>
        </div>
      </section>

      <section className="bg-[#faf6ec] px-6 py-14 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <ol className="mx-auto mb-10 grid max-w-3xl grid-cols-4 gap-2">
            {STEPS.map((label, i) => (
              <li key={label} className="text-center">
                <span
                  className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold ${
                    i < step
                      ? "bg-black text-[#fdb515]"
                      : i === step
                      ? "bg-[#fdb515] text-black"
                      : "border border-black/20 bg-white text-black/40"
                  }`}
                >
                  {i < step ? <Check className="h-5 w-5" aria-hidden /> : i + 1}
                </span>
                <span
                  className={`mt-2 block text-[11px] font-bold uppercase tracking-wider sm:text-xs ${
                    i === step ? "text-black" : "text-black/40"
                  }`}
                >
                  {label}
                </span>
              </li>
            ))}
          </ol>

          <div className="grid gap-8 lg:grid-cols-3">
            <div className="border border-black/10 bg-white p-6 sm:p-10 lg:col-span-2">
              {step === 0 && (
                <div>
                  <h2
                    className="text-2xl font-bold italic text-black sm:text-3xl"
                    style={serif}
                  >
                    Choose a service
                  </h2>

                  {services.length === 0 && (
                    <p className="mt-6 text-sm text-black/60">Loading services...</p>
                  )}

                  <ul className="mt-6 space-y-3">
                    {services.map((s) => (
                      <li key={s.id}>
                        <button
                          type="button"
                          onClick={() => setService(s)}
                          className={`flex w-full items-center justify-between gap-4 border-2 p-5 text-left transition ${
                            service?.id === s.id
                              ? "border-[#fdb515] bg-[#fdb515]/10"
                              : "border-black/10 hover:border-black/40"
                          }`}
                        >
                          <span>
                            <span className="block text-base font-extrabold uppercase tracking-wide text-black">
                              {s.name}
                            </span>
                            <span className="mt-1 flex items-center gap-1.5 text-sm text-black/60">
                              <Clock className="h-4 w-4 text-[#c98a00]" aria-hidden />
                              {s.duration} min
                              {s.home && " · at your home"}
                            </span>
                          </span>
                          <span className="shrink-0 bg-[#fdb515] px-3 py-1 text-sm font-extrabold text-black">
                            {priceLabel(s)}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>

                  {barbers.length > 1 && (
                    <div className="mt-10">
                      <h2
                        className="text-2xl font-bold italic text-black sm:text-3xl"
                        style={serif}
                      >
                        Choose your barber
                      </h2>
                      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                        {barbers.map((b) => (
                          <li key={b.id}>
                            <button
                              type="button"
                              onClick={() => setBarber(b)}
                              className={`w-full border-2 p-5 text-left transition ${
                                barber?.id === b.id
                                  ? "border-[#fdb515] bg-[#fdb515]/10"
                                  : "border-black/10 hover:border-black/40"
                              }`}
                            >
                              <span className="block text-base font-extrabold uppercase tracking-wide text-black">
                                {barberName(b)}
                              </span>
                              {b.bio && (
                                <span className="mt-1 block text-sm text-black/60">
                                  {b.bio}
                                </span>
                              )}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2
                    className="text-2xl font-bold italic text-black sm:text-3xl"
                    style={serif}
                  >
                    Pick a date and time
                  </h2>

                  {!today || !view ? (
                    <p className="mt-6 text-sm text-black/60">Loading calendar...</p>
                  ) : (
                    <>
                      <p className="mt-6 text-xs font-extrabold uppercase tracking-wider text-black">
                        Date
                      </p>

                      <div className="mt-3 border border-black/10 p-4">
                        <div className="flex items-center justify-between gap-2">
                          <button
                            type="button"
                            onClick={() => goMonth(-1)}
                            disabled={!canGoPrev}
                            aria-label="Previous month"
                            className="flex h-10 w-10 items-center justify-center border border-black/20 text-black transition hover:bg-black hover:text-[#fdb515] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                          >
                            <ChevronLeft className="h-5 w-5" aria-hidden />
                          </button>

                          <select
                            aria-label="Choose month"
                            value={`${view.y}-${view.m}`}
                            onChange={(e) => {
                              const [y, m] = e.target.value.split("-").map(Number);
                              setView({ y, m });
                            }}
                            className="border border-black/20 bg-white px-3 py-2 text-sm font-extrabold uppercase tracking-wider text-black outline-none focus:border-[#fdb515]"
                          >
                            {monthOptions.map((o) => (
                              <option key={`${o.y}-${o.m}`} value={`${o.y}-${o.m}`}>
                                {MONTH_NAMES[o.m]} {o.y}
                              </option>
                            ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => goMonth(1)}
                            disabled={!canGoNext}
                            aria-label="Next month"
                            className="flex h-10 w-10 items-center justify-center border border-black/20 text-black transition hover:bg-black hover:text-[#fdb515] disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-black"
                          >
                            <ChevronRight className="h-5 w-5" aria-hidden />
                          </button>
                        </div>

                        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                          {WEEKDAYS.map((w) => (
                            <span
                              key={w}
                              className="py-2 text-[11px] font-extrabold uppercase tracking-wider text-black/50"
                            >
                              {w}
                            </span>
                          ))}

                          {calendarCells.map((d, i) => {
                            if (d === null) return <span key={`blank-${i}`} />;

                            const past =
                              dateValue(view.y, view.m, d) <
                              dateValue(today.y, today.m, today.d);
                            const isToday =
                              dateValue(view.y, view.m, d) ===
                              dateValue(today.y, today.m, today.d);
                            const selected =
                              day &&
                              day.year === view.y &&
                              day.month === view.m &&
                              day.dayNum === d;

                            return (
                              <button
                                key={d}
                                type="button"
                                disabled={past}
                                onClick={() => chooseDate(d)}
                                className={`aspect-square text-sm font-bold transition ${
                                  selected
                                    ? "bg-[#fdb515] text-black"
                                    : past
                                    ? "cursor-not-allowed text-black/20"
                                    : isToday
                                    ? "border-2 border-[#fdb515] text-black hover:bg-[#fdb515]/20"
                                    : "text-black hover:bg-black hover:text-[#fdb515]"
                                }`}
                              >
                                {d}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <p className="mt-8 text-xs font-extrabold uppercase tracking-wider text-black">
                        Time{" "}
                        <span className="font-semibold normal-case text-black/50">
                          (Lagos time, any time you like)
                        </span>
                      </p>

                      <div className="mt-3 space-y-5 border border-black/10 p-4">
                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-black/50">
                            Hour
                          </p>
                          <ul className="grid grid-cols-6 gap-2">
                            {HOURS_12.map((h) => (
                              <li key={h}>
                                <button
                                  type="button"
                                  onClick={() => setHour12(h)}
                                  className={`w-full ${choiceClass(hour12 === h)}`}
                                >
                                  {h}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-black/50">
                            Minutes
                          </p>
                          <ul className="grid grid-cols-6 gap-2">
                            {MINUTES.map((m) => (
                              <li key={m}>
                                <button
                                  type="button"
                                  onClick={() => setMinute(m)}
                                  className={`w-full ${choiceClass(minute === m)}`}
                                >
                                  {pad(m)}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className="mb-2 text-[11px] font-bold uppercase tracking-wider text-black/50">
                            AM / PM
                          </p>
                          <ul className="grid max-w-xs grid-cols-2 gap-2">
                            {["AM", "PM"].map((p) => (
                              <li key={p}>
                                <button
                                  type="button"
                                  onClick={() => setAmpm(p)}
                                  className={`w-full ${choiceClass(ampm === p)}`}
                                >
                                  {p}
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {timeChosen && !timeError && day && (
                        <p className="mt-4 text-sm font-semibold text-black">
                          Your time: {minutesLabel(timeMinutes)} on {prettyDate(day)}
                        </p>
                      )}
                      {!day && (
                        <p className="mt-4 text-sm text-black/60">
                          Choose a date first, then your time.
                        </p>
                      )}
                      {timeError && (
                        <p className="mt-4 text-sm font-semibold text-red-600">
                          {timeError}
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2
                    className="text-2xl font-bold italic text-black sm:text-3xl"
                    style={serif}
                  >
                    Your details
                  </h2>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label htmlFor="name" className={labelClass}>
                        Full name
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={details.name}
                        onChange={updateDetail("name")}
                        placeholder="Your name"
                        className={inputClass}
                      />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <div>
                        <label htmlFor="phone" className={labelClass}>
                          Phone number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          value={details.phone}
                          onChange={updateDetail("phone")}
                          placeholder="080..."
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className={labelClass}>
                          Email
                        </label>
                        <input
                          id="email"
                          type="email"
                          value={details.email}
                          onChange={updateDetail("email")}
                          placeholder="you@email.com"
                          className={inputClass}
                        />
                        <p className="mt-1 text-[11px] text-black/50">
                          Your confirmation is sent here.
                        </p>
                      </div>
                    </div>

                    {service?.home && (
                      <div className="space-y-5 border-l-4 border-[#fdb515] bg-[#fdb515]/10 p-5">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-black">
                          Where should we come?
                        </p>
                        <div>
                          <label htmlFor="address" className={labelClass}>
                            Home address
                          </label>
                          <input
                            id="address"
                            type="text"
                            value={details.address}
                            onChange={updateDetail("address")}
                            placeholder="House number, street"
                            className={inputClass}
                          />
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                          <div>
                            <label htmlFor="area" className={labelClass}>
                              Area
                            </label>
                            <input
                              id="area"
                              type="text"
                              value={details.area}
                              onChange={updateDetail("area")}
                              placeholder="e.g. Lekki, Ikeja"
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label htmlFor="people" className={labelClass}>
                              People to be served
                            </label>
                            <select
                              id="people"
                              value={details.people}
                              onChange={updateDetail("people")}
                              className={inputClass}
                            >
                              {PEOPLE.map((n) => (
                                <option key={n} value={n}>
                                  {n}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>
                    )}

                    {showNote ? (
                      <div>
                        <label htmlFor="notes" className={labelClass}>
                          Note
                        </label>
                        <textarea
                          id="notes"
                          rows={3}
                          value={details.notes}
                          onChange={updateDetail("notes")}
                          placeholder="Anything we should know, like the style you want."
                          className={inputClass}
                        />
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setShowNote(true)}
                        className="text-xs font-extrabold uppercase tracking-wider text-[#c98a00] underline underline-offset-4 hover:text-black"
                      >
                        + Add a note
                      </button>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2
                    className="text-2xl font-bold italic text-black sm:text-3xl"
                    style={serif}
                  >
                    Check and pay
                  </h2>

                  <ul className="mt-6 divide-y divide-black/10 border border-black/10 text-sm text-black/80">
                    <li className="flex justify-between gap-4 p-4">
                      <span className="font-bold text-black">Service</span>
                      {service.name}
                    </li>
                    {barber && (
                      <li className="flex justify-between gap-4 p-4">
                        <span className="font-bold text-black">Barber</span>
                        {barberName(barber)}
                      </li>
                    )}
                    <li className="flex justify-between gap-4 p-4">
                      <span className="font-bold text-black">When</span>
                      <span className="text-right">
                        {prettyDate(day)}, {minutesLabel(timeMinutes)}
                      </span>
                    </li>
                    <li className="flex justify-between gap-4 p-4">
                      <span className="font-bold text-black">Name</span>
                      {details.name}
                    </li>
                    <li className="flex justify-between gap-4 p-4">
                      <span className="font-bold text-black">Email</span>
                      {details.email}
                    </li>
                    {service.home && (
                      <li className="flex justify-between gap-4 p-4">
                        <span className="font-bold text-black">Address</span>
                        <span className="text-right">
                          {details.address}, {details.area}
                        </span>
                      </li>
                    )}
                  </ul>

                  <div className="mt-6 flex items-end justify-between gap-4 bg-black p-5 text-white">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-white/60">
                        Pay now
                      </p>
                      <p className="text-3xl font-extrabold text-[#fdb515]">
                        {money(service.price)}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 flex items-start gap-2 text-xs text-black/60">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#c98a00]" aria-hidden />
                    Secure payment by Paystack. Pay by QR code, bank transfer,
                    card or USSD. We hold your time for {HOLD_MINUTES} minutes
                    after you tap Pay. Cancel at least {CANCEL_HOURS} hours
                    before for a refund.
                  </p>

                  {payError && (
                    <p className="mt-4 text-sm font-semibold text-red-600">{payError}</p>
                  )}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-4">
                {step > 0 ? (
                  <button
                    type="button"
                    disabled={paying}
                    onClick={() => setStep((s) => s - 1)}
                    className="flex items-center gap-1 border-2 border-black/30 px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden />
                    Back
                  </button>
                ) : (
                  <span />
                )}

                {step < 3 ? (
                  <button
                    type="button"
                    disabled={!canContinue}
                    onClick={() => setStep((s) => s + 1)}
                    style={slant}
                    className="flex items-center gap-1 bg-[#fdb515] px-10 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-[#fdb515] disabled:hover:text-black"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={paying}
                    onClick={pay}
                    style={slant}
                    className="flex items-center gap-2 bg-[#fdb515] px-10 py-3.5 text-xs font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {paying ? "Please wait..." : `Pay ${money(service.price)}`}
                  </button>
                )}
              </div>
            </div>

            <aside className="h-fit border border-black/10 bg-black p-6 text-white lg:sticky lg:top-28">
              <h3
                className="text-xl font-bold italic text-[#fdb515]"
                style={serif}
              >
                Your booking
              </h3>
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Service
                  </span>
                  <span className="font-semibold">
                    {service ? service.name : "Not chosen yet"}
                  </span>
                </li>
                <li>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Date
                  </span>
                  <span className="font-semibold">
                    {day ? prettyDate(day) : "Not chosen yet"}
                  </span>
                </li>
                <li>
                  <span className="block text-[11px] font-bold uppercase tracking-wider text-white/50">
                    Time
                  </span>
                  <span className="font-semibold">
                    {timeChosen ? minutesLabel(timeMinutes) : "Not chosen yet"}
                  </span>
                </li>
                {service && (
                  <li className="border-t border-white/15 pt-4">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-white/50">
                      Price ({service.duration} min)
                    </span>
                    <span className="text-2xl font-extrabold text-[#fdb515]">
                      {priceLabel(service)}
                    </span>
                  </li>
                )}
              </ul>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
};

export default BookingPage;