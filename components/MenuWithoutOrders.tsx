import Image from "next/image";
import { MenuItem, MenuData } from "./menu-constants";

interface Props {
  data: MenuData;
  scaleFactor: number;
}

const PRICES: Record<string, number> = {
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

const BN_TITLES: Record<string, string> = {
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

const ICONS: Record<string, string> = {
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

function MenuOnlyRow({ item }: { item: MenuItem }) {
  const available = item.available;
  return (
    <div
      className={`flex items-baseline justify-between transition-opacity duration-300 ${
        available ? "opacity-100" : "opacity-35"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 pr-4">
        {!available && (
          <span className="text-[10px] font-bold bg-red-700 text-white rounded px-1.5 py-0.5 uppercase tracking-wider shrink-0 font-sans">
            নেই
          </span>
        )}
        <span
          className={`font-serif font-bold text-lg lg:text-[22px] text-white tracking-wide truncate ${
            available ? "" : "line-through"
          }`}
        >
          {BN_TITLES[item.name] ?? item.name}{" "}
          <span className="text-base lg:text-lg">{ICONS[item.name] ?? ""}</span>
        </span>
      </div>
      <span
        className={`font-serif font-bold text-xl lg:text-2xl tabular-nums shrink-0 ${
          available ? "text-white" : "text-white/30 line-through"
        }`}
      >
        {PRICES[item.name]}
      </span>
    </div>
  );
}

export default function MenuWithoutOrders({ data, scaleFactor }: Props) {
  const fuchka = data.items.filter((i) => i.category === "fuchka");
  const chatpati = data.items.filter((i) => i.category === "chatpati");
  const corn = data.items.filter((i) => i.category === "corn");

  return (
    <div
      className="p-6 lg:p-10 flex flex-col justify-between font-sans select-none overflow-hidden"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        width: `${100 / scaleFactor}vw`,
        height: `${100 / scaleFactor}vh`,
        transform: `scale(${scaleFactor})`,
        transformOrigin: "top left",
      }}
    >
      {/* Top Row: Q1 (Top-Left) Fuchka & Header + Q2 (Top-Right) Food Collage */}
      <div className="flex gap-10 items-center justify-between h-[52%] min-h-0">
        {/* Q1: Top-Left Quadrant (Logo + MENU + Fuchka) */}
        <div className="w-[48%] max-w-[780px] flex flex-col justify-between h-full min-w-0">
          {/* Header: Logo + MENU badge */}
          <div className="flex items-center gap-6 lg:gap-10 pt-1 pb-2 shrink-0">
            <Image
              src="/logo.svg"
              alt="Jhupri Logo"
              width={125}
              height={125}
              priority
              className="rounded-full border-2 border-[#c47a35]/80 shadow-2xl shadow-black/90 w-[90px] h-[90px] lg:w-[120px] lg:h-[120px] object-cover shrink-0"
            />
            <Image
              src="/menu-badge.png"
              alt="MENU"
              width={200}
              height={110}
              priority
              className="w-[130px] h-auto lg:w-[180px] object-contain drop-shadow-[0_8px_20px_rgba(0,0,0,0.8)]"
            />
          </div>

          {/* Fuchka List */}
          <div className="pb-1 pl-6 lg:pl-10">
            <h2 className="font-serif font-black text-white text-2xl lg:text-[28px] tracking-wide mb-2.5">
              ফুচকা | Fuchka
            </h2>
            <div className="flex flex-col gap-2.5 lg:gap-3">
              {fuchka.map((item) => (
                <MenuOnlyRow key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>

        {/* Q2: Top-Right Quadrant: Food Photos Collage */}
        <div className="w-[48%] h-full relative flex items-center justify-center shrink-0">
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Corn cup (top center, nestled behind) */}
            <div className="absolute top-[4%] left-[49%] -translate-x-1/2 w-[34%] aspect-[290/296] z-10 drop-shadow-[0_15px_25px_rgba(0,0,0,0.85)]">
              <Image
                src="/food-items/corn.png"
                alt="Jhupri Masala Corn"
                fill
                sizes="25vw"
                priority
                className="object-contain object-bottom"
              />
            </div>

            {/* Fuchka bowl (bottom left) */}
            <div className="absolute bottom-[2%] left-0 w-[56%] aspect-[659/456] z-20 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
              <Image
                src="/food-items/fuchka.png"
                alt="Jhupri Special Fuchka"
                fill
                sizes="35vw"
                priority
                className="object-contain object-bottom"
              />
            </div>

            {/* Chatpati dish (bottom right) */}
            <div className="absolute bottom-[3%] right-0 w-[52%] aspect-[611/413] z-20 drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]">
              <Image
                src="/food-items/chatpati.png"
                alt="Jhupri Special Chatpati"
                fill
                sizes="35vw"
                priority
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Q3 (Bottom-Left) Chatpati + Q4 (Bottom-Right) Corn */}
      <div className="flex gap-10 items-start justify-between h-[44%] min-h-0 pt-6 lg:pt-8">
        {/* Q3: Bottom-Left Quadrant (Chatpati) */}
        <div className="w-[48%] max-w-[780px] flex flex-col justify-start h-full min-w-0 pl-6 lg:pl-10">
          <h2 className="font-serif font-black text-white text-2xl lg:text-[28px] tracking-wide mb-2.5">
            চটপটি | Chatpati
          </h2>
          <div className="flex flex-col gap-2.5 lg:gap-3">
            {chatpati.map((item) => (
              <MenuOnlyRow key={item._id} item={item} />
            ))}
          </div>
        </div>

        {/* Q4: Bottom-Right Quadrant (Masala Corn) */}
        <div className="w-[48%] max-w-[780px] flex flex-col justify-start h-full min-w-0">
          <h2 className="font-serif font-black text-white text-2xl lg:text-[28px] tracking-wide mb-2.5">
            মাসালা কর্ন | Corn
          </h2>
          <div className="flex flex-col gap-2.5 lg:gap-3">
            {corn.map((item) => (
              <MenuOnlyRow key={item._id} item={item} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
