import AboutSection from "@/components/home/about-section";
import ContactSection from "@/components/home/contact-section";
import HeroSection from "@/components/home/hero-section";
import OurWorksSection from "@/components/home/our-works-section";
import ServicesSection from "@/components/home/services-section";
import SiteFooter from "@/components/home/site-footer";
import SiteHeader from "@/components/home/site-header";
import WorkSection from "@/components/home/work-section";

export default function HomePage() {
  return (
    <div className="relative overflow-x-hidden">
      <div className="absolute inset-x-0 top-0 -z-10 h-[28rem] bg-[radial-gradient(circle_at_top,rgba(224,161,46,0.18),transparent_62%)]" />
      <div className="absolute left-0 top-[30rem] -z-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(19,107,84,0.08),transparent_72%)] blur-3xl" />
      <div className="absolute right-0 top-[62rem] -z-10 h-80 w-80 rounded-full bg-[radial-gradient(circle,rgba(163,96,24,0.10),transparent_70%)] blur-3xl" />

      <SiteHeader />

      <main id="top">
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <OurWorksSection />
        <WorkSection />
        <ContactSection />
        <SiteFooter />
      </main>
    </div>
  );
}
