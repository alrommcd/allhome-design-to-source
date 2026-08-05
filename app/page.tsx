import Image from "next/image";
import ExploreNowHotspot from "@/components/ExploreNowHotspot";

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <Image
        src="/landingpage.png"
        alt="Discover Products That Fit Your Design"
        fill
        priority
        className="object-cover"
      />
      <ExploreNowHotspot />
    </main>
  );
}
