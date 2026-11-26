"use client";

import { useEffect, useRef } from "react";

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

function getOrderNumberLayout(num: number): { fontSize: number; y: number } {
  if (num >= 1000) return { fontSize: 92, y: 212 };
  if (num >= 100) return { fontSize: 114, y: 220 };
  return { fontSize: 142, y: 230 };
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

interface OrderDisplayCardsProps {
  currentOrder: number;
}

/**
 * Renders the CURRENT ORDER and NEXT ORDER SVG cards with a highlight pulse
 * whenever the current order number changes.
 */
export default function OrderDisplayCards({ currentOrder }: OrderDisplayCardsProps) {
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
  );
}
