"use client";

import { ITEM_COORDINATES, MenuItem } from "../menu-constants";

interface UnavailableItemOverlaysProps {
  items: MenuItem[];
}

/**
 * Draws dimmed overlays and full-width strikethroughs over unavailable menu rows.
 */
export default function UnavailableItemOverlays({ items }: UnavailableItemOverlaysProps) {
  return (
    <>
      {items.map((item) => {
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
    </>
  );
}
