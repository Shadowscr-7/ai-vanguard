import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import BooksSection from "@/components/landing/BooksSection";
import BundlesSection from "@/components/landing/BundlesSection";
import CoursesSection from "@/components/landing/CoursesSection";
import ComparisonTable from "@/components/landing/ComparisonTable";
import Testimonials from "@/components/landing/Testimonials";
import FAQ from "@/components/landing/FAQ";
import CTA from "@/components/landing/CTA";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Marquee />
      <BooksSection />
      <BundlesSection />
      <CoursesSection />
      <ComparisonTable />
      <Testimonials />
      <FAQ />
      <CTA />
      <Footer />
    </>
  );
}
