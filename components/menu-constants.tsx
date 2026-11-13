import Image from "next/image";

export interface MenuItem {
  _id: string;
  name: string;
  category: "fuchka" | "chatpati" | "corn";
  available: boolean;
}

export interface MenuData {
  items: MenuItem[];
  currentOrder: number;
  scale?: number;
  waterBottleCount?: number;
  showOrders?: boolean;
}

export const PRICES: Record<string, number> = {
  "Regular Fuchka": 100,
  "Naga Fuchka": 100,
  "Shahi Fuchka": 120,
  "Doi Fuchka": 150,
  "Regular Chatpati": 90,
  "Naga Chatpati": 90,
  "Shahi Chatpati": 110,
  "Regular Masala Corn": 100,
  "Sweet Chili Corn": 110,
  "Naga Corn": 125,
};

export const BN_TITLES: Record<string, string> = {
  "Regular Fuchka": "রেগুলার ফুচকা | Regular Fuchka",
  "Naga Fuchka": "নাগা ফুচকা | Naga Fuchka",
  "Shahi Fuchka": "শাহী ফুচকা | Shahi Fuchka",
  "Doi Fuchka": "দই ফুচকা | Doi Fuchka",
  "Regular Chatpati": "রেগুলার চটপটি | Regular Chatpati",
  "Naga Chatpati": "নাগা চটপটি | Naga Chatpati",
  "Shahi Chatpati": "শাহী চটপটি | Shahi Chatpati",
  "Regular Masala Corn": "রেগুলার মাসালা কর্ন | Regular Corn",
  "Sweet Chili Corn": "সুইট চিলি কর্ন | Sweet Chili Corn",
  "Naga Corn": "নাগা কর্ন | Naga Corn",
};

export const ICONS: Record<string, string> = {
  "Regular Fuchka": "🍲",
  "Naga Fuchka": "🌶️",
  "Shahi Fuchka": "👑",
  "Doi Fuchka": "🥣",
  "Regular Chatpati": "🍲",
  "Naga Chatpati": "🌶️",
  "Shahi Chatpati": "👑",
  "Regular Masala Corn": "🌽",
  "Sweet Chili Corn": "🍯",
  "Naga Corn": "🔥",
};

export function ItemRow({ item }: { item: MenuItem }) {
  const available = item.available;
  return (
    <div
      className={`flex items-center justify-between transition-opacity duration-300 ${
        available ? "opacity-100" : "opacity-35"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0">
        {!available && (
          <span className="text-[9px] font-bold bg-red-700 text-white rounded px-1.5 py-0.5 uppercase tracking-wider shrink-0">
            নেই
          </span>
        )}
        <span
          className={`text-white font-bold text-base lg:text-lg tracking-wide truncate ${
            available ? "" : "line-through"
          }`}
        >
          {BN_TITLES[item.name] ?? item.name}{" "}
          <span className="text-sm">{ICONS[item.name] ?? ""}</span>
        </span>
      </div>
      <span
        className={`font-bold text-lg lg:text-xl tabular-nums ml-4 shrink-0 ${
          available ? "text-white" : "text-white/30 line-through"
        }`}
      >
        {PRICES[item.name]}
      </span>
    </div>
  );
}

