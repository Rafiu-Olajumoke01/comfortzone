"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, saveTokens, errorText } from "@/app/lib/api";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };
const input =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#fdb515]";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const email = form.email.trim().toLowerCase();
      await api("/api/auth/register/", {
        method: "POST",
        body: { ...form, email },
      });
      const data = await api("/api/auth/login/", {
        method: "POST",
        body: { username: email, password: form.password },
      });
      saveTokens(data);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/booking");
    } catch (err) {
      setError(errorText(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#faf6ec] px-6 pb-16 pt-32">
      <form onSubmit={onSubmit} className="w-full max-w-md border border-black/10 bg-white p-8">
        <h1 className="text-3xl font-bold italic text-black" style={serif}>
          Create your <span className="text-[#c98a00]">account</span>
        </h1>
        <p className="mt-2 text-sm text-black/60">It takes a minute.</p>

        <div className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              placeholder="First name"
              value={form.first_name}
              onChange={onChange}
              required
              className={input}
            />
            <input
              name="last_name"
              placeholder="Last name"
              value={form.last_name}
              onChange={onChange}
              className={input}
            />
          </div>
          <input
            name="phone"
            type="tel"
            placeholder="Phone number"
            value={form.phone}
            onChange={onChange}
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
            name="password"
            type="password"
            placeholder="Password (at least 8 characters)"
            value={form.password}
            onChange={onChange}
            required
            className={input}
          />
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={slant}
          className="mt-6 w-full bg-black px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-[#fdb515] hover:text-black disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>

        <p className="mt-5 text-center text-sm text-black/60">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-black underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}