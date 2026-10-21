import { Playfair_Display } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["400", "500", "700"] });

const reviews = [
  {
    name: "Ibrahim Adisa",
    service: "Modern Fade",
    rating: 5,
    text: "Great service from start to finish. The barber understood the style I wanted and delivered a clean cut. You can really tell they care about quality.",
  },
  {
    name: "Mutiu Shola",
    service: "Classic Haircut",
    rating: 5,
    text: "The atmosphere is relaxed, the service is excellent, and the haircut always comes out looking fresh. Definitely my favourite barbershop in town.",
  },
  {
    name: "Samuel Adeyemi",
    service: "Beard Trim",
    rating: 5,
    text: "Neat lines, clean finish and no waiting around. I walk out feeling sharp every single time.",
  },
];

const Reviews = () => {
  return (
    <section
      id="reviews"
      className="relative overflow-x-hidden bg-cover bg-fixed bg-center"
      style={{ backgroundImage: "url('/banner-3.webp')" }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-[#15110E] to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#15110E] to-transparent" />

      <div className="relative z-10 mx-auto max-w-5xl px-6 py-24">
        {reviews.map((review) => (
          <div
            key={review.name}
            data-aos="fade-left"
            data-aos-duration="1000"
            className="flex min-h-[70vh] flex-col justify-center text-white"
          >
            <span className={`${playfair.className} text-7xl leading-none text-[#B89B5E]`}>
              &ldquo;
            </span>

            <p className={`${playfair.className} mt-2 text-2xl leading-relaxed md:text-4xl`}>
              {review.text}
            </p>

            <div className="mt-8 border-t border-white/30 pt-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#B89B5E] text-lg font-bold">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{review.name}</p>
                  <p className="text-sm text-gray-300">{review.service}</p>
                  <p className="text-sm text-[#B89B5E]">
                    {"★".repeat(review.rating)}{" "}
                    <span className="text-white">{review.rating}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Reviews;