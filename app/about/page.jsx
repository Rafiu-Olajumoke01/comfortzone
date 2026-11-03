"use client";

import { useEffect } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { Home, Scissors, Sparkles, Users } from "lucide-react";
import BookNow from "@/components/BookNow/BookNow";

// Header background photo: must be inside /public. Use a large, sharp, landscape photo.
const HEADER_IMAGE = "/background.jpg";

// Photos for the story section (inside /public)
const STORY_IMAGES = {
  main: "/aboutus.jpg",
  second: "/aboutus2.jpg",
  third: "/aboutus3.jpg",
};

// SAMPLE NUMBERS: replace with the shop's real figures, or delete this list if unsure
const stats = [
  { value: "5+", label: "Years of experience" },
  { value: "2,000+", label: "Happy customers" },
  { value: "5", label: "Skilled barbers" },
  { value: "7", label: "Services offered" },
];

const reasons = [
  {
    icon: Scissors,
    title: "Skilled barbers",
    text: "Every cut is done with care, from clean fades to sharp line-ups.",
  },
  {
    icon: Sparkles,
    title: "Clean and relaxed",
    text: "A neat shop and a relaxed atmosphere, so you can sit back and enjoy it.",
  },
  {
    icon: Users,
    title: "For everyone",
    text: "Men, women and kids are all welcome. Everyone leaves looking good.",
  },
  {
    icon: Home,
    title: "Home service",
    text: "No time to come in? We bring the same sharp cut to your home.",
  },
];

// SAMPLE TEAM: replace with the real barbers' names and roles
const team = [
  { name: "Barber One", role: "Head Barber" },
  { name: "Barber Two", role: "Fade Specialist" },
  { name: "Barber Three", role: "Beard and Line-up" },
];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const AboutPage = () => {
  useEffect(() => {
    // Remove this init if you already call AOS.init() once in your layout
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  return (
    <main>
      {/* Page header with background image */}
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
            Who we are
          </p>
          <h1
            data-aos="fade-up"
            className="mt-3 text-5xl font-bold italic drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-7xl"
            style={serif}
          >
            About <span className="text-[#fdb515]">Us</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-4 max-w-xl text-base text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            More than a haircut. A place where you relax, look sharp and feel
            at home.
          </p>
        </div>
      </section>

      {/* Our story */}
      <section className="bg-[#faf6ec] px-6 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <div data-aos="fade-right">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c98a00]">
              Our story
            </p>
            <h2
              className="mt-3 text-3xl font-bold italic leading-tight text-black sm:text-5xl"
              style={serif}
            >
              Welcome to your comfort zone
            </h2>
            <div className="mt-6 space-y-4 text-base leading-relaxed text-black/70">
              {/* SAMPLE TEXT: replace with the shop's real story */}
              <p>
                Comfort Zone started with one simple idea: a haircut should
                feel good, not rushed. We built a space where everyone, men,
                women and kids, can sit back, relax and leave looking their
                best.
              </p>
              <p>
                Our barbers are skilled, patient and serious about the small
                details, from a perfectly blended fade to a clean, sharp
                hairline. Every customer gets the same care, every time.
              </p>
              <p>
                And if you can't come to us, we come to you. Our home service
                brings the same quality to your doorstep.
              </p>
            </div>
          </div>

          <div data-aos="fade-left" className="grid grid-cols-2 gap-4">
            <div className="relative col-span-2 aspect-[16/10] overflow-hidden bg-black">
              <Image
                src={STORY_IMAGES.main}
                alt="Inside Comfort Zone"
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                quality={90}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden bg-black">
              <Image
                src={STORY_IMAGES.second}
                alt="Barber at work"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                quality={90}
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square overflow-hidden bg-black">
              <Image
                src={STORY_IMAGES.third}
                alt="A fresh cut"
                fill
                sizes="(min-width: 1024px) 25vw, 50vw"
                quality={90}
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="border-y-4 border-[#fdb515] bg-black px-6 py-14 text-white">
        <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-8 text-center lg:grid-cols-4">
          {stats.map(({ value, label }, i) => (
            <li key={label} data-aos="fade-up" data-aos-delay={i * 100}>
              <p
                className="text-4xl font-bold italic text-[#fdb515] sm:text-5xl"
                style={serif}
              >
                {value}
              </p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-white/70 sm:text-sm">
                {label}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Why choose us */}
      <section className="bg-[#faf6ec] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          <div data-aos="fade-up" className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#c98a00]">
              Why choose us
            </p>
            <h2
              className="mt-3 text-3xl font-bold italic text-black sm:text-5xl"
              style={serif}
            >
              The Comfort Zone difference
            </h2>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <li
                key={title}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="border border-black/10 bg-white p-7"
              >
                <span className="flex h-12 w-12 items-center justify-center bg-[#fdb515] text-black">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-5 text-lg font-extrabold uppercase tracking-wide text-black">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-black/70">
                  {text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Team */}
      <section className="bg-black px-6 py-16 text-white sm:py-24">
        <div className="mx-auto max-w-5xl">
          <div data-aos="fade-up" className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-[#fdb515]">
              The team
            </p>
            <h2
              className="mt-3 text-3xl font-bold italic sm:text-5xl"
              style={serif}
            >
              Meet our barbers
            </h2>
          </div>

          <ul className="mt-12 grid gap-6 sm:grid-cols-3">
            {team.map(({ name, role }, i) => (
              <li
                key={name}
                data-aos="fade-up"
                data-aos-delay={i * 100}
                className="border border-white/15 p-8 text-center"
              >
                {/* Swap this circle for a real photo of the barber later */}
                <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fdb515] text-3xl font-extrabold text-black">
                  {name.charAt(0)}
                </span>
                <h3 className="mt-5 text-lg font-extrabold uppercase tracking-wide">
                  {name}
                </h3>
                <p className="mt-1 text-sm text-white/60">{role}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BookNow />
    </main>
  );
};

export default AboutPage;