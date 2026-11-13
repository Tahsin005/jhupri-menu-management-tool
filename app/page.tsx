"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { Tv, Monitor } from "lucide-react";
import { getPusherClient } from "@/lib/pusher-client";
import { MenuData } from "@/components/menu-constants";
import MenuWithOrders from "@/components/MenuWithOrders";
import MenuWithoutOrders from "@/components/MenuWithoutOrders";

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
      (payload: { currentOrder?: number; scale?: number; showOrders?: boolean }) => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentOrder: payload.currentOrder ?? prev.currentOrder,
            scale: payload.scale ?? prev.scale,
            showOrders: payload.showOrders ?? prev.showOrders,
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
          src="/logo.svg"
          alt="Jhupri"
          width={130}
          height={130}
          className="rounded-full opacity-60 animate-pulse border-2 border-[#c47a35]/60"
        />
      </div>
    );
  }

  const scale = data.scale ?? 100;
  const scaleFactor = scale / 100;
  const showOrders = data.showOrders !== false;

  return (
    <>
      <div className="small-device-warning fixed inset-0 z-50 bg-[#0c0502] flex-col items-center justify-center p-6 text-center select-none overflow-y-auto">
        <div className="max-w-md w-full flex flex-col items-center my-auto">
          <Image
            src="/logo.svg"
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
        {showOrders ? (
          <MenuWithOrders data={data} scaleFactor={scaleFactor} />
        ) : (
          <MenuWithoutOrders data={data} scaleFactor={scaleFactor} />
        )}
      </div>
    </>
  );
}
