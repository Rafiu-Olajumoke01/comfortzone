"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { Scissors, Sparkles, Crown } from "lucide-react";
import Navbar from "@/components/Navbar/Navbar";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"] });

const slides = ["/banner-4.webp", "/banner-3.webp"];

const services = [
  { title: "Signature Fade", text: "Sharp, clean and precise cuts tailored to your head shape.", price: "From £15", Icon: Scissors },
  { title: "Beard Trim", text: "Shaped, lined and finished neatly with hot towel care.", price: "From £10", Icon: Sparkles },
  { title: "Full Grooming", text: "Haircut, beard and line-up in one relaxed visit.", price: "From £25", Icon: Crown },
];

const Hero = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 7000);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <>
      <Navbar />
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#FAF6F0]">
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

        <div className="absolute inset-0 bg-gradient-to-b from-white/15 via-white/5 to-white/80" />

        <div className="relative z-10 flex flex-col items-center px-6 pt-32 text-center text-[#2B2118]">
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-[#B89B5E]" />
            <div className="h-2 w-2 rotate-45 bg-[#B89B5E]" />
            <div className="h-px w-12 bg-[#B89B5E]" />
          </div>

          <h1
            className={`${playfair.className} mt-6 max-w-4xl text-4xl font-normal leading-tight md:text-6xl`}
          >
            Great Cuts, Clean Style,{" "}
            <span className="italic text-[#B89B5E]">Total Comfort</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-[#5C4F42]">
            Every cut, trim and style is done with care, so you walk out looking
            good and feeling even better.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/booking"
              className="rounded-full bg-[#B89B5E] px-10 py-4 text-sm font-semibold uppercase tracking-wider text-white shadow-lg transition-colors hover:bg-[#a38650]"
            >
              Book Appointment
            </Link>
            <Link
              href="/services"
              className="rounded-full border border-[#2B2118]/40 bg-white/40 px-10 py-4 text-sm font-semibold uppercase tracking-wider text-[#2B2118] backdrop-blur-md transition-colors hover:bg-white/80"
            >
              Our Services
            </Link>
          </div>
        </div>

        <div className="relative z-10 mt-14 grid w-full max-w-5xl grid-cols-1 gap-5 px-6 md:grid-cols-3">
          {services.map(({ title, text, price, Icon }) => (
            <Link
              key={title}
              href="/services"
              className="rounded-2xl border border-white/70 bg-white/40 p-7 text-center text-[#2B2118] shadow-[0_8px_32px_rgba(43,33,24,0.12)] backdrop-blur-xl transition hover:-translate-y-1 hover:bg-white/60"
            >
              <Icon className="mx-auto h-8 w-8 text-[#B89B5E]" />
              <h3 className={`${playfair.className} mt-4 text-xl`}>{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#5C4F42]">{text}</p>
              <span className="mt-4 inline-block text-xs font-semibold uppercase tracking-wider text-[#B89B5E]">
                {price} &rarr;
              </span>
            </Link>
          ))}
        </div>

        <div className="relative z-10 my-10 flex items-center gap-3">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-[#B89B5E]" : "w-2 bg-[#2B2118]/30 hover:bg-[#2B2118]/60"
              }`}
            />
          ))}
        </div>
      </section>
    </>
  );
};

export default Hero;