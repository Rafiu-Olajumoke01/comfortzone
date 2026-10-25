"use client";

import { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { Clock, Home, MessageCircle } from "lucide-react";
import BookNow from "@/components/BookNow/Booknow";

// Change to the shop's real WhatsApp number (country code first, no + or spaces)
const WHATSAPP_NUMBER = "234XXXXXXXXXX";

// Header background photo: must be inside /public. Use a large, sharp, landscape photo.
const HEADER_IMAGE = "/background.jpg";

// SAMPLE SERVICES: replace names, prices, times and descriptions with the real ones.
// Images must be inside /public.
const services = [
  {
    name: "Classic Haircut",
    desc: "A clean, neat cut finished with a sharp edge-up and a style that suits your face.",
    price: "₦5,000",
    time: "30 min",
    image: "/haircuts.jpg",
  },
  {
    name: "Fade",
    desc: "Low, mid or high fade, blended smoothly and finished with clean lines.",
    price: "₦6,000",
    time: "45 min",
    image: "/fade.jpg",
  },
  {
    name: "Beard Trim",
    desc: "Shaped, trimmed and lined up, with a hot towel to finish.",
    price: "₦3,000",
    time: "20 min",
    image: "/beard.jpg",
  },
  {
    name: "Line-up & Shape-up",
    desc: "Crisp hairline and edges to keep your look sharp between full cuts.",
    price: "₦2,000",
    time: "15 min",
    image: "/hairline.jpg",
  },
];

const home = {
  name: "Home Service",
  desc: "Can't come to the shop? We come to you. Same sharp cut, in the comfort of your home. Great for families and busy schedules.",
  price: "From ₦15,000",
  note: "Price depends on your area and the number of people.",
  image: "/homeservice.jpg",
};

const faqs = [
  {
    q: "Do you take walk-ins?",
    a: "Yes, when there is a free chair. Booking ahead is the best way to avoid waiting.",
  },
  {
    q: "How do I pay?",
    a: "We accept cash and bank transfer.",
  },
  {
    q: "What if I need to cancel or change my time?",
    a: "Please message us on WhatsApp at least a few hours before your appointment.",
  },
  {
    q: "Do you cut kids' hair?",
    a: "Yes. Tell us the child's age when you book so we can plan the time.",
  },
];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(8% 0, 100% 0, 92% 100%, 0 100%)" };

const whatsappLink = (service) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    `Hello Comfort Zone, I'd like to book: ${service}.`
  )}`;

const ServicesPage = () => {
  useEffect(() => {
    // Remove this init if you already call AOS.init() once in your layout
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <main>
      {/* Page header with background image (navbar sits on top of it, like the hero) */}
      <section className="relative flex min-h-[75vh] items-center justify-center overflow-hidden border-b-4 border-[#fdb515] bg-black px-6 pb-20 pt-32 text-center text-white">
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
            className="text-sm font-bold uppercase tracking-[0.3em] text-[#fdb515] drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]"
          >
            What we offer
          </p>
          <h1
            data-aos="fade-up"
            className="mt-3 text-5xl font-bold italic drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-7xl"
            style={serif}
          >
            Our <span className="text-[#fdb515]">Services</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-4 max-w-xl text-base text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            Sharp cuts, clean beards and fair prices. Pick a service and book
            in a minute.
          </p>
        </div>
      </section>

      {/* Service list + FAQ */}
      <section className="bg-[#faf6ec] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 sm:grid-cols-2">
            {services.map(({ name, desc, price, time, image }, i) => (
              <article
                key={name}
                data-aos="fade-up"
                data-aos-delay={(i % 2) * 100}
                className="flex flex-col overflow-hidden border border-black/10 bg-white"
              >
                <div className="relative h-56 w-full bg-black">
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="(min-width: 640px) 50vw, 100vw"
                    quality={90}
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl font-extrabold uppercase tracking-wide text-black">
                      {name}
                    </h2>
                    <span className="shrink-0 bg-[#fdb515] px-3 py-1 text-sm font-extrabold text-black">
                      {price}
                    </span>
                  </div>

                  <p className="mt-3 flex-1 text-sm leading-relaxed text-black/70">
                    {desc}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-4 border-t border-black/10 pt-5">
                    <span className="flex items-center gap-2 text-sm font-semibold text-black/70">
                      <Clock className="h-4 w-4 text-[#c98a00]" aria-hidden />
                      {time}
                    </span>
                    <a
                      href={whatsappLink(name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={slant}
                      className="bg-black px-8 py-2.5 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-[#fdb515] hover:text-black"
                    >
                      Book
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* FAQ */}
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
                  <p className="mt-3 text-sm leading-relaxed text-black/70">
                    {a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Home service highlight */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-6xl items-stretch lg:grid-cols-2">
          <div
            data-aos="fade-right"
            className="flex flex-col justify-center px-6 py-16 sm:px-10 sm:py-20"
          >
            <p className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.25em] text-[#fdb515]">
              <Home className="h-4 w-4" aria-hidden />
              We come to you
            </p>
            <h2
              className="mt-3 text-4xl font-bold italic sm:text-5xl"
              style={serif}
            >
              {home.name}
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-white/70">
              {home.desc}
            </p>
            <p className="mt-6 text-2xl font-extrabold text-[#fdb515]">
              {home.price}
            </p>
            <p className="mt-1 text-sm text-white/60">{home.note}</p>

            <a
              href={whatsappLink(home.name)}
              target="_blank"
              rel="noopener noreferrer"
              style={slant}
              className="mt-8 flex w-full items-center justify-center gap-2 self-start bg-[#fdb515] px-12 py-4 text-base font-extrabold uppercase tracking-wider text-black transition hover:bg-white sm:w-auto"
            >
              <MessageCircle className="h-5 w-5" aria-hidden />
              Request on WhatsApp
            </a>
          </div>

          <div data-aos="fade-left" className="relative min-h-[300px]">
            <Image
              src={home.image}
              alt={home.name}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              quality={90}
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <BookNow />
    </main>
  );
};

export default ServicesPage;