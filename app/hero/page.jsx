"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar/Navbar";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"] });

const slides = ["/banner-4.webp", "/banner-3.webp"];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearTimeout(timer);
  }, [index]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <>
      <Navbar />
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={src}
              alt="Comfort Zone"
              fill
              priority={i === 0}
              className="object-cover"
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/80" />

        <div className="relative z-10 flex flex-col items-center px-6 pt-20 text-center text-white">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#B89B5E]" />
            <div className="h-2 w-2 rotate-45 bg-[#B89B5E]" />
            <div className="h-px w-12 bg-[#B89B5E]" />
          </div>

          <span
            className={`${playfair.className} mt-5 text-4xl font-bold uppercase tracking-[0.25em] drop-shadow-lg md:text-6xl`}
          >
            Comfort <span className="text-[#B89B5E]">Zone</span>
          </span>

          <h1
            className={`${playfair.className} mt-10 max-w-4xl text-4xl font-normal leading-tight drop-shadow-lg md:text-6xl`}
          >
            Great Cuts, Clean Style, Total Comfort Every Single Visit
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-gray-300">
            Welcome to Comfort Zone, where every cut, trim and style is done with
            care, so you walk out looking good and feeling even better.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/services"
              className="bg-[#B89B5E] px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-[#a38650]"
            >
              Our Services
            </Link>
            <Link
              href="/booking"
              className="border border-white px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white hover:text-black"
            >
              Book Now
            </Link>
          </div>
        </div>

        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-10 -translate-y-1/2 text-3xl text-white hover:text-[#B89B5E]"
        >
          &#10094;
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-10 -translate-y-1/2 text-3xl text-white hover:text-[#B89B5E]"
        >
          &#10095;
        </button>
      </section>
    </>
  );
}