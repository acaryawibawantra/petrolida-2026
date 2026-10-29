"use client";

import Layout from "@/layouts/Layout";
import Lenis from "lenis";
import { useEffect } from "react";
import About from "./_components/ui/About";
import Hero from "./_components/ui/Hero";
import Join from "./_components/ui/Join";
import Sponsorship from "./_components/ui/Sponsorship";

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.5,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <Layout withNavbar={true} withFooter={true}>
      <main className="w-full min-h-screen">
        <Hero />
        <About />
        <Join />
        <Sponsorship />
      </main>
    </Layout>
  );
}
