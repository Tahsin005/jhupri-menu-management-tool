"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Check,
  ExternalLink,
  ZoomIn,
  ZoomOut,
  CircleCheck,
  CircleX,
} from "lucide-react";
import { getPusherClient } from "@/lib/pusher-client";

interface MenuItem {
  _id: string;
  name: string;
  category: "fuska" | "chatpati" | "corn";
  available: boolean;
}

interface MenuData {
  items: MenuItem[];
  currentOrder: number;
  scale?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  fuska: "ফুচকা | Fuchka",
  chatpati: "চটপটি | Chatpati",
  corn: "মসলা কর্ন | Corn",
};

const PRICES: Record<string, number> = {
  "Regular Fuska": 100,
  "Naga Fuska": 100,
  "Shahi Fuska": 120,
  "Doi Fuska": 150,
  "Regular Chatpati": 90,
  "Naga Chatpati": 90,
  "Shahi Chatpati": 110,
  "Regular Masala Corn": 80,
  "Sweet Chili Corn": 80,
  "Naga Corn": 90,
};

const BN: Record<string, string> = {
  "Regular Fuska": "রেগুলার ফুচকা",
  "Naga Fuska": "নাগা ফুচকা",
  "Shahi Fuska": "শাহী ফুচকা",
  "Doi Fuska": "দই ফুচকা",
  "Regular Chatpati": "রেগুলার চটপটি",
  "Naga Chatpati": "নাগা চটপটি",
  "Shahi Chatpati": "শাহী চটপটি",
  "Regular Masala Corn": "রেগুলার মসলা কর্ন",
  "Sweet Chili Corn": "সুইট চিলি কর্ন",
  "Naga Corn": "নাগা কর্ন",
};

const CATEGORY_COLORS: Record<string, string> = {
  fuska: "bg-orange-500/10 border-orange-500/30",
  chatpati: "bg-red-500/10 border-red-500/30",
  corn: "bg-yellow-500/10 border-yellow-500/30",
};

