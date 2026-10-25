import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE = "/newcomfort.png";

const services = ["Haircuts", "Beard Trim", "Line Up", "Fade", "Shape Up"];

const serif = { fontFamily: "'Playfair Display', Georgia, serif" };

const Hero = () => {
  return (
    <section className="relative isolate flex min-h-[640px] flex-col overflow-hidden bg-black text-white lg:min-h-screen">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;600;700&display=swap');`}</style>

      <Image
        src={HERO_IMAGE}
        alt="Barber giving a fresh fade"
        fill
        priority
        sizes="100vw"
        className="-z-20 object-cover object-[60%_center] lg:object-center"
      />
      {/* Even dark overlay + soft fade on the text side */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-black/50" />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-r from-black/70 via-black/20 to-transparent"
      />

      {/* Content */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-end px-5 pb-14 pt-32 sm:items-center sm:pb-10 lg:px-8">
        <div className="max-w-xl lg:ml-16 xl:ml-28">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-white/90">
            Welcome to Comfort Zone
          </p>

          <h1
            className="mt-4 text-[2.15rem] font-semibold leading-[1.15] sm:text-6xl lg:text-[4.25rem]"
            style={serif}
          >
            Greatness begins
            <br />
            with a fresh cut.
          </h1>

          <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
            Unisex saloon. Skilled barbers for men, women and kids.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#book-now"
              className="inline-flex items-center justify-center rounded-sm bg-[#fdb515] px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-white"
            >
              Book Appointment
            </Link>
            <Link
              href="#home-service"
              className="inline-flex items-center justify-center rounded-sm border border-white/25 bg-black/60 px-8 py-3.5 text-[11px] font-bold uppercase tracking-widest transition-colors hover:border-[#fdb515] hover:text-[#fdb515]"
            >
              Home Service
            </Link>
          </div>
        </div>
      </div>

      {/* Services strip (hidden on phones) */}
      <div className="mx-auto mb-8 hidden w-full max-w-6xl px-5 sm:block lg:px-8">
        <ul className="grid grid-cols-2 border-t border-white/20 sm:grid-cols-3 lg:grid-cols-5">
          {services.map((s) => (
            <li
              key={s}
              className="border-white/20 px-4 py-5 text-xs font-semibold uppercase tracking-widest text-white/90 lg:border-l lg:first:border-l-0"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default Hero;