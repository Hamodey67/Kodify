"use client";

import InteractiveSimulator from "@/components/InteractiveSimulator";
import ProjectsSection from "@/components/projects/ProjectsSection";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";

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
