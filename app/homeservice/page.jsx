"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { CalendarCheck, Home, MapPin, MessageCircle, Scissors } from "lucide-react";

// Change these to the real details
const WHATSAPP_NUMBER = "2348033295456";
const BOOKING_LINK = "/booking";
const HEADER_IMAGE = "/background.jpg";
const SIDE_IMAGE = "/homeservice.jpg";
const PRICE = "From ₦15,000";
const PRICE_NOTE = "Price depends on your area and the number of people.";

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" };

const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  "Hello Comfort Zone, I'd like to request a home service."
)}`;

const steps = [
  {
    icon: MessageCircle,
    title: "Tell us where you are",
    text: "Message us on WhatsApp or book online with your area and how many people.",
  },
  {
    icon: MapPin,
    title: "We confirm the price and time",
    text: "We reply with the exact price for your area and agree a time that suits you.",
  },
  {
    icon: Scissors,
    title: "We come to you",
    text: "Your barber arrives on time with everything needed for a sharp cut at home.",
  },
];

const faqs = [
  {
    q: "Which areas do you cover?",
    a: "Message us your location on WhatsApp and we will confirm if we can reach you.",
  },
  {
    q: "Can you cut for the whole family?",
    a: "Yes. Tell us how many people and their ages so we can plan the time.",
  },
  {
    q: "How do I pay?",
    a: "We accept bank transfer only. We don't take cash.",
  },
  {
    q: "What if I need to change my time?",
    a: "Please message us on WhatsApp at least a few hours before your appointment.",
  },
];

export default function HomeServicePage() {
  useEffect(() => {
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden border-b-4 border-[#fdb515] bg-black px-6 pb-20 pt-32 text-center text-white">
        <Image
          src={HEADER_IMAGE}
          alt=""
          fill
          priority
          sizes="100vw"
          quality={90}
          className="object-cover"
        />

        <div className="relative z-10">
          <p
            data-aos="fade-down"
            className="flex items-center justify-center gap-2 text-sm font-bold uppercase tracking-[0.3em] text-[#fdb515] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          >
            <Home className="h-4 w-4" aria-hidden />
            We come to you
          </p>
          <h1
            data-aos="fade-up"
            className="mt-3 text-5xl font-bold italic drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-7xl"
            style={serif}
          >
            Home <span className="text-[#fdb515]">Service</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-4 max-w-xl text-base text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            Same sharp cut, in the comfort of your home. Great for families and
            busy schedules.
          </p>
        </div>
      </section>

      {/* Details */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-6xl items-stretch lg:grid-cols-2">
          <div
            data-aos="fade-right"
            className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20"
          >
            <h2 className="text-4xl font-bold italic sm:text-5xl" style={serif}>
              Skip the shop, <span className="text-[#fdb515]">keep the cut</span>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              Can&apos;t come to the shop? We come to you. Book a time, and your
              barber shows up ready to work.
            </p>
            <p className="mt-6 text-2xl font-extrabold text-[#fdb515]">{PRICE}</p>
            <p className="mt-1 text-sm text-white/60">{PRICE_NOTE}</p>

            <div className="mt-8 flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
              <Link
                href={BOOKING_LINK}
                style={slant}
                className="flex w-full items-center justify-center gap-2 bg-[#fdb515] px-10 py-4 text-base font-extrabold uppercase tracking-wider text-black transition hover:bg-white sm:w-auto"
              >
                <CalendarCheck className="h-5 w-5" aria-hidden />
                Book Now
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 border-2 border-white/40 px-8 py-[14px] text-base font-bold uppercase tracking-wider text-white transition hover:border-white hover:bg-white hover:text-black sm:w-auto"
              >
                <MessageCircle className="h-5 w-5" aria-hidden />
                WhatsApp
              </a>
            </div>
          </div>

          <div data-aos="fade-left" className="relative min-h-[300px]">
            <Image
              src={SIDE_IMAGE}
              alt="Home service haircut"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* How it works + FAQ */}
      <section className="bg-[#faf6ec] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <h2
            data-aos="fade-up"
            className="text-center text-3xl font-bold italic text-black sm:text-4xl"
            style={serif}
          >
            How it works
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map(({ icon: Icon, title, text }, i) => (
              <div
                key={title}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="border border-black/10 bg-white p-6"
              >
                <Icon className="h-7 w-7 text-[#c98a00]" aria-hidden />
                <h3 className="mt-4 text-lg font-extrabold uppercase tracking-wide text-black">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70">{text}</p>
              </div>
            ))}
          </div>

          <div className="mx-auto mt-20 max-w-3xl">
            <h2
              data-aos="fade-up"
              className="text-center text-3xl font-bold italic text-black sm:text-4xl"
              style={serif}
            >
              Good to know
            </h2>
            <div className="mt-8 space-y-3">
              {faqs.map(({ q, a }) => (
                <details
                  key={q}
                  data-aos="fade-up"
                  className="group border border-black/10 bg-white p-5"
                >
                  <summary className="cursor-pointer list-none text-base font-bold text-black">
                    <span className="flex items-center justify-between gap-4">
                      {q}
                      <span
                        className="text-xl text-[#c98a00] transition group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </span>
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-black/70">{a}</p>
                </details>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center" data-aos="fade-up">
            <Link
              href={BOOKING_LINK}
              style={slant}
              className="inline-flex items-center justify-center gap-2 bg-black px-12 py-4 text-base font-extrabold uppercase tracking-wider text-white transition hover:bg-[#fdb515] hover:text-black"
            >
              <CalendarCheck className="h-5 w-5" aria-hidden />
              Book Home Service
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}