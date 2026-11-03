"use client";

import { useEffect, useState } from "react";
import { api, errorText } from "@/app/lib/api";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };
const input =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#fdb515]";

const naira = (n) => `₦${Number(n || 0).toLocaleString("en-NG")}`;

const PayPage = () => {
  const [services, setServices] = useState([]);
  const [selected, setSelected] = useState(null);
  const [other, setOther] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api("/api/services/")
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const amount =
    selected === "other"
      ? Number(other)
      : Number(services.find((s) => s.id === selected)?.price || 0);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selected) return setError("Please choose a service or enter an amount.");
    if (!amount || amount < 100) return setError("Minimum amount is ₦100.");

    setLoading(true);
    try {
      const data = await api("/api/payments/quick/", {
        method: "POST",
        body: {
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          amount,
        },
      });
      window.location.href = data.authorization_url;
    } catch (err) {
      setError(errorText(err));
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf6ec] px-6 pb-16 pt-32">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-black/10 bg-white p-8">
        <h1 className="text-3xl font-bold italic text-black" style={serif}>
          Pay for your <span className="text-[#c98a00]">service</span>
        </h1>
        <p className="mt-2 text-sm text-black/60">
          Choose what you got, enter your details and pay securely.
        </p>

        <div className="mt-6 space-y-2">
          {services.map((s) => (
            <button
              type="button"
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`flex w-full items-center justify-between border px-4 py-3 text-left text-sm transition ${
                selected === s.id
                  ? "border-[#fdb515] bg-[#fdb515]/15"
                  : "border-black/20 bg-white hover:border-black"
              }`}
            >
              <span className="font-bold text-black">{s.name}</span>
              <span className="font-extrabold text-black">{naira(s.price)}</span>
            </button>
          ))}

          <button
            type="button"
            onClick={() => setSelected("other")}
            className={`flex w-full items-center justify-between border px-4 py-3 text-left text-sm transition ${
              selected === "other"
                ? "border-[#fdb515] bg-[#fdb515]/15"
                : "border-black/20 bg-white hover:border-black"
            }`}
          >
            <span className="font-bold text-black">Other amount</span>
          </button>

          {selected === "other" && (
            <input
              type="number"
              min="100"
              placeholder="Enter amount in ₦"
              value={other}
              onChange={(e) => setOther(e.target.value)}
              className={input}
            />
          )}
        </div>

        <div className="mt-6 space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Full name"
            value={form.name}
            onChange={onChange}
            required
            className={input}
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={onChange}
            required
            className={input}
          />
          <input
            name="phone"
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={onChange}
            className={input}
          />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-black/10 pt-5">
          <span className="text-sm font-semibold text-black/60">Total</span>
          <span className="text-2xl font-extrabold text-black">{naira(amount)}</span>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={slant}
          className="mt-6 w-full bg-black px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-[#fdb515] hover:text-black disabled:opacity-60"
        >
          {loading ? "Please wait..." : "Pay now"}
        </button>
      </form>
    </main>
  );
};

export default PayPage;