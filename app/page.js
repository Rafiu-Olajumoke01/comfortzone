import Navbar from "@/components/Navbar/Navbar";
import Hero from "./hero/page";
import About from "@/components/About/About";
import Services from "@/components/Services/Service";
import AosInit from "@/components/AosInit";
import Reviews from "@/components/Review/Review";
import BookNow from "@/components/BookNow/Booknow";
import Footer from "@/components/Footer/Footer";

const Home = () => {
  return (
    <>
      <AosInit />
      <Navbar />
      <Hero />
      <About />
      <Services />
      <Reviews />
      <BookNow/>
      <Footer/>
    </>
  );
};

export default Home;