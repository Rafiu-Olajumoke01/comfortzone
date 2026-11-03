"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { api, saveTokens, errorText } from "@/app/lib/api";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };
const input =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm outline-none focus:border-[#fdb515]";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
      const home = data.user?.role === "barber" ? "/cz-crew" : "/booking";
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
          <input
            name="password"
            type="password"
            placeholder="Password"
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
}