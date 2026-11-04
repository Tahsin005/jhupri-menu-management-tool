"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Tv, Monitor, ExternalLink } from "lucide-react";
import { getPusherClient } from "@/lib/pusher-client";

interface MenuItem {
  _id: string;
  name: string;
  category: "fuchka" | "chatpati" | "corn";
  available: boolean;
}

interface MenuData {
  items: MenuItem[];
  currentOrder: number;
  scale?: number;
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
  "Regular Masala Corn": "রেগুলার মসলা কর্ন | Regular Corn",
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

function ItemRow({ item }: { item: MenuItem }) {
  const available = item.available;
  return (
    <div
      className={`flex items-center justify-between transition-opacity duration-300 ${
        available ? "opacity-100" : "opacity-35"
      }`}
    >
      <div className="flex items-center gap-2">
        {!available && (
          <span className="text-[9px] font-bold bg-red-700 text-white rounded px-1.5 py-0.5 uppercase tracking-wider">
            নেই
          </span>
        )}
        <span
          className={`text-white font-bold text-base lg:text-lg tracking-wide ${
            available ? "" : "line-through"
          }`}
        >
          {BN_TITLES[item.name] ?? item.name}{" "}
          <span className="text-sm">{ICONS[item.name] ?? ""}</span>
        </span>
      </div>
      <span
        className={`font-bold text-lg lg:text-xl tabular-nums ml-4 ${
          available ? "text-white" : "text-white/30 line-through"
        }`}
      >
        {PRICES[item.name]}
      </span>
    </div>
  );
}

export default function MenuDisplay() {
  const [data, setData] = useState<MenuData | null>(null);

  const fetchMenu = useCallback(async () => {
    try {
      const res = await fetch("/api/menu", { cache: "no-store" });
      if (res.ok) setData(await res.json());
    } catch {
      // silent retry on interval
    }
  }, []);

  useEffect(() => {
    fetchMenu();

    const pusher = getPusherClient();
    const channel = pusher.subscribe("jhupri-channel");

    channel.bind(
      "order-update",
      (payload: { currentOrder?: number; scale?: number }) => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentOrder: payload.currentOrder ?? prev.currentOrder,
            scale: payload.scale ?? prev.scale,
          };
        });
      }
    );

    channel.bind(
      "item-update",
      (payload: { itemId: string; available: boolean }) => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            items: prev.items.map((item) =>
              String(item._id) === String(payload.itemId)
                ? { ...item, available: payload.available }
                : item
            ),
          };
        });
      }
    );

    channel.bind("menu-refresh", () => {
      fetchMenu();
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [fetchMenu]);

  if (!data) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{
          backgroundImage: "url('/bg.jpeg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Image
          src="/logo.jpg"
          alt="Jhupri"
          width={130}
          height={130}
          className="rounded-full opacity-60 animate-pulse border-2 border-[#c47a35]/60"
        />
      </div>
    );
  }

  const fuchka = data.items.filter((i) => i.category === "fuchka");
  const chatpati = data.items.filter((i) => i.category === "chatpati");
  const corn = data.items.filter((i) => i.category === "corn");
  const scale = data.scale ?? 100;

  const scaleFactor = scale / 100;

  return (
    <>
      <div className="small-device-warning fixed inset-0 z-50 bg-[#0c0502] flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
        <div className="max-w-md w-full flex flex-col items-center my-auto">
          <Image
            src="/logo.jpg"
            alt="Jhupri Logo"
            width={84}
            height={84}
            className="rounded-full border-2 border-[#c47a35]/80 shadow-2xl shadow-black/90 mb-2"
          />
          <span className="text-[#c47a35] text-xs font-bold tracking-wider mb-6">
            টক • ঝাল • মিষ্টি
          </span>

          <div className="w-16 h-16 rounded-2xl bg-[#c47a35]/20 border border-[#c47a35]/40 flex items-center justify-center text-[#e8b958] mb-5 shadow-lg shadow-orange-950/40">
            <Tv className="w-8 h-8" />
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-white mb-1.5 tracking-wide">
            টিভি বা বড় স্ক্রিনে ওপেন করুন
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#e8b958] tracking-widest uppercase mb-4">
            TV & Large Display Screen Only
          </p>

          <p className="text-white/70 text-xs sm:text-sm leading-relaxed mb-6">
            এই ডিজিটাল মেনু বোর্ডটি রেস্তোরাঁর ২১ ইঞ্চি টিভি বা বড় ল্যান্ডস্কেপ মনিটরে প্রদর্শনের জন্য তৈরি করা হয়েছে। মোবাইল বা ট্যাবলেটের ছোট স্ক্রিনে এটি সাপোর্ট করে না।
          </p>

          <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs text-white/60 flex items-center gap-3 text-left mb-6">
            <Monitor className="w-6 h-6 text-[#c47a35] shrink-0" />
            <div>
              <p className="font-bold text-white/90">প্রস্তাবিত রেজ্যুলিউশন:</p>
              <p>1920 × 1080 (16:9 Landscape টিভি বা মনিটর)</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="overflow-hidden select-none"
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
      <div
        className="p-5 lg:p-7 flex gap-6 lg:gap-8 font-sans"
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
      <div className="w-28 lg:w-36 shrink-0 flex flex-col justify-between h-full py-1">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/logo.jpg"
            alt="Jhupri Logo"
            width={110}
            height={110}
            className="rounded-full border-2 border-[#c47a35]/80 shadow-xl shadow-black/80 w-[88px] h-[88px] lg:w-[110px] lg:h-[110px] object-cover"
          />
          <span className="text-[#c47a35] text-[11px] lg:text-xs font-bold tracking-wider mt-1.5 text-center whitespace-nowrap">
            টক • ঝাল • মিষ্টি
          </span>
        </div>

        <div className="flex-1 my-3 rounded-2xl border border-white/20 bg-black/25 backdrop-blur-xs flex flex-col items-center justify-between py-5 px-2 shadow-xl shadow-black/40">
          <span className="text-[#dfa369] text-xs font-semibold tracking-wider text-center">
            এখন চলছে
          </span>
          <span
            className="font-serif font-black text-[#e8b958] tabular-nums leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{ fontSize: "clamp(3.5rem, 5.5vw, 5rem)" }}
          >
            {data.currentOrder}
          </span>
          <span className="text-white/40 text-[9px] tracking-widest font-semibold uppercase text-center">
            CURRENT ORDER
          </span>
        </div>

        <div className="flex-1 rounded-2xl border border-white/20 bg-black/25 backdrop-blur-xs flex flex-col items-center justify-between py-5 px-2 shadow-xl shadow-black/40">
          <span className="text-[#dfa369] text-xs font-semibold tracking-wider text-center">
            পরবর্তী
          </span>
          <span
            className="font-serif font-black text-white tabular-nums leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
            style={{ fontSize: "clamp(3.5rem, 5.5vw, 5rem)" }}
          >
            {data.currentOrder + 1}
          </span>
          <span className="text-white/40 text-[9px] tracking-widest font-semibold uppercase text-center">
            NEXT ORDER
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-between h-full min-w-0 relative">
        <div className="flex gap-6 items-center justify-between h-[49%] min-h-0 pt-4 lg:pt-6">
          <div className="flex-1 flex flex-col justify-center h-full max-w-xl pr-4">
            <div>
              <div className="flex items-baseline justify-between pb-1.5">
                <h2 className="text-white font-extrabold text-xl lg:text-2xl tracking-wide">
                  ফুচকা{" "}
                  <span className="text-white/70 text-base font-normal tracking-wider">
                    | FUCHKA
                  </span>
                </h2>
                <span className="text-[#e58a3d] text-[11px] font-bold tracking-widest uppercase">
                  CRISPY & TANGY
                </span>
              </div>
              <div className="h-px bg-[#a85a2b]/40 w-full mb-3" />
            </div>

            <div className="flex flex-col gap-3">
              {fuchka.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>

          <div className="w-[48%] h-full relative flex items-center justify-center shrink-0">
            <div className="relative w-full h-full flex items-center justify-center">
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

        <div className="flex gap-8 lg:gap-12 h-[48%] items-start pt-10 lg:pt-14 min-h-0">
          <div className="flex-1 flex flex-col justify-start h-full min-w-0">
            <div>
              <div className="flex items-baseline justify-between pb-1.5">
                <h2 className="text-white font-extrabold text-xl lg:text-2xl tracking-wide">
                  চটপটি{" "}
                  <span className="text-white/70 text-base font-normal tracking-wider">
                  </span>
                </h2>
                <span className="text-[#e58a3d] text-[11px] font-bold tracking-widest uppercase">
                </span>
              </div>
              <div className="h-px bg-[#a85a2b]/40 w-full mb-3" />
            </div>

            <div className="flex flex-col gap-3.5 lg:gap-4">
              {chatpati.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-start h-full min-w-0">
            <div>
              <div className="flex items-baseline justify-between pb-1.5">
                <h2 className="text-white font-extrabold text-xl lg:text-2xl tracking-wide">
                  মসলা কর্ন{" "}
                  <span className="text-white/70 text-base font-normal tracking-wider">
                    | CORN
                  </span>
                </h2>
                <span className="text-[#e58a3d] text-[11px] font-bold tracking-widest uppercase">
                  SWEET & SPICY
                </span>
              </div>
              <div className="h-px bg-[#a85a2b]/40 w-full mb-3" />
            </div>

            <div className="flex flex-col gap-3.5 lg:gap-4">
              {corn.map((item) => (
                <ItemRow key={item._id} item={item} />
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
    </>
  );
}
