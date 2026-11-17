"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, saveTokens, errorText } from "@/app/lib/api";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };
const input =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#fdb515]";

const LoginPage = () => {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getLocation = () =>
    new Promise((resolve, reject) => {
      if (!navigator.geolocation) return reject(new Error("no geolocation"));
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
          }),
        reject,
        { enableHighAccuracy: true, timeout: 15000 }
      );
    });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const creds = { username: form.username.trim(), password: form.password };
      let data;
      try {
        data = await api("/api/auth/login/", { method: "POST", body: creds });
      } catch (err) {
        if (!String(errorText(err)).includes("location access")) throw err;
        let coords;
        try {
          coords = await getLocation();
        } catch {
          throw {
            data: { detail: "Allow location access in your browser to sign in at the shop." },
          };
        }
        data = await api("/api/auth/login/", {
          method: "POST",
          body: { ...creds, ...coords },
        });
      }
      saveTokens(data);
      localStorage.setItem("user", JSON.stringify(data.user));
      const next = new URLSearchParams(window.location.search).get("next");
      const safe = next && next.startsWith("/") && !next.startsWith("//");
      const u = data.user;
      const home =
        u?.role === "admin" || u?.is_staff || u?.is_superuser
          ? "/internal"
          : u?.role === "barber"
          ? "/cz-crew"
          : "/booking";
      router.push(safe ? next : home);
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
          Welcome <span className="text-[#c98a00]">back</span>
        </h1>
        <p className="mt-2 text-sm text-black/60">Log in to book and pay.</p>

        <div className="mt-6 space-y-4">
          <input
            name="username"
            type="text"
            placeholder="Email"
            value={form.username}
            onChange={onChange}
            required
            className={input}
          />
          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={onChange}
              required
              className={`${input} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black/50 hover:text-black"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                  <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
                  <path d="m1 1 22 22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          style={slant}
          className="mt-6 w-full bg-black px-8 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-[#fdb515] hover:text-black disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        <p className="mt-5 text-center text-sm text-black/60">
          New here?{" "}
          <Link href="/signup" className="font-bold text-black underline">
            Create an account
          </Link>
        </p>
      </form>
    </main>
  );
};

export default LoginPage;