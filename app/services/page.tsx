"use client";

import Footer from "@/components/Footer";
import ServicesTabs from "@/components/ServicesTabs";

export default function ServicesPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32">
      <ServicesTabs />
      <Footer />
    </div>
  );
}
