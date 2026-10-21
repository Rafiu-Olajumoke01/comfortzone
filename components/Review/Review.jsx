"use client";

import { useEffect, useRef, useState } from "react";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"] });

const reviews = [
  {
    name: "Daniel Cooper",
    service: "Modern Fade",
    rating: 5,
    text: "Great service from start to finish. The barber understood the style I wanted and delivered a clean cut. You can really tell they care about quality.",
  },
  {
    name: "Oliver Bennett",
    service: "Classic Haircut",
    rating: 5,
    text: "The atmosphere is relaxed, the service is excellent, and the haircut always comes out looking fresh. Definitely my favourite barbershop in town.",
  },
  {
    name: "Samuel Adeyemi",
    service: "Beard Trim",
    rating: 5,
    text: "Neat lines, clean finish and no waiting around. I walk out feeling sharp every single time.",
  },
];

const Reviews = () => {
  const sectionRef = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const scrollable = height - window.innerHeight;
      setProgress(Math.min(Math.max(-top / scrollable, 0), 1));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const index = Math.round(progress * (reviews.length - 1));

  return (
    <section
      id="reviews"
      ref={sectionRef}
      className="relative h-[300vh] bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "url('/banner-3.webp')" }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#15110E] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#15110E] to-transparent" />

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">

        <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
          <div className="overflow-hidden">
            <div
              className="flex"
              style={{
                transform: `translateX(-${progress * (reviews.length - 1) * 100}%)`,
              }}
            >
              {reviews.map((review) => (
                <div key={review.name} className="w-full shrink-0 text-white">
                  <span
                    className={`${playfair.className} text-7xl leading-none text-[#B89B5E]`}
                  >
                    &ldquo;
                  </span>

                  <p
                    className={`${playfair.className} mt-2 text-2xl leading-relaxed md:text-4xl`}
                  >
                    {review.text}
                  </p>

                  <div className="mt-8 border-t border-white/30 pt-6">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B89B5E] text-lg font-bold">
                        {review.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold">{review.name}</p>
                        <p className="text-sm text-gray-300">{review.service}</p>
                        <p className="text-sm text-[#B89B5E]">
                          {"★".repeat(review.rating)}{" "}
                          <span className="text-white">{review.rating}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex gap-3">
            {reviews.map((review, i) => (
              <div
                key={review.name}
                className={`h-2 w-8 transition-colors ${
                  i === index ? "bg-[#B89B5E]" : "bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Reviews;