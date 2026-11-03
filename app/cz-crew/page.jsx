"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api, clearTokens, errorText, getTokens } from "@/app/lib/api";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const naira = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;
const hhmm = (t) => String(t || "").slice(0, 5);
const todayStr = () => new Date().toLocaleDateString("en-CA");

const statusStyle = {
  pending: "bg-black/10 text-black",
  confirmed: "bg-[#fdb515] text-black",
  completed: "bg-green-600 text-white",
  cancelled: "bg-red-100 text-red-700",
};

const BarberDashboard = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [signedInAt, setSignedInAt] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    let saved = null;
    try {
      saved = JSON.parse(localStorage.getItem("user"));
    } catch {
      saved = null;
    }

    if (!getTokens() || !saved || saved.role !== "barber") {
      router.replace("/login?next=/cz-crew");
      return;
    }
    setUser(saved);

    Promise.all([
      api("/api/bookings/", { auth: true }),
      api("/api/auth/attendance/today/", { auth: true }),
    ])
      .then(([list, attendance]) => {
        const all = Array.isArray(list) ? list : list.results || [];
        setBookings(all.filter((b) => b.date === todayStr()));
        setSignedInAt(attendance.signed_in_at);
      })
      .catch((err) => setError(errorText(err)))
      .finally(() => setLoading(false));
  }, [router]);

  const updateStatus = async (id, status) => {
    setError("");
    setBusyId(id);
    try {
      const updated = await api(`/api/bookings/${id}/status/`, {
        method: "POST",
        body: { status },
        auth: true,
      });
      setBookings((prev) => prev.map((b) => (b.id === id ? updated : b)));
    } catch (err) {
      setError(errorText(err));
    } finally {
      setBusyId(null);
    }
  };

  const logout = () => {
    clearTokens();
    router.push("/login");
  };

  const done = bookings.filter((b) => b.status === "completed").length;
  const resumed = signedInAt
    ? new Date(signedInAt).toLocaleTimeString("en-NG", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Not signed in yet";

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#faf6ec] px-6 pb-16 pt-32">
      <div className="mx-auto max-w-3xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold italic text-black" style={serif}>
              Hello, <span className="text-[#c98a00]">{user.first_name || user.username}</span>
            </h1>
            <p className="mt-1 text-sm text-black/60">
              {new Date().toLocaleDateString("en-NG", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-bold uppercase tracking-widest text-black/60 hover:text-black"
          >
            Log out
          </button>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black/50">Resumed</p>
            <p className="mt-1 text-base font-extrabold text-black">{resumed}</p>
          </div>
          <div className="border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black/50">Today</p>
            <p className="mt-1 text-base font-extrabold text-black">{bookings.length} bookings</p>
          </div>
          <div className="border border-black/10 bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-black/50">Done</p>
            <p className="mt-1 text-base font-extrabold text-black">{done}</p>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <h2 className="mt-10 text-2xl font-bold italic text-black" style={serif}>
          Today&apos;s bookings
        </h2>

        <div className="mt-4 space-y-3">
          {loading && <p className="text-sm text-black/60">Loading...</p>}

          {!loading && bookings.length === 0 && (
            <p className="border border-black/10 bg-white p-6 text-sm text-black/60">
              No bookings for today.
            </p>
          )}

          {bookings.map((b) => (
            <article key={b.id} className="border border-black/10 bg-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-extrabold text-black">
                    {hhmm(b.start_time)} - {hhmm(b.end_time)}
                  </p>
                  <p className="mt-1 text-sm font-bold text-black">{b.customer_name}</p>
                  <p className="text-sm text-black/60">{b.service_name}</p>
                  {b.notes && <p className="mt-2 text-sm text-black/60">Note: {b.notes}</p>}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${
                      statusStyle[b.status] || statusStyle.pending
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-xs font-bold text-black/60">
                    {b.is_paid ? "Paid" : "Not paid"}
                  </span>
                </div>
              </div>

              {(b.status === "pending" || b.status === "confirmed") && (
                <button
                  onClick={() =>
                    updateStatus(b.id, b.status === "pending" ? "confirmed" : "completed")
                  }
                  disabled={busyId === b.id}
                  style={slant}
                  className="mt-4 bg-black px-8 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-[#fdb515] hover:text-black disabled:opacity-60"
                >
                  {busyId === b.id
                    ? "Please wait..."
                    : b.status === "pending"
                    ? "Confirm booking"
                    : "Mark completed"}
                </button>
              )}
            </article>
          ))}
        </div>
      </div>
    </main>
  );
};

export default BarberDashboard;