export default function AdminPage() {
  const [data, setData] = useState<MenuData | null>(null);
  const [orderInput, setOrderInput] = useState("");
  const [scaleInput, setScaleInput] = useState<number>(100);
  const [saving, setSaving] = useState<string | null>(null);
  const [orderSaving, setOrderSaving] = useState(false);
  const [scaleSaving, setScaleSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const fetchMenu = useCallback(async () => {
    const res = await fetch("/api/menu", { cache: "no-store" });
    if (res.ok) {
      const json: MenuData = await res.json();
      setData(json);
      setOrderInput(String(json.currentOrder));
      setScaleInput(json.scale ?? 100);
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
        if (typeof payload.currentOrder === "number") {
          setOrderInput(String(payload.currentOrder));
        }
        if (typeof payload.scale === "number") {
          setScaleInput(payload.scale);
        }
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

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [fetchMenu]);

  const toggleItem = async (item: MenuItem) => {
    const targetId = String(item._id);
    const newAvailable = !item.available;

    // 1. Instant optimistic update so UI flips immediately
    setData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        items: prev.items.map((i) =>
          String(i._id) === targetId ? { ...i, available: newAvailable } : i
        ),
      };
    });

    setSaving(targetId);
    try {
      const res = await fetch(`/api/menu/${targetId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ available: newAvailable }),
      });
      if (res.ok) {
        showToast(
          `"${item.name}" ${newAvailable ? "চালু" : "বন্ধ"} করা হয়েছে`
        );
      } else {
        // Revert on failure
        fetchMenu();
      }
    } catch {
      // Revert on network error
      fetchMenu();
    } finally {
      setSaving(null);
    }
  };

  const saveOrder = async () => {
    const num = parseInt(orderInput, 10);
    if (isNaN(num) || num < 1) return;
    setOrderSaving(true);
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentOrder: num }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, currentOrder: num } : prev));
        showToast(`অর্ডার নম্বর ${num} সেট করা হয়েছে`);
      }
    } finally {
      setOrderSaving(false);
    }
  };

  const saveScale = async (newScale: number) => {
    if (isNaN(newScale) || newScale < 50 || newScale > 300) return;
    setScaleSaving(true);
    setScaleInput(newScale);
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scale: newScale }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, scale: newScale } : prev));
        showToast(`ডিসপ্লে স্কেল ${newScale}% সেট করা হয়েছে`);
      }
    } finally {
      setScaleSaving(false);
    }
  };

  const categories = (["fuska", "chatpati", "corn"] as const);

  return (
    <div className="min-h-screen bg-[#0f0602] text-white p-6 font-sans">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white text-sm font-semibold px-5 py-3 rounded-xl shadow-xl transition-all animate-in slide-in-from-top-2 flex items-center gap-2">
          <Check className="w-4 h-4" /> {toast}
        </div>
      )}

      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.jpg"
              alt="Jhupri"
              width={52}
              height={52}
              className="rounded-full border border-[#c47a35]/50 shadow-md"
            />
            <div>
              <h1 className="text-3xl font-black text-[#c47a35]">
                ঝুপড়ি - অ্যাডমিন
              </h1>
              <p className="text-white/40 text-sm mt-0.5">Menu Management Panel</p>
            </div>
          </div>
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-orange-300/60 hover:text-orange-300 border border-orange-400/20 rounded-lg px-3 py-1.5 transition-colors flex items-center gap-1.5"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Display View
          </a>
        </div>

        {!data ? (
          <div className="text-center text-orange-300/50 py-20 text-xl animate-pulse">
            লোড হচ্ছে…
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-bold text-white/80 mb-3">
                অর্ডার নম্বর
              </h2>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs text-white/40 mb-0.5">
                    বর্তমান অর্ডার
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-orange-400 tabular-nums">
                    {data.currentOrder}
                  </span>
                </div>
                <div className="h-10 sm:h-12 w-px bg-white/10 mx-1 sm:mx-2" />
                <div className="flex items-center gap-2 flex-wrap">
                  <input
                    type="number"
                    min={1}
                    value={orderInput}
                    onChange={(e) => setOrderInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && saveOrder()}
                    className="w-20 sm:w-28 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 sm:py-2 text-base sm:text-lg font-bold text-white text-center focus:outline-none focus:border-orange-400/60 tabular-nums"
                  />
                  <button
                    onClick={saveOrder}
                    disabled={orderSaving}
                    className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm shrink-0"
                  >
                    {orderSaving ? "…" : "সেট করুন"}
                  </button>
                  <button
                    onClick={() => {
                      const next = data.currentOrder + 1;
                      setOrderInput(String(next));
                      fetch("/api/order", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ currentOrder: next }),
                      }).then(() => {
                        setData((prev) =>
                          prev ? { ...prev, currentOrder: next } : prev
                        );
                        showToast(`অর্ডার নম্বর ${next} সেট করা হয়েছে`);
                      });
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm border border-white/10 shrink-0"
                  >
                    +১ পরবর্তী
                  </button>
                </div>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-white/80">
                    ডিসপ্লে স্কেল / জুম (Display Scale)
                  </h2>
                  <p className="text-xs text-white/40 mt-0.5">
                    টিভি স্ক্রিনের সাইজ অনুযায়ী সাইজ পরিবর্তন করুন।
                  </p>
                </div>
                <span className="text-2xl sm:text-3xl font-black text-orange-400 tabular-nums bg-white/5 border border-white/10 px-3 py-1 rounded-xl shrink-0">
                  {scaleInput}%
                </span>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 my-3">
                <ZoomOut className="w-4 h-4 text-white/40 shrink-0" />
                <span className="text-[11px] sm:text-xs text-white/40 font-mono shrink-0">50%</span>
                <input
                  type="range"
                  min="50"
                  max="300"
                  step="1"
                  value={scaleInput}
                  onChange={(e) => setScaleInput(Number(e.target.value))}
                  onMouseUp={(e) => saveScale(Number((e.target as HTMLInputElement).value))}
                  onTouchEnd={(e) => saveScale(Number((e.target as HTMLInputElement).value))}
                  className="flex-1 accent-orange-500 cursor-pointer h-2 bg-white/20 rounded-lg min-w-0"
                />
                <span className="text-[11px] sm:text-xs text-white/40 font-mono shrink-0">300%</span>
                <ZoomIn className="w-4 h-4 text-white/40 shrink-0" />
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-2 mb-4">
                <span className="text-xs text-white/40 sm:hidden">সরাসরি মান লিখুন:</span>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <input
                      type="number"
                      min="50"
                      max="300"
                      value={scaleInput}
                      onChange={(e) => setScaleInput(Number(e.target.value))}
                      onKeyDown={(e) => e.key === "Enter" && saveScale(scaleInput)}
                      className="w-20 sm:w-24 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1.5 text-center font-bold text-sm text-white focus:outline-none focus:border-orange-400"
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/40 font-bold pointer-events-none">%</span>
                  </div>
                  <button
                    onClick={() => saveScale(scaleInput)}
                    disabled={scaleSaving}
                    className="bg-orange-500 hover:bg-orange-400 disabled:opacity-50 text-white font-bold px-3.5 py-1.5 rounded-lg text-xs transition-colors shrink-0"
                  >
                    {scaleSaving ? "…" : "সেভ"}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5">
                <span className="text-xs font-semibold text-white/40 block mb-2">
                  কুইক সিলেক্ট (Quick Select):
                </span>
                <div className="grid grid-cols-5 sm:flex sm:flex-wrap gap-1.5 sm:gap-2">
                  {[80, 90, 100, 110, 125, 150, 175, 200, 250, 300].map((val) => (
                    <button
                      key={val}
                      onClick={() => saveScale(val)}
                      disabled={scaleSaving}
                      className={`py-2 px-1 sm:px-3 rounded-lg text-xs font-bold transition-all text-center ${
                        (data.scale ?? 100) === val
                          ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105 font-black"
                          : "bg-white/10 hover:bg-white/20 text-white/70 border border-white/10"
                      }`}
                    >
                      {val}%
                    </button>
                  ))}
                </div>
              </div>
            </section>

            {categories.map((cat) => {
              const items = data.items.filter((i) => i.category === cat);
              return (
                <section
                  key={cat}
                  className={`border rounded-2xl p-5 ${CATEGORY_COLORS[cat]}`}
                >
                  <h2 className="text-lg font-bold text-white/80 mb-4">
                    {CATEGORY_LABELS[cat]}
                  </h2>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {items.map((item) => (
                      <button
                        key={item._id}
                        onClick={() => toggleItem(item)}
                        disabled={saving === item._id}
                        className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 border transition-all duration-200 font-semibold ${
                          item.available
                            ? "bg-green-500/20 border-green-400/40 text-green-300 hover:bg-green-500/30"
                            : "bg-red-900/20 border-red-700/30 text-red-400/70 hover:bg-red-900/30"
                        } ${saving === item._id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                      >
                        <div
                          className={`p-1.5 rounded-full transition-all ${
                            item.available
                              ? "bg-green-500/20 text-green-400"
                              : "bg-red-500/20 text-red-400/60"
                          }`}
                        >
                          {item.available ? (
                            <CircleCheck className="w-6 h-6" />
                          ) : (
                            <CircleX className="w-6 h-6" />
                          )}
                        </div>
                        <span className="text-center text-sm leading-tight">
                          {BN[item.name] ?? item.name}
                        </span>
                        <span className="text-[11px] text-white/30 font-normal">
                          {item.name}
                        </span>
                        <span className={`text-base font-black tabular-nums ${item.available ? "text-yellow-400" : "text-white/20 line-through"}`}>
                          ৳{PRICES[item.name] ?? "—"}
                        </span>
                        <span
                          className={`text-xs font-bold uppercase tracking-widest ${
                            item.available ? "text-green-400" : "text-red-500/70"
                          }`}
                        >
                          {saving === item._id
                            ? "…"
                            : item.available
                              ? "চালু"
                              : "বন্ধ"}
                        </span>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

