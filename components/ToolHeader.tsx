import Link from "next/link";
import Image from "next/image";

// The one persistent "back to start" mechanism for the whole tool flow - present on
// every screen (template picker, results, quotation). Clicking the logo returns to
// the landing page at "/". Distinct from QuoteView's "Back to sourcing" link, which
// only toggles between the quote screen and the source view within the tool itself.
export default function ToolHeader() {
  return (
    <header className="border-b border-paper-line px-6 py-4 md:px-10">
      <Link href="/" className="inline-flex items-center gap-2 transition-opacity hover:opacity-80">
        <Image src="/logo.png" alt="AllHome, back to start" width={597} height={335} className="h-7 w-auto md:h-8" priority />
      </Link>
    </header>
  );
}
