"use client";

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
  textX2: number;
}

// Pixel coordinates calibrated against public/original.jpg (1940 x 1094)
// textX2 ends exactly at the text without crossing decorative emojis/icons
const ITEM_COORDINATES: Record<string, ItemCoords> = {
  // Fuchka items
  "Regular Fuchka": {
    x1: 148,
    y1: 390,
    x2: 915,
    y2: 440,
    strikeY: 417,
    textX2: 685,
  },
  "Naga Fuchka": {
    x1: 148,
    y1: 440,
    x2: 915,
    y2: 490,
    strikeY: 467,
    textX2: 575,
  },
  "Shahi Fuchka": {
    x1: 148,
    y1: 490,
    x2: 915,
    y2: 540,
    strikeY: 515,
    textX2: 645,
  },
  "Doi Fuchka": {
    x1: 148,
    y1: 540,
    x2: 915,
    y2: 590,
    strikeY: 564,
    textX2: 525,
  },

  // Chatpati items
  "Regular Chatpati": {
    x1: 148,
    y1: 802,
    x2: 915,
    y2: 852,
    strikeY: 824,
    textX2: 725,
  },
  "Naga Chatpati": {
    x1: 148,
    y1: 852,
    x2: 915,
    y2: 902,
    strikeY: 874,
    textX2: 615,
  },
  "Shahi Chatpati": {
    x1: 148,
    y1: 902,
    x2: 915,
    y2: 952,
    strikeY: 927,
    textX2: 680,
  },

  // Corn items
  "Regular Masala Corn": {
    x1: 990,
    y1: 802,
    x2: 1835,
    y2: 852,
    strikeY: 828,
    textX2: 1682,
  },
  "Sweet Chili Corn": {
    x1: 1165,
    y1: 852,
    x2: 1835,
    y2: 902,
    strikeY: 874,
    textX2: 1685,
  },
  "Naga Corn": {
    x1: 1345,
    y1: 902,
    x2: 1835,
    y2: 952,
    strikeY: 928,
    textX2: 1682,
  },
};

export default function ImageMenuDisplay({ data }: Props) {
  const showOrders = data.showOrders !== false;
  const currentOrder = data.currentOrder ?? 1;
  const nextOrder = currentOrder + 1;

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
            <filter id="numShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.85" />
            </filter>

            <filter id="ambientCard" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="14" floodColor="#000000" floodOpacity="0.6" />
            </filter>
          </defs>

          <image href="/original.jpg" width="1940" height="1094" />

          {showOrders && (
            <g id="order-display-cards" className="transition-all duration-300">
              <g id="current-order-card" filter="url(#ambientCard)">
                <rect
                  x="530"
                  y="48"
                  width="295"
                  height="180"
                  rx="20"
                  ry="20"
                  fill="#000000"
                  fillOpacity="0.25"
                  stroke="#c47a35"
                  strokeWidth="1.5"
                  strokeOpacity="0.35"
                />

                <text
                  x="677"
                  y="82"
                  textAnchor="middle"
                  fill="#dfa369"
                  fontSize="20"
                  fontWeight="700"
                  fontFamily="'Hind Siliguri', 'Anek Bangla', 'Georgia', serif"
                  letterSpacing="1"
                >
                  এখন চলছে
                </text>

                <text
                  x="677"
                  y="162"
                  textAnchor="middle"
                  fill="#e8b958"
                  fontSize="88"
                  fontWeight="900"
                  fontFamily="'Hind Siliguri', 'Georgia', 'Times New Roman', serif"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  filter="url(#numShadow)"
                >
                  {currentOrder}
                </text>

                <text
                  x="677"
                  y="196"
                  textAnchor="middle"
                  fill="#ffffff"
                  fillOpacity="0.4"
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="'Google Sans', 'Inter', sans-serif"
                  letterSpacing="3"
                >
                  CURRENT ORDER
                </text>
              </g>

              <g id="next-order-card" filter="url(#ambientCard)">
                <rect
                  x="875"
                  y="48"
                  width="295"
                  height="180"
                  rx="20"
                  ry="20"
                  fill="#000000"
                  fillOpacity="0.25"
                  stroke="#ffffff"
                  strokeWidth="1.5"
                  strokeOpacity="0.15"
                />

                <text
                  x="1022"
                  y="82"
                  textAnchor="middle"
                  fill="#e5e7eb"
                  fontSize="20"
                  fontWeight="700"
                  fontFamily="'Hind Siliguri', 'Anek Bangla', 'Georgia', serif"
                  letterSpacing="1"
                >
                  পরবর্তী
                </text>

                <text
                  x="1022"
                  y="162"
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="88"
                  fontWeight="900"
                  fontFamily="'Hind Siliguri', 'Georgia', 'Times New Roman', serif"
                  style={{ fontVariantNumeric: "tabular-nums" }}
                  filter="url(#numShadow)"
                >
                  {nextOrder}
                </text>

                <text
                  x="1022"
                  y="196"
                  textAnchor="middle"
                  fill="#ffffff"
                  fillOpacity="0.4"
                  fontSize="10.5"
                  fontWeight="700"
                  fontFamily="'Google Sans', 'Inter', sans-serif"
                  letterSpacing="3"
                >
                  NEXT ORDER
                </text>
              </g>
            </g>
          )}

          {data.items.map((item) => {
            if (item.available) return null;
            const coords = ITEM_COORDINATES[item.name];
            if (!coords) return null;

            const { x1, y1, x2, y2, strikeY, textX2 } = coords;

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
                  fill="#000000"
                  fillOpacity="0.55"
                />

                <rect
                  x={x1}
                  y={strikeY - 1}
                  width={textX2 - x1}
                  height={2}
                  rx={1}
                  fill="#ffffff"
                  fillOpacity="0.65"
                />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
