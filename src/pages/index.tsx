import AboutSection from "@/components/home/about-section";
import ContactSection from "@/components/home/contact-section";
import EventAnnouncementSection from "@/components/home/event-announcement-section";
import HeroSection from "@/components/home/hero-section";
import OurWorksSection from "@/components/home/our-works-section";
import ServicesSection from "@/components/home/services-section";
import SiteFooter from "@/components/home/site-footer";
import SiteHeader from "@/components/home/site-header";

export default function HomePage() {
  return (
    <div className="relative overflow-x-clip">
      <SiteHeader />

      <main id="top">
        <HeroSection />
        <EventAnnouncementSection />
        <OurWorksSection />
        <AboutSection />
        <ServicesSection />
        <ContactSection />
        <SiteFooter />
      </main>
    </div>
  );
}
