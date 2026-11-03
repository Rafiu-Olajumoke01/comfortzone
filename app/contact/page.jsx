"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { Clock, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import BookNow from "@/components/BookNow/BookNow";

// Header background photo: must be inside /public. Use a large, sharp, landscape photo.
const HEADER_IMAGE = "/background.jpg";

// SAMPLE DETAILS: replace with the shop's real information (keep the same as the footer)
const SHOP = {
  address: "Shop address, Lagos, Nigeria",
  phone: "+234 800 000 0000",
  whatsapp: "234XXXXXXXXXX", // country code first, no + or spaces
  hours: [
    { days: "Mon - Sat", time: "9:00 AM - 8:00 PM" },
    { days: "Sunday", time: "2:00 PM - 7:00 PM" },
  ],
};

const SERVICE_OPTIONS = [
  "Classic Haircut",
  "Fade",
  "Beard Trim",
  "Line-up & Shape-up",
  "Home Service",
  "Something else",
];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };
const slant = { clipPath: "polygon(4% 0, 100% 0, 96% 100%, 0 100%)" };

const inputClass =
  "w-full border border-black/20 bg-white px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/40 focus:border-[#fdb515] focus:ring-2 focus:ring-[#fdb515]/40";

const ContactPage = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    service: SERVICE_OPTIONS[0],
    message: "",
  });

  useEffect(() => {
    // Remove this init if you already call AOS.init() once in your layout
    AOS.init({ duration: 900, easing: "ease-out-cubic", once: true });
  }, []);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  // The form opens WhatsApp with the message already typed in
  const handleSubmit = (e) => {
    e.preventDefault();
    const text = [
      "Hello Comfort Zone,",
      `My name is ${form.name}.`,
      form.phone ? `My phone number is ${form.phone}.` : "",
      `Service: ${form.service}.`,
      form.message,
    ]
      .filter(Boolean)
      .join("\n");

    window.open(
      `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(
    SHOP.address
  )}&output=embed`;

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
            Get in touch
          </p>
          <h1
            data-aos="fade-up"
            className="mt-3 text-5xl font-bold italic drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-7xl"
            style={serif}
          >
            Contact <span className="text-[#fdb515]">Us</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-4 max-w-xl text-base text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            Questions, bookings or home service requests. Message us and we
            will reply as soon as we can.
          </p>
        </div>
      </section>

      {/* Info + form */}
      <section className="bg-[#faf6ec] px-6 py-16 sm:py-24">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-5">
          {/* Contact details */}
          <div data-aos="fade-right" className="space-y-5 lg:col-span-2">
            <h2
              className="text-3xl font-bold italic text-black sm:text-4xl"
              style={serif}
            >
              Find us
            </h2>

            <div className="flex items-start gap-4 border border-black/10 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fdb515] text-black">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-black">
                  Address
                </h3>
                <p className="mt-1 text-sm text-black/70">{SHOP.address}</p>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-black/10 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fdb515] text-black">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-black">
                  Phone
                </h3>
                <a
                  href={`tel:${SHOP.phone.replace(/\s/g, "")}`}
                  className="mt-1 block text-sm text-black/70 transition hover:text-[#c98a00]"
                >
                  {SHOP.phone}
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-black/10 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fdb515] text-black">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-black">
                  WhatsApp
                </h3>
                <a
                  href={`https://wa.me/${SHOP.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 block text-sm text-black/70 transition hover:text-[#c98a00]"
                >
                  Chat with us
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4 border border-black/10 bg-white p-5">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center bg-[#fdb515] text-black">
                <Clock className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-wider text-black">
                  Opening hours
                </h3>
                <ul className="mt-1 space-y-1 text-sm text-black/70">
                  {SHOP.hours.map(({ days, time }) => (
                    <li key={days}>
                      <span className="font-bold text-black">{days}:</span>{" "}
                      {time}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Message form */}
          <div data-aos="fade-left" className="lg:col-span-3">
            <div className="border border-black/10 bg-white p-6 sm:p-10">
              <h2
                className="text-3xl font-bold italic text-black sm:text-4xl"
                style={serif}
              >
                Send us a message
              </h2>
              <p className="mt-2 text-sm text-black/60">
                Fill this in and it opens WhatsApp with your message ready to
                send.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-black"
                    >
                      Your name
                    </label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={update("name")}
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-black"
                    >
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={update("phone")}
                      placeholder="080..."
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="service"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-black"
                  >
                    Service
                  </label>
                  <select
                    id="service"
                    value={form.service}
                    onChange={update("service")}
                    className={inputClass}
                  >
                    {SERVICE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-black"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    required
                    value={form.message}
                    onChange={update("message")}
                    placeholder="Tell us the day and time you would like, or ask any question."
                    className={inputClass}
                  />
                </div>

                <button
                  type="submit"
                  style={slant}
                  className="flex w-full items-center justify-center gap-2 bg-[#fdb515] px-10 py-4 text-sm font-extrabold uppercase tracking-wider text-black transition hover:bg-black hover:text-[#fdb515] sm:w-auto"
                >
                  <Send className="h-4 w-4" aria-hidden />
                  Send on WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map */}
      <section className="bg-black px-6 py-16 text-white sm:py-20">
        <div className="mx-auto max-w-6xl">
          <h2
            data-aos="fade-up"
            className="text-center text-3xl font-bold italic sm:text-4xl"
            style={serif}
          >
            Visit the <span className="text-[#fdb515]">shop</span>
          </h2>
          <div
            data-aos="fade-up"
            className="mt-8 h-[320px] w-full overflow-hidden border-4 border-[#fdb515] sm:h-[420px]"
          >
            <iframe
              title="Comfort Zone location"
              src={mapSrc}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </section>

      <BookNow />
    </main>
  );
};

export default ContactPage;