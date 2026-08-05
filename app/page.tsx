import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen items-end justify-center overflow-hidden">
      <Image
        src="/landingpage.png"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* landingpage.png has its own headline/button baked into the photo itself, roughly
          centered vertically (it's a full marketing mockup, not a plain background plate).
          Real content below is bottom-anchored into the clean lower third of the frame so
          it never overlaps that baked-in text, rather than trying to opacity-mask it out
          (light letterforms stay faintly visible even under a near-opaque scrim). */}
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/35 to-transparent" aria-hidden />

      <div className="relative flex flex-col items-center px-6 pb-16 text-center md:pb-24">
        <h1 className="max-w-3xl font-display text-4xl font-medium leading-tight text-paper md:text-6xl">
          See What Belongs In This Room
        </h1>
        <p className="mt-5 max-w-xl text-sm text-paper/85 md:text-base">
          Select a room and match its design language to real AllHome product lines, physical form first.
        </p>
        <Link
          href="/source"
          className="mt-8 rounded-full bg-brass px-8 py-3 font-body text-sm font-medium uppercase tracking-widest text-charcoal transition-opacity hover:opacity-90"
        >
          Start Sourcing
        </Link>
      </div>
    </main>
  );
}
