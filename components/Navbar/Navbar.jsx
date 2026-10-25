"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Barlow } from "next/font/google";

const barlow = Barlow({ subsets: ["latin"], weight: ["500", "600", "700", "800"] });

const links = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const isActive = (href) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className={`${barlow.className} fixed inset-x-0 top-0 z-50`}>
      {/* Navbar */}
      <header
        className={`transition-colors duration-300 ${
          scrolled || open
            ? "border-b border-white/10 bg-black/90 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-4 md:px-8">
          {/* Logo: swap CZ for the real logo image later */}
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-bold text-black">
              CZ
            </span>
            <span className="text-xl font-extrabold uppercase tracking-wide text-white">
              Comfort Zone
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`border-b-2 pb-1 text-[13px] font-bold uppercase tracking-widest transition-colors hover:border-white/60 hover:text-white ${
                    isActive(link.href)
                      ? "border-white text-white"
                      : "border-transparent text-white/75"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-[13px] font-bold uppercase tracking-widest text-white/80 hover:text-white md:block"
            >
              Login
            </Link>
            <Link
              href="/booking"
              className="-skew-x-12 bg-[#f7b500] px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-black transition hover:bg-white"
            >
              <span className="inline-block skew-x-12">Book Now</span>
            </Link>

            <button
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-md border border-white/30 text-white lg:hidden"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>

        {/* Mobile menu */}
        {open && (
          <ul className="border-t border-white/10 px-4 pb-4 lg:hidden">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3 text-sm font-bold uppercase tracking-widest ${
                    isActive(link.href) ? "text-white" : "text-white/70"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/login"
                className="block py-3 text-sm font-bold uppercase tracking-widest text-white/70"
              >
                Login
              </Link>
            </li>
          </ul>
        )}
      </header>
    </div>
  );
};

export default Navbar;