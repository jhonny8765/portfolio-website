import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Portfolio from '@/components/Portfolio';
import ResumeService from '@/components/ResumeService';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main>
      <Hero />
      <Services />
      <Portfolio />
      <ResumeService />
      <Contact />
      <Footer />
    </main>
  );
}
