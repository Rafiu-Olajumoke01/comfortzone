"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { api } from "@/app/lib/api";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api("/api/services/")
      .then(setServices)
      .catch(() => setServices([]));
  }, []);

  const items = services.map((s) => ({
    id: s.id,
    name: s.name,
    price: `₦${Number(s.price).toLocaleString("en-NG")}`,
    image: s.image || "/haircuts.jpg",
  }));

  return (
    <section
      id="services"
      className="overflow-hidden bg-black py-20 text-white lg:py-28"
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-8">
        {/* Heading */}
        <div className="max-w-2xl">
          <p
            data-aos="fade-right"
            className="flex items-center gap-4 text-2xl font-extrabold uppercase tracking-[0.2em] text-[#fdb515] sm:text-3xl lg:text-4xl"
          >
            <span className="h-1 w-14 bg-[#fdb515]" />
            Our Services
          </p>

          <h2
            data-aos="fade-right"
            data-aos-delay="150"
            className="mt-4 text-4xl font-semibold leading-[1.15] sm:text-5xl lg:text-6xl"
            style={serif}
          >
            Pick your style.
          </h2>
        </div>

        {/* Image grid */}
        <ul className="mt-14 grid grid-cols-2 gap-3 md:gap-5 lg:grid-cols-4">
          {items.map(({ id, name, price, image }, i) => (
            <li
              key={id}
              data-aos="zoom-in"
              data-aos-delay={(i % 4) * 120}
            >
              <div className="group relative block aspect-[3/4] overflow-hidden bg-neutral-900">
                <Image
                  src={image}
                  alt={name}
                  unoptimized={image.startsWith("http")}
                  fill
                  sizes="(min-width: 1024px) 25vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Dark layer */}
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent transition-colors duration-500 lg:from-black/0 lg:via-black/0 lg:group-hover:from-black/90 lg:group-hover:via-black/50"
                />

                {/* Title + amount (always shown on phones, pops up on hover on desktop) */}
                <div className="absolute inset-x-0 bottom-0 p-4 transition-all duration-500 md:p-6 lg:translate-y-6 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
                  <h3 className="text-base font-bold uppercase tracking-wide md:text-xl">
                    {name}
                  </h3>
                  <p
                    className="mt-1 text-xl font-bold text-[#fdb515] md:text-2xl"
                    style={serif}
                  >
                    {price}
                  </p>
                </div>

                {/* Gold line that grows on hover */}
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-[#fdb515] transition-transform duration-500 group-hover:scale-x-100"
                />
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex justify-end">
          <Link
            href="/services"
            className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#fdb515] transition hover:text-white"
          >
            View all
            <span
              aria-hidden
              className="h-px w-6 bg-current transition-all duration-300 group-hover:w-10"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}