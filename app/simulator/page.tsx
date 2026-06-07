"use client";

import dynamic from "next/dynamic";
import ProjectsSection from "@/components/projects/ProjectsSection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

const InteractiveSimulator = dynamic(() => import("@/components/InteractiveSimulator"), {
  ssr: false,
  loading: () => (
    <div className="flex min-h-[320px] items-center justify-center text-sm font-semibold text-white/40">
      Loading simulator...
    </div>
  ),
});

export default function SimulatorPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <Reveal>
        <InteractiveSimulator />
      </Reveal>

      <div className="section-divider mx-auto max-w-7xl px-4" />

      <Reveal delayMs={80}>
        <div className="pt-12 sm:pt-16">
          <ProjectsSection embedded />
        </div>
      </Reveal>

      <div className="mt-20">
        <Footer />
      </div>
    </div>
  );
}
