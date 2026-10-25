"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

// Put your images in the /public folder and match the names + extensions here
const ABOUT_IMAGES = ["/aboutus.jpg", "/aboutus2.jpg", "/aboutus3.jpg"];
const SLIDE_MS = 4500;
const TEETH = 12;

// Builds a vertical zigzag along the right edge of a box
const zigzag = (depth) => {
  const pts = ["0% 0%"];
  for (let i = 0; i <= TEETH; i++) {
    const y = (i / TEETH) * 100;
    const x = i % 2 === 0 ? 100 : 100 - depth;
    pts.push(`${x}% ${y}%`);
  }
  pts.push("0% 100%");
  return `polygon(${pts.join(",")})`;
};

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

export default function AboutUs() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(
      () => setCurrent((c) => (c + 1) % ABOUT_IMAGES.length),
      SLIDE_MS
    );
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    // Remove this if you already call AOS.init() once for the whole site
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <section id="about" className="overflow-hidden bg-white py-20 text-black lg:py-28">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');
        @media (min-width: 1024px) {
          .zz-outer { clip-path: ${zigzag(9)}; }
          .zz-inner { clip-path: ${zigzag(9)}; right: 22px; }
        }
      `}</style>

      <div className="mx-auto grid max-w-[1400px] items-center gap-12 px-4 md:px-8 lg:grid-cols-2 lg:gap-20">
        {/* Image with black zigzag edge */}
        <div data-aos="fade-right">
        <div className="zz-outer relative h-[420px] bg-black sm:h-[520px] lg:h-[600px]">
          <div className="zz-inner absolute inset-0">
            {ABOUT_IMAGES.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt="Comfort Zone barber at work"
                fill
                priority={i === 0}
                sizes="(min-width: 1024px) 50vw, 100vw"
                className={`object-cover grayscale transition-opacity duration-1000 ${
                  i === current ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
        </div>
        </div>

        {/* Text */}
        <div>
          <p data-aos="fade-left" data-aos-delay="150" className="flex items-center gap-4 text-2xl font-extrabold uppercase tracking-[0.2em] text-[#b07d00] sm:text-3xl lg:text-4xl">
            <span className="h-1 w-14 bg-[#fdb515]" />
            About Us
          </p>

          <h2
            data-aos="fade-left"
            data-aos-delay="300"
            className="mt-4 text-4xl font-semibold leading-[1.15] sm:text-5xl lg:text-6xl"
            style={serif}
          >
            Sharp Cuts, Real Comfort, Every Time
          </h2>

          <p data-aos="fade-up" data-aos-delay="450" className="mt-6 max-w-lg text-base leading-8 text-neutral-600">
            At Comfort Zone, our barbers mix classic technique with fresh
            trends. Every cut, fade and beard trim is shaped around you, in a
            relaxed space where you can sit back, enjoy the service and walk
            out feeling confident.
          </p>

          <Link
            data-aos="zoom-in"
            data-aos-delay="600"
            href="#book"
            className="mt-8 inline-flex items-center justify-center bg-[#fdb515] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-[#fdb515]"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </section>
  );
}