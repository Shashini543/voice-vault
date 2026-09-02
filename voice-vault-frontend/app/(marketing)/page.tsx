import { Hero } from "@/components/marketing/Hero";
import { WorkflowSection } from "@/components/marketing/WorkflowSection";
import { FeaturesSection } from "@/components/marketing/FeaturesSection";
import { HowItWorksSection } from "@/components/marketing/HowItWorksSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <WorkflowSection />
      <FeaturesSection />
      <HowItWorksSection />
    </>
  );
}
