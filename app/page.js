import Hero from "./hero/page";
import About from "@/components/About/About";
import Services from "@/components/Services/Service";
import AosInit from "@/components/AosInit";

export default function Home() {
  return (
    <>
      <AosInit />
      <Hero />
      <About />
      <Services />
    </>
  );
}