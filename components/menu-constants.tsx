export interface MenuItem {
  _id: string;
  name: string;
  category: "fuchka" | "chatpati" | "corn";
  available: boolean;
}

export interface MenuData {
  items: MenuItem[];
  currentOrder: number;
  waterBottleCount?: number;
  showOrders?: boolean;
  showPayFirst?: boolean;
}

export interface ItemCoords {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  strikeY: number;
}

/**
 * Pixel coordinates calibrated against public/original.jpg (1940 x 1094).
 * x1 starts before the item title; x2 extends past the emoji and price.
 */
export const ITEM_COORDINATES: Record<string, ItemCoords> = {
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
