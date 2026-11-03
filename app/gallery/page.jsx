"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AOS from "aos";
import "aos/dist/aos.css";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import BookNow from "@/components/BookNow/BookNow";

// Header background photo: must be inside /public. Use a large, sharp, landscape photo.
const HEADER_IMAGE = "/background.jpg";

// SAMPLE GALLERY: swap in the shop's best work. Images must be inside /public.
// category must match one of the names in CATEGORIES below.
const photos = [
  { src: "/fade.jpg", alt: "Fade haircut", category: "Fades" },
  { src: "/beard.jpg", alt: "Beard trim", category: "Beards" },
  { src: "/haircuts.jpg", alt: "Classic haircut", category: "Haircuts" },
  { src: "/hairline.jpg", alt: "Sharp hairline line-up", category: "Line-ups" },
  { src: "/lineup.jpg", alt: "Line-up and shape-up", category: "Line-ups" },
  { src: "/kids.jpg", alt: "Kids haircut", category: "Kids" },
  { src: "/women.jpg", alt: "Women's styling", category: "Women" },
  { src: "/newwomen.jpg", alt: "Women's hair", category: "Women" },
  { src: "/homeservice.jpg", alt: "Home service haircut", category: "Home Service" },
];

const CATEGORIES = [
  "All",
  "Fades",
  "Beards",
  "Haircuts",
  "Line-ups",
  "Kids",
  "Women",
  "Home Service",
];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const GalleryPage = () => {
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState(null); // index inside the filtered list

  const visible =
    active === "All" ? photos : photos.filter((p) => p.category === active);

  const close = () => setSelected(null);
  const next = () => setSelected((i) => (i + 1) % visible.length);
  const prev = () =>
    setSelected((i) => (i - 1 + visible.length) % visible.length);

  useEffect(() => {
    // Remove this init if you already call AOS.init() once in your layout
    AOS.init({ duration: 800, easing: "ease-out-cubic", once: true });
  }, []);

  // Keyboard controls for the viewer
  useEffect(() => {
    if (selected === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selected, visible.length]);

  const changeCategory = (category) => {
    setActive(category);
    setSelected(null);
  };

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
            Our work
          </p>
          <h1
            data-aos="fade-up"
            className="mt-3 text-5xl font-bold italic drop-shadow-[0_3px_10px_rgba(0,0,0,0.9)] sm:text-7xl"
            style={serif}
          >
            The <span className="text-[#fdb515]">Gallery</span>
          </h1>
          <p
            data-aos="fade-up"
            data-aos-delay="100"
            className="mx-auto mt-4 max-w-xl text-base text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)] sm:text-lg"
          >
            Fresh fades, clean beards and sharp lines. See the work our
            customers walk out with.
          </p>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="bg-[#faf6ec] px-6 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl">
          {/* Filter buttons */}
          <div
            data-aos="fade-up"
            className="flex flex-wrap justify-center gap-3"
          >
            {CATEGORIES.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => changeCategory(category)}
                className={`px-5 py-2 text-xs font-extrabold uppercase tracking-wider transition ${
                  active === category
                    ? "bg-black text-[#fdb515]"
                    : "border border-black/20 bg-white text-black hover:border-black"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Photo grid */}
          {visible.length === 0 ? (
            <p className="mt-16 text-center text-black/60">
              No photos in this category yet.
            </p>
          ) : (
            <ul className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {visible.map((photo, i) => (
                <li
                  key={photo.src}
                  data-aos="fade-up"
                  data-aos-delay={(i % 3) * 100}
                >
                  <button
                    type="button"
                    onClick={() => setSelected(i)}
                    aria-label={`View ${photo.alt}`}
                    className="group relative block aspect-square w-full overflow-hidden bg-black"
                  >
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 1024px) 33vw, 50vw"
                      quality={90}
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute inset-x-0 bottom-0 translate-y-full bg-black/80 px-4 py-3 text-left text-xs font-bold uppercase tracking-wider text-[#fdb515] transition duration-300 group-hover:translate-y-0">
                      {photo.category}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <BookNow />

      {/* Photo viewer */}
      {selected !== null && visible[selected] && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4"
          onClick={close}
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center bg-[#fdb515] text-black transition hover:bg-white"
          >
            <X className="h-6 w-6" />
          </button>

          {visible.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-[#fdb515] text-black transition hover:bg-white sm:left-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
                aria-label="Next photo"
                className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center bg-[#fdb515] text-black transition hover:bg-white sm:right-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div
            className="relative h-[80vh] w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={visible[selected].src}
              alt={visible[selected].alt}
              fill
              sizes="90vw"
              quality={95}
              className="object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
};

export default GalleryPage;