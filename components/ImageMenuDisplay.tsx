"use client";

import { MenuData } from "./menu-constants";
import OrderDisplayCards from "./display/OrderDisplayCards";
import PayFirstMarquee from "./display/PayFirstMarquee";
import UnavailableItemOverlays from "./display/UnavailableItemOverlays";

interface Props {
  data: MenuData;
}

/**
 * Full-screen SVG menu display rendered over public/original.jpg with real-time
 * order cards, unavailable-item overlays, and the optional Pay First marquee.
 */
export default function ImageMenuDisplay({ data }: Props) {
  const showOrders = data.showOrders !== false;
  const showPayFirst = data.showPayFirst !== false;
  const currentOrder = data.currentOrder ?? 1;

  return (
    <div className="w-full h-full flex items-center justify-center bg-[#0c0502] overflow-hidden select-none">
      <div
        className="relative max-w-full max-h-full flex items-center justify-center"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <svg
          viewBox="0 0 1940 1094"
          className="w-full h-full object-contain pointer-events-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="distressedGrunge" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.22" numOctaves="3" result="noise" />
              <feColorMatrix
                type="matrix"
                values="1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 8 -1.6"
                in="noise"
                result="grungeMask"
              />
              <feComposite in="SourceGraphic" in2="grungeMask" operator="in" />
            </filter>
          </defs>

          <image href="/original.jpg" width="1940" height="1094" />

          {showOrders && <OrderDisplayCards currentOrder={currentOrder} />}

          <UnavailableItemOverlays items={data.items} />

          {showPayFirst && <PayFirstMarquee />}
        </svg>
      </div>
    </div>
  );
}
