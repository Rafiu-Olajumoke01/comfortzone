import Image from "next/image";
import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "600"] });

const services = [
  {
    name: "Classic Haircut",
    price: "₦3,000",
    description: "A clean, neat cut shaped to your head and your style.",
    src: "/service-1.webp",
  },
  {
    name: "Beard Trim",
    price: "₦2,000",
    description: "Sharp lines and an even shape, so your beard always looks tidy.",
    src: "/service-2.webp",
  },
  {
    name: "Skin Fade",
    price: "₦3,500",
    description: "A smooth fade blended with care for a modern, sharp finish.",
    src: "/service-3.webp",
  },
  {
    name: "Hot Towel Shave",
    price: "₦4,000",
    description: "A warm towel and a close shave that leaves your skin fresh.",
    src: "/service-4.webp",
  },
  {
    name: "Hair & Beard Combo",
    price: "₦5,000",
    description: "Haircut and beard trim in one visit, so you leave fully done.",
    src: "/service-5.webp",
  },
  {
    name: "Kids Haircut",
    price: "₦2,500",
    description: "A gentle, friendly cut that keeps little ones calm and happy.",
    src: "/service-6.webp",
  },
];

export default function Services() {
  return (
    <section className="overflow-hidden bg-[#14100D] px-6 py-24 text-white lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div data-aos="fade-left" className="text-center">
          <span className="text-sm font-medium uppercase tracking-[0.4em] text-[#B89B5E]">
            Discover
          </span>
          <h2
            className={`${playfair.className} mt-4 text-4xl font-normal md:text-6xl`}
          >
            Our Services
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-300">
            From clean cuts to sharp beard trims, every service at Comfort Zone
            is done with care, so you leave looking your best.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <div
              key={service.name}
              data-aos="fade-left"
              data-aos-delay={(i % 3) * 150}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={service.src}
                alt={service.name}
                fill
                className="object-cover grayscale transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-8">
                <span
                  className={`${playfair.className} text-5xl text-[#B89B5E]`}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className={`${playfair.className} mt-2 text-2xl`}>
                  {service.name}
                </h3>
                <p className="mt-1 text-gray-300">{service.price}</p>
                <p className="mt-4 max-h-32 overflow-hidden leading-7 text-gray-300 opacity-100 transition-all duration-500 md:mt-0 md:max-h-0 md:opacity-0 md:group-hover:mt-4 md:group-hover:max-h-32 md:group-hover:opacity-100">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}