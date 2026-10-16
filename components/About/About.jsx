import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });

export default function About() {
  return (
    <section className="overflow-hidden bg-[#14100D] text-white">
      <div className="mx-auto grid max-w-[1400px] items-stretch gap-12 px-6 py-24 lg:grid-cols-2 lg:gap-20 lg:px-10">
        <div
          data-aos="fade-right"
          className="relative aspect-[3/4] w-full overflow-hidden"
        >
          <Image
            src="/banner-3.webp"
            alt="Barber at work"
            fill
            className="object-cover grayscale"
          />
        </div>

        <div data-aos="fade-left" className="flex flex-col justify-between gap-32">
          <div className="lg:pt-16">
            <span className="text-sm font-medium uppercase tracking-[0.4em] text-[#B89B5E]">
              About Us
            </span>

            <h2
              className={`${playfair.className} mt-6 text-4xl font-normal leading-tight md:text-6xl`}
            >
              Sharp Cuts, Real Comfort, Every Time
            </h2>

            <p className="mt-8 max-w-xl text-base leading-8 text-gray-300">
              At Comfort Zone, our barbers mix classic technique with fresh
              trends. Every cut, fade and beard trim is shaped around you, in a
              relaxed space where you can sit back, enjoy the service and walk
              out feeling confident.
            </p>
          </div>

          <div className="relative h-64 w-64 self-end md:h-72 md:w-72">
            <div className="absolute inset-0 overflow-hidden rounded-full">
              <svg
                viewBox="0 0 200 200"
                className="h-full w-full animate-[spin_18s_linear_infinite]"
              >
                <defs>
                  <path
                    id="badge-circle"
                    d="M 20,100 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0"
                  />
                </defs>
                <text fill="#ffffff" fontSize="13" fontWeight="500">
                  <textPath
                    href="#badge-circle"
                    textLength="496"
                    lengthAdjust="spacing"
                  >
                    LOOK GOOD • FEEL CONFIDENT • STAY COMFORTABLE •
                  </textPath>
                </text>
              </svg>
            </div>

            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center leading-tight">
              <span
                className={`${playfair.className} text-lg font-semibold uppercase tracking-[0.2em] text-white md:text-xl`}
              >
                Comfort
              </span>
              <span
                className={`${playfair.className} text-lg font-semibold uppercase tracking-[0.2em] text-[#B89B5E] md:text-xl`}
              >
                Zone
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}