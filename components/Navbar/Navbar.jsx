"use client";

import { useState } from "react";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"] });

const links = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Reviews", href: "/reviews" },
  { label: "Our Team", href: "/team" },
  { label: "Gallery", href: "/gallery" },
  { label: "Booking", href: "/booking" },
  { label: "Blog", href: "/blog" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`${playfair.className} absolute inset-x-0 top-0 z-50 bg-gradient-to-b from-black/60 to-transparent`}
    >
      <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 lg:px-10">
        <Link
          href="/"
          className="text-2xl font-semibold uppercase tracking-[0.15em] text-white"
        >
          Comfort <span className="text-[#B89B5E]">Zone</span>
        </Link>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-base text-white transition-colors hover:text-[#B89B5E]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
          className="text-base uppercase tracking-widest text-white lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {open && (
        <ul className="flex flex-col gap-5 bg-black/70 px-6 py-6 backdrop-blur-md lg:hidden">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-lg text-white transition-colors hover:text-[#B89B5E]"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
};

export default Navbar;