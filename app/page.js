import Hero from "./hero/page";
import About from "@/components/About/About";
import Services from "@/components/Services/Service";
import AosInit from "@/components/AosInit";
import Reviews from "@/components/Review/Review";
import BookNow from "@/components/BookNow/BookNow";

const Home = () => {
  return (
    <>
      <AosInit />
      <Hero />
      <About />
      <Services />
      <Reviews />
      <BookNow />
    </>
  );
};

export default Home;