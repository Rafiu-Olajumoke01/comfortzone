"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { Quote, Star } from "lucide-react";

// Background image: it must be inside /public, match the name and extension
const BG_IMAGE = "/background.jpg";

const AUTO_SLIDE_MS = 6000;

// NOTE: swap these for words your real customers have said (WhatsApp, Instagram, Google)
const reviews = [
  {
    name: "Chinedu Okafor",
    service: "Fade",
    rating: 5,
    text: "Best fade I've had in Lagos. He took his time, the lineup was sharp, and it stayed fresh for two weeks. I won't go anywhere else.",
  },
  {
    name: "Tunde Adeyemi",
    service: "Beard Trim",
    rating: 5,
    text: "My beard had never looked this neat. Clean shaping, hot towel, and no rush at all. Very professional and the shop is always tidy.",
  },
  {
    name: "Emeka Nwosu",
    service: "Home Service",
    rating: 5,
    text: "He came to my house on a busy Saturday, on time, and cut me and my two sons. Great work and no stress of sitting in traffic. Highly recommended.",
  },
];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const Reviews = () => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStart = useRef(null);

  const total = reviews.length;
  const next = () => setIndex((i) => (i + 1) % total);
  const prev = () => setIndex((i) => (i - 1 + total) % total);

  useEffect(() => {
    // Remove this init if you already call AOS.init() once in your layout
    AOS.init({ duration: 1000, easing: "ease-out-cubic", once: true });
  }, []);

  // Auto-slide, pauses while the mouse is over the slider
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, AUTO_SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused, index]);

  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    if (touchStart.current === null) return;
    const diff = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) next();
      else prev();
    }
    touchStart.current = null;
  };

  return (
    <section id="reviews" className="relative overflow-hidden py-20 sm:py-28">
      {/* Background image */}
      <Image
        src={BG_IMAGE}
        alt=""
        fill
        sizes="100vw"
        quality={90}
        className="object-cover"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-4">
        {/* Label */}
        <p
          data-aos="fade-down"
          className="flex items-center justify-center gap-4 text-xl font-extrabold uppercase tracking-[0.2em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)] sm:text-3xl"
        >
          <span className="hidden h-1 w-10 bg-[#fdb515] sm:block" />
          Testimonials
          <span className="hidden h-1 w-10 bg-[#fdb515] sm:block" />
        </p>

        {/* Slider */}
        <div
          data-aos="fade-up"
          className="mt-10"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {reviews.map(({ name, service, rating, text }) => (
                <div key={name} className="w-full shrink-0">
                  <article className="border border-white/20 bg-black/70 p-7 text-white sm:p-10">
                    <Quote
                      className="h-9 w-9 fill-[#fdb515] text-[#fdb515] sm:h-11 sm:w-11"
                      aria-hidden
                    />

                    <div
                      className="mt-4 flex gap-1"
                      role="img"
                      aria-label={`${rating} out of 5 stars`}
                    >
                      {Array.from({ length: rating }).map((_, s) => (
                        <Star
                          key={s}
                          className="h-5 w-5 fill-[#fdb515] text-[#fdb515]"
                          aria-hidden
                        />
                      ))}
                    </div>

                    <p
                      className="mt-5 text-lg leading-relaxed sm:text-2xl"
                      style={serif}
                    >
                      {text}
                    </p>

                    <div className="mt-7 flex items-center gap-4 border-t border-white/20 pt-5">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#fdb515] text-lg font-bold text-black">
                        {name.charAt(0)}
                      </span>
                      <span className="leading-tight">
                        <span className="block font-bold">{name}</span>
                        <span className="block text-sm text-white/70">
                          {service}
                        </span>
                      </span>
                    </div>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="mt-6 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Go to review ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === index ? "w-8 bg-[#fdb515]" : "w-2 bg-white/50"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;