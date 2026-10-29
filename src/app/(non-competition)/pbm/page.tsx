import Layout from "@/layouts/Layout";
import About from "./_components/ui/About";
import Hero from "./_components/ui/Hero";
import Objective from "./_components/ui/Objective";
import PBM from "./_components/ui/PBM";
import SpeakerSection from "./_components/ui/Speaker";
import Will from "./_components/ui/Will";

export default function PBMBrandingPage() {
  return (
    <Layout withNavbar withFooter>
      <Hero />
      <PBM />
      <Objective />
      <About />
      <SpeakerSection />
      <Will />
    </Layout>
  );
}
