"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar/Navbar";

const slides = ["/banner-4.webp", "/banner-3.webp"];

export default function Hero() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 6000);
    return () => clearTimeout(timer);
  }, [index]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <>
      <Navbar />
      <section className="relative flex min-h-screen items-center overflow-hidden">
        {slides.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-700 ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
            aria-hidden={i !== index}
          >
            <Image
              src={src}
              alt="Barber giving a precision haircut at Comfort Zone"
              fill
              priority
              sizes="100vw"
              quality={70}
              className="object-cover"
            />
          </div>
        ))}

        {/* darker on the left where the text sits, lighter on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-black/10" />

        {/* soft fade into the cream page below */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-cream" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/30 px-4 py-1.5 text-xs font-semibold text-gold backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" />
              Premium barbershop · Book your chair today
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight text-white md:text-6xl">
              Great cuts, clean style,
              <span className="block text-gold">total comfort every visit.</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/85 md:text-lg">
              Welcome to Comfort Zone, where every cut, trim and style is done with
              care, so you walk out looking good and feeling even better.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/booking"
                className="rounded-lg bg-gold px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-gold/30 transition-colors hover:bg-gold-hover"
              >
                Book Now →
              </Link>
              <Link
                href="/services"
                className="rounded-lg border border-white/40 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-white hover:text-ink"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>

        {/* arrows (desktop) */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous slide"
          className="absolute left-4 top-1/2 z-10 hidden -translate-y-1/2 text-3xl text-white/70 transition-colors hover:text-gold md:block"
        >
          &#10094;
        </button>
        <button
          type="button"
          onClick={next}
          aria-label="Next slide"
          className="absolute right-4 top-1/2 z-10 hidden -translate-y-1/2 text-3xl text-white/70 transition-colors hover:text-gold md:block"
        >
          &#10095;
        </button>

        {/* slide dots */}
        <div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-gold" : "w-4 bg-white/50 hover:bg-white/80"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
}