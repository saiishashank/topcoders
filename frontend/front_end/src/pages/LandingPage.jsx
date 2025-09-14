import { Header } from "@/components/landing/Header.jsx";
import { HeroSection } from "@/components/landing/HeroSection.jsx";
import { Community } from "@/components/landing/Community.jsx";
import { CallToActionSection } from "@/components/landing/CallToActionSection.jsx";
import { Footer } from "@/components/landing/Footer.jsx";

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <Community />
        <CallToActionSection />
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;