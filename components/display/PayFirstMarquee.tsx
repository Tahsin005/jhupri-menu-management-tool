"use client";

import Image from "next/image";

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

/**
 * Renders the rustic bottom Pay First news-style ticker inside the SVG canvas.
 */
export default function PayFirstMarquee() {
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
