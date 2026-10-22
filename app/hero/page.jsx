"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"] });

const slides = ["/banner-4.webp", "/banner-3.webp"];

const stats = [
  { value: "10+", label: "Years experience" },
  { value: "5k+", label: "Happy clients" },
  { value: "4.9", label: "Average rating" },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <>
      <Navbar />
      <section className="relative min-h-screen overflow-hidden bg-[#F5EFE6]">
        <div className="mx-auto grid min-h-screen max-w-[1300px] items-center gap-12 px-6 pb-16 pt-32 lg:grid-cols-2 lg:px-10">
          {/* Left: text */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.3em] text-[#B89B5E]">
              <span className="h-px w-10 bg-[#B89B5E]" />
              Premium Barbing Salon
            </span>

            <h1
              className={`${playfair.className} mt-6 text-5xl font-bold leading-[1.05] text-[#1A1613] md:text-7xl`}
            >
              Fresh Cuts.
              <br />
              <span className="italic text-[#B89B5E]">Sharp Lines.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[#5C4F42] lg:mx-0">
              From clean fades to perfectly shaped beards, every visit is done
              with care, so you leave looking sharp and feeling confident.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
              <Link
                href="/booking"
                className="rounded-full bg-[#1A1613] px-9 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#B89B5E]"
              >
                Book Appointment
              </Link>
              <Link
                href="/services"
                className="rounded-full border border-[#1A1613]/30 px-9 py-4 text-sm font-semibold uppercase tracking-wider text-[#1A1613] transition-colors hover:border-[#B89B5E] hover:text-[#B89B5E]"
              >
                Our Services
              </Link>
            </div>

            <div className="mt-12 flex items-center justify-center gap-8 border-t border-[#1A1613]/10 pt-8 lg:justify-start">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className={`${playfair.className} text-3xl font-bold text-[#1A1613]`}>
                    {s.value}
                  </p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-[#5C4F42]">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: arched photo with floating cards */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="relative h-[480px] overflow-hidden rounded-t-[220px] rounded-b-3xl shadow-2xl md:h-[620px]">
              {slides.map((src, i) => (
                <div
                  key={src}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                    i === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <Image
                    src={src}
                    alt="Comfort Zone barbershop"
                    fill
                    priority={i === 0}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>

            <div className="absolute -left-2 bottom-12 rounded-2xl bg-white px-5 py-4 shadow-xl md:-left-8">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#B89B5E]">
                Open Today
              </p>
              <p className={`${playfair.className} mt-1 text-lg text-[#1A1613]`}>
                9:00 AM – 7:00 PM
              </p>
            </div>

            <div className="absolute -right-2 top-24 rounded-2xl bg-white px-5 py-4 shadow-xl md:-right-6">
              <p className="text-lg text-[#B89B5E]">★★★★★</p>
              <p className="mt-1 text-xs text-[#5C4F42]">Loved by our clients</p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-3">
              {slides.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-[#B89B5E]" : "w-2 bg-[#1A1613]/25 hover:bg-[#1A1613]/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;