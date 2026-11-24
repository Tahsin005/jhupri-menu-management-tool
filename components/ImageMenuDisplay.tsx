"use client";

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

export default function ImageMenuDisplay({ data }: Props) {
  const showOrders = data.showOrders !== false;
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
        </svg>
      </div>
    </div>
  );
}
