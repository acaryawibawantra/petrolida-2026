import Layout from "@/layouts/Layout";
import Contact from "./_components/Contact";
import Guidebook from "./_components/Guidebook";
import HeroAbout from "./_components/HeroAbout";
import LookingBack from "./_components/LookingBack";
import PetrovisVisit from "./_components/PetrovisVisit";

export default function page() {
  return (
    <Layout withNavbar withFooter>
      <HeroAbout />
      <PetrovisVisit />
      <LookingBack />
      <Guidebook />
      <Contact />
    </Layout>
  );
}
