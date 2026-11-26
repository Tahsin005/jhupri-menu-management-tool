"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { MenuData } from "./menu-constants";

interface Props {
  data: MenuData;
}

interface ItemCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strikeY: number;
}

// Pixel coordinates calibrated against public/original.jpg (1940 x 1094)
// x1 starts before text; x2 extends through the emoji and price
const ITEM_COORDINATES: Record<string, ItemCoords> = {
  // Fuchka items
  "Regular Fuchka": {
    x1: 148,
    y1: 390,
    x2: 915,
    y2: 440,
    strikeY: 414,
  },
  "Naga Fuchka": {
    x1: 148,
    y1: 440,
    x2: 915,
    y2: 490,
    strikeY: 463,
  },
  "Shahi Fuchka": {
    x1: 148,
    y1: 490,
    x2: 915,
    y2: 540,
    strikeY: 513,
  },
  "Doi Fuchka": {
    x1: 148,
    y1: 540,
    x2: 915,
    y2: 594,
    strikeY: 563,
  },

  // Chatpati items
  "Regular Chatpati": {
    x1: 148,
    y1: 799,
    x2: 915,
    y2: 852,
    strikeY: 828,
  },
  "Naga Chatpati": {
    x1: 148,
    y1: 852,
    x2: 915,
    y2: 902,
    strikeY: 878,
  },
  "Shahi Chatpati": {
    x1: 148,
    y1: 902,
    x2: 915,
    y2: 956,
    strikeY: 929,
  },

  // Corn items
  "Regular Masala Corn": {
    x1: 990,
    y1: 799,
    x2: 1835,
    y2: 852,
    strikeY: 825,
  },
  "Sweet Chili Corn": {
    x1: 1165,
    y1: 852,
    x2: 1835,
    y2: 902,
    strikeY: 875,
  },
  "Naga Corn": {
    x1: 1345,
    y1: 902,
    x2: 1835,
    y2: 954,
    strikeY: 925,
  },
};

function getOrderNumberLayout(num: number): { fontSize: number; y: number } {
  if (num >= 1000) return { fontSize: 92, y: 212 };
  if (num >= 100) return { fontSize: 114, y: 220 };
  return { fontSize: 142, y: 230 };
}

interface OrderCardProps {
  id: string;
  x: number;
  label: string;
  labelColor: string;
  value: number;
  valueColor: string;
  cardRef?: React.RefObject<SVGGElement | null>;
  showPulseRing?: boolean;
}

function OrderCard({
  id,
  x,
  label,
  labelColor,
  value,
  valueColor,
  cardRef,
  showPulseRing = false,
}: OrderCardProps) {
  const centerX = x + 147;
  const { fontSize, y } = getOrderNumberLayout(value);

  return (
    <g id={id} ref={cardRef}>
      <rect
        x={x}
        y={56}
        width={294}
        height={238}
        rx={34}
        ry={34}
        fill="#1a0702"
        fillOpacity="0.93"
        stroke="#5c2811"
        strokeOpacity="0.75"
        strokeWidth="1.5"
      />

      {showPulseRing && (
        <rect
          x={x}
          y={56}
          width={294}
          height={238}
          rx={34}
          ry={34}
          fill="#fed329"
          fillOpacity="0"
          stroke="#fed329"
          strokeOpacity="0"
          strokeWidth="3.5"
          className="order-card-ring"
        />
      )}

      <text
        x={centerX}
        y={98}
        textAnchor="middle"
        fill={labelColor}
        fontSize="20"
        fontWeight="800"
        fontFamily="'Google Sans', 'Inter', system-ui, sans-serif"
        letterSpacing="2.5"
      >
        {label}
      </text>

      <text
        x={centerX}
        y={y}
        textAnchor="middle"
        fill={valueColor}
        fontSize={fontSize}
        fontWeight="900"
        fontFamily="'Bebas Neue', Impact, 'Arial Black', sans-serif"
        letterSpacing="4"
        filter="url(#distressedGrunge)"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
      </text>
    </g>
  );
}

const MARQUEE_EMOJIS = [
  "/emojis/chili.png",
  "/emojis/crown.png",
  "/emojis/chatpati-bowl.png",
] as const;

function MarqueeEmoji({ src }: { src: string }) {
  return (
    <Image
      src={src}
      alt=""
      width={40}
      height={40}
      unoptimized
      aria-hidden="true"
      className="w-10 h-10 object-contain shrink-0 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
    />
  );
}

function PayFirstMarquee() {
  const segment = (
    <div className="flex items-center shrink-0">
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          className="flex items-center shrink-0 [text-shadow:0_2px_4px_rgba(0,0,0,0.85)]"
        >
          <span className="text-[25px] leading-[1.45] font-semibold text-[#f9f1e4]/95 tracking-wide px-6 whitespace-nowrap">
            অর্ডার কনফার্ম করে বিল পরিশোধ করুন
          </span>
          <MarqueeEmoji src={MARQUEE_EMOJIS[idx % MARQUEE_EMOJIS.length]} />
          <span
            className="text-[25px] leading-[1.45] font-semibold text-[#fed329]/95 tracking-wide px-6 whitespace-nowrap"
            style={{
              fontFamily: "'Hind Siliguri', 'Google Sans', 'Inter', system-ui, sans-serif",
            }}
          >
            Pay First Policy: Please pay your bill after confirming your order
          </span>
          <MarqueeEmoji src={MARQUEE_EMOJIS[(idx + 1) % MARQUEE_EMOJIS.length]} />
        </div>
      ))}
    </div>
  );

  return (
    <g id="pay-first-marquee">
      <rect x="0" y="1020" width="1940" height="74" fill="#160602" fillOpacity="0.93" />

      <rect
        x="0"
        y="1019"
        width="1940"
        height="2"
        fill="#8d461e"
        fillOpacity="0.8"
        filter="url(#distressedGrunge)"
      />
      <rect x="0" y="1025" width="1940" height="1" fill="#dfa369" fillOpacity="0.22" />

      <foreignObject x="278" y="1022" width="1662" height="72">
        <div className="relative w-full h-full overflow-hidden flex items-center">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-[#160602] to-transparent" />
          <div className="pay-first-marquee-track items-center">
            {segment}
            {segment}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-14 z-10 bg-gradient-to-l from-[#160602] to-transparent" />
        </div>
      </foreignObject>

      <g transform="rotate(-1.2 140 1057)" filter="url(#distressedGrunge)">
        <rect
          x="18"
          y="1028"
          width="244"
          height="58"
          rx="8"
          ry="8"
          fill="#fed329"
        />
        <rect
          x="24"
          y="1033"
          width="232"
          height="48"
          rx="5"
          ry="5"
          fill="none"
          stroke="#1a0702"
          strokeWidth="2"
          strokeOpacity="0.85"
        />
        <text
          x="140"
          y="1068"
          textAnchor="middle"
          fill="#1a0702"
          fontSize="30"
          fontWeight="800"
          fontFamily="'Bebas Neue', Impact, 'Arial Black', sans-serif"
          letterSpacing="2.5"
        >
          PAY FIRST
        </text>
      </g>
    </g>
  );
}

export default function ImageMenuDisplay({ data }: Props) {
  const showOrders = data.showOrders !== false;
  const showPayFirst = data.showPayFirst !== false;
  const currentOrder = data.currentOrder ?? 1;
  const nextOrder = currentOrder + 1;

  const currentCardRef = useRef<SVGGElement>(null);
  const prevOrderRef = useRef<number | null>(null);

  useEffect(() => {
    const prev = prevOrderRef.current;
    prevOrderRef.current = currentOrder;
    if (prev === null || prev === currentOrder) return;

    const el = currentCardRef.current;
    if (!el) return;

    el.classList.remove("order-card-pulse");
    // Force reflow so consecutive rapid updates re-trigger the highlight animation
    void el.getBoundingClientRect();
    el.classList.add("order-card-pulse");

    const timer = setTimeout(() => {
      el.classList.remove("order-card-pulse");
    }, 1700);

    return () => clearTimeout(timer);
  }, [currentOrder]);

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

          {showOrders && (
            <g id="order-display-cards" className="transition-all duration-300">
              <OrderCard
                id="current-order-card"
                x={598}
                label="CURRENT ORDER"
                labelColor="#dfa369"
                value={currentOrder}
                valueColor="#fed329"
                cardRef={currentCardRef}
                showPulseRing
              />
              <OrderCard
                id="next-order-card"
                x={943}
                label="NEXT ORDER"
                labelColor="#ffffff"
                value={nextOrder}
                valueColor="#ffffff"
              />
            </g>
          )}

          {data.items.map((item) => {
            if (item.available) return null;
            const coords = ITEM_COORDINATES[item.name];
            if (!coords) return null;

            const { x1, y1, x2, y2, strikeY } = coords;

            return (
              <g
                key={item._id}
                id={`unavailable-${item._id}`}
                className="transition-opacity duration-300"
              >
                <rect
                  x={x1 - 8}
                  y={y1}
                  width={x2 - x1 + 16}
                  height={y2 - y1}
                  rx="8"
                  ry="8"
                  fill="#120401"
                  fillOpacity="0.80"
                />

                <rect
                  x={x1}
                  y={strikeY - 1}
                  width={x2 - x1}
                  height={2}
                  rx={1}
                  fill="#f5d5b8"
                  fillOpacity="0.60"
                />
              </g>
            );
          })}

          {showPayFirst && <PayFirstMarquee />}
        </svg>
      </div>
    </div>
  );
}
