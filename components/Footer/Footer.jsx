"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, MapPin, MessageCircle, Phone } from "lucide-react";

// SAMPLE DETAILS: replace with the shop's real information
const SHOP = {
  address: "Shop address, Lagos, Nigeria",
  phone: "+234 800 000 0000",
  whatsapp: "234XXXXXXXXXX", // country code first, no + or spaces
  hours: [
    { days: "Mon - Sat", time: "9:00 AM - 8:00 PM" },
    { days: "Sunday", time: "2:00 PM - 7:00 PM" },
  ],
};

// Replace the "#" with the real page links
const SOCIALS = [
  { label: "Instagram", href: "#" },
  { label: "TikTok", href: "#" },
  { label: "Facebook", href: "#" },
];

const QUICK_LINKS = [
  { label: "Home", href: "/" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Footer = () => {
  const [year, setYear] = useState(2026);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-black text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-sm font-extrabold text-black">
              CZ
            </span>
            <span className="text-xl font-extrabold uppercase tracking-wide">
              Comfort Zone
            </span>
          </Link>
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/70">
            Sharp cuts, clean beards and a relaxed atmosphere. Walk in, sit
            back and leave looking your best.
          </p>

          <ul className="mt-6 flex flex-wrap gap-3">
            {SOCIALS.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-white/30 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/80 transition hover:border-[#fdb515] hover:text-[#fdb515]"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#fdb515]">
            Quick Links
          </h3>
          <ul className="mt-5 space-y-3">
            {QUICK_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="text-sm font-semibold uppercase tracking-wider text-white/70 transition hover:text-[#fdb515]"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Opening hours */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#fdb515]">
            Opening Hours
          </h3>
          <ul className="mt-5 space-y-4">
            {SHOP.hours.map(({ days, time }) => (
              <li key={days} className="flex items-start gap-3 text-sm">
                <Clock
                  className="mt-0.5 h-4 w-4 shrink-0 text-[#fdb515]"
                  aria-hidden
                />
                <span>
                  <span className="block font-bold">{days}</span>
                  <span className="block text-white/70">{time}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.25em] text-[#fdb515]">
            Find Us
          </h3>
          <ul className="mt-5 space-y-4 text-sm text-white/70">
            <li className="flex items-start gap-3">
              <MapPin
                className="mt-0.5 h-4 w-4 shrink-0 text-[#fdb515]"
                aria-hidden
              />
              {SHOP.address}
            </li>
            <li className="flex items-start gap-3">
              <Phone
                className="mt-0.5 h-4 w-4 shrink-0 text-[#fdb515]"
                aria-hidden
              />
              <a
                href={`tel:${SHOP.phone.replace(/\s/g, "")}`}
                className="transition hover:text-[#fdb515]"
              >
                {SHOP.phone}
              </a>
            </li>
            <li className="flex items-start gap-3">
              <MessageCircle
                className="mt-0.5 h-4 w-4 shrink-0 text-[#fdb515]"
                aria-hidden
              />
              <a
                href={`https://wa.me/${SHOP.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-[#fdb515]"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-6 py-5 text-center text-xs text-white/50">
          &copy; {year} Comfort Zone. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;