"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { CalendarCheck, MessageCircle } from "lucide-react";

// Change these to the real details
const BOOKING_LINK = "/booking"; // or "#contact" if you have no booking page yet
const WHATSAPP_NUMBER = "234XXXXXXXXXX"; // country code first, no + or spaces
const WHATSAPP_MESSAGE = "Hello Comfort Zone, I'd like to book an appointment.";

// Image on the right side. Must be inside /public. null = no image.
const BOOK_IMAGE = null;

const slant = { clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" };
const imageSlant = { clipPath: "polygon(12% 0, 100% 0, 100% 100%, 0 100%)" };
const curly = {
  fontFamily: "'Playfair Display', Georgia, serif",
  fontStyle: "italic",
};

const BookNow = () => {
  useEffect(() => {
    // Remove this init if you already call AOS.init() once in your layout
    AOS.init({ duration: 1000, easing: "ease-out-cubic", once: true });
  }, []);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
    <section id="book" className="bg-[#faf6ec]">
      <div
        className={`mx-auto grid max-w-7xl items-stretch ${
          BOOK_IMAGE ? "lg:grid-cols-2" : ""
        }`}
      >
        {/* Text + buttons */}
        <div
          data-aos="fade-right"
          className="flex flex-col items-center justify-center px-6 py-20 text-center sm:px-10 sm:py-28"
        >
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-black/60">
            Book your appointment
          </p>
          <h2
            className="mt-3 text-4xl font-bold leading-tight text-black sm:text-6xl"
            style={curly}
          >
            Ready for a <span className="text-[#c98a00]">fresh cut?</span>
          </h2>
          <p className="mt-4 max-w-xl text-base text-black/70 sm:text-lg">
            Pick your time and walk in looking sharp. Book online in a minute,
            or message us on WhatsApp.
          </p>

          <div className="mt-8 flex w-full flex-col items-center gap-4 sm:w-auto sm:flex-row">
            <Link
              href={BOOKING_LINK}
              style={slant}
              className="flex w-full items-center justify-center gap-2 bg-[#fdb515] px-12 py-4 text-base font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] sm:w-auto"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              Book Now
            </Link>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 border-2 border-black/40 px-8 py-[14px] text-base font-bold uppercase tracking-wider text-black transition hover:border-black hover:bg-black hover:text-white sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              WhatsApp
            </a>
          </div>
        </div>

        {/* Image */}
        {BOOK_IMAGE && (
          <div
            data-aos="fade-left"
            style={imageSlant}
            className="relative min-h-[280px] lg:min-h-[420px]"
          >
            <Image
              src={BOOK_IMAGE}
              alt=""
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default BookNow;