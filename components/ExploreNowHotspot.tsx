"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";

// Exact bounding box of the "EXPLORE NOW" pill baked into public/landingpage.png,
// measured by scanning the source file's raw pixels for its distinct fill color
// (not eyeballed): the source image is 1808x870, button spans x:[796,1012] y:[418,461].
const IMAGE_NATURAL_WIDTH = 1808;
const IMAGE_NATURAL_HEIGHT = 870;
const BUTTON_BOX = { left: 796, top: 418, right: 1012, bottom: 461 };

// The hero <Image> uses object-fit: cover with default (center) object-position.
// This replicates that exact crop math against the container's real rendered size,
// so the invisible hotspot lands precisely on the button at any viewport/aspect
// ratio, not just the one it was eyeballed against.
export default function ExploreNowHotspot() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<CSSProperties>({ opacity: 0 });

  useEffect(() => {
    function recompute() {
      const container = containerRef.current;
      if (!container) return;
      const { width: cw, height: ch } = container.getBoundingClientRect();
      const scale = Math.max(cw / IMAGE_NATURAL_WIDTH, ch / IMAGE_NATURAL_HEIGHT);
      const renderedW = IMAGE_NATURAL_WIDTH * scale;
      const renderedH = IMAGE_NATURAL_HEIGHT * scale;
      const offsetX = (cw - renderedW) / 2;
      const offsetY = (ch - renderedH) / 2;

      setStyle({
        position: "absolute",
        left: offsetX + BUTTON_BOX.left * scale,
        top: offsetY + BUTTON_BOX.top * scale,
        width: (BUTTON_BOX.right - BUTTON_BOX.left) * scale,
        height: (BUTTON_BOX.bottom - BUTTON_BOX.top) * scale,
      });
    }
    recompute();
    window.addEventListener("resize", recompute);
    return () => window.removeEventListener("resize", recompute);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Link href="/source" aria-label="Explore now" style={style} />
    </div>
  );
}
