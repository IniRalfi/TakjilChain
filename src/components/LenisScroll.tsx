"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function LenisScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2, // Durasi efek smooth
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Fungsi kurva scroll
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true, // Aktif di mouse wheel (desktop)
      wheelMultiplier: 1,
      // smoothTouch dibiarkan false (bawaan lenis) agar HP tetap native scroll & tidak lag
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup saat unmount
    return () => {
      lenis.destroy();
    };
  }, []);

  // Komponen ini gak render UI apapun, murni cuma nempel event listener saja.
  return null;
}
