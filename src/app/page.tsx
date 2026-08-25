import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Portfolio from "@/components/Portfolio";
import Services from "@/components/Services";
import TechArsenal from "@/components/TechArsenal";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Portfolio />
        <Services />
        <TechArsenal />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
