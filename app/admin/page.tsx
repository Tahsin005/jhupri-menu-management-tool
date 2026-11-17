"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import {
  Check,
  ExternalLink,
  CircleCheck,
  CircleX,
  Minus,
  Plus,
  RotateCcw,
  Droplets,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
} from "lucide-react";
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
  waterBottleCount?: number;
  showOrders?: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  fuchka: "ফুচকা | Fuchka",
  chatpati: "চটপটি | Chatpati",
  corn: "মাসালা কর্ন | Corn",
};

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

const BN: Record<string, string> = {
  "Regular Fuchka": "রেগুলার ফুচকা",
  "Naga Fuchka": "নাগা ফুচকা",
  "Shahi Fuchka": "শাহী ফুচকা",
  "Doi Fuchka": "দই ফুচকা",
  "Regular Chatpati": "রেগুলার চটপটি",
  "Naga Chatpati": "নাগা চটপটি",
  "Shahi Chatpati": "শাহী চটপটি",
  "Regular Masala Corn": "রেগুলার মাসালা কর্ন",
  "Sweet Chili Corn": "সুইট চিলি কর্ন",
  "Naga Corn": "নাগা কর্ন",
};

const CATEGORY_COLORS: Record<string, string> = {
  fuchka: "bg-orange-500/10 border-orange-500/30",
  chatpati: "bg-red-500/10 border-red-500/30",
  corn: "bg-yellow-500/10 border-yellow-500/30",
};

export default function AdminPage() {
  const [data, setData] = useState<MenuData | null>(null);
  const [orderInput, setOrderInput] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [orderSaving, setOrderSaving] = useState(false);
  const [nextOrderSaving, setNextOrderSaving] = useState(false);
  const [prevOrderSaving, setPrevOrderSaving] = useState(false);
  const [resetOrderSaving, setResetOrderSaving] = useState(false);
  const [showResetOrderModal, setShowResetOrderModal] = useState(false);
  const [showOrdersSaving, setShowOrdersSaving] = useState(false);
  const [waterSaving, setWaterSaving] = useState(false);
  const [showResetWaterModal, setShowResetWaterModal] = useState(false);
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
    }
  }, []);

  // Register service worker for PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .catch(() => {});
    }
  }, []);

  useEffect(() => {
    fetchMenu();

    const pusher = getPusherClient();
    const channel = pusher.subscribe("jhupri-channel");

    channel.bind(
      "order-update",
      (payload: { currentOrder?: number; waterBottleCount?: number; showOrders?: boolean }) => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentOrder: payload.currentOrder ?? prev.currentOrder,
            waterBottleCount: payload.waterBottleCount ?? prev.waterBottleCount,
            showOrders: payload.showOrders ?? prev.showOrders,
          };
        });
        if (typeof payload.currentOrder === "number") {
          setOrderInput(String(payload.currentOrder));
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

  const saveNextOrder = async () => {
    const next = (data?.currentOrder ?? 0) + 1;
    setNextOrderSaving(true);
    setOrderInput(String(next));
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentOrder: next }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, currentOrder: next } : prev));
        showToast(`অর্ডার নম্বর ${next} সেট করা হয়েছে`);
      }
    } finally {
      setNextOrderSaving(false);
    }
  };

  const savePrevOrder = async () => {
    const current = data?.currentOrder ?? 1;
    if (current <= 1) return;
    const prevNum = current - 1;
    setPrevOrderSaving(true);
    setOrderInput(String(prevNum));
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentOrder: prevNum }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, currentOrder: prevNum } : prev));
        showToast(`অর্ডার নম্বর ${prevNum} সেট করা হয়েছে`);
      }
    } finally {
      setPrevOrderSaving(false);
    }
  };

  const resetOrder = async () => {
    const resetNum = 1;
    setResetOrderSaving(true);
    setOrderInput(String(resetNum));
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentOrder: resetNum }),
      });
      if (res.ok) {
        setData((prev) => (prev ? { ...prev, currentOrder: resetNum } : prev));
        showToast("অর্ডার নম্বর ১ এ রিসেট করা হয়েছে");
      }
    } finally {
      setResetOrderSaving(false);
    }
  };

  const toggleShowOrders = async () => {
    const current = data?.showOrders !== false;
    const nextVal = !current;
    setData((prev) => (prev ? { ...prev, showOrders: nextVal } : prev));
    setShowOrdersSaving(true);
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ showOrders: nextVal }),
      });
      if (res.ok) {
        showToast(
          nextVal
            ? "টিভি স্ক্রিনে অর্ডার নম্বর প্রদর্শন চালু করা হয়েছে"
            : "টিভি স্ক্রিনে অর্ডার নম্বর প্রদর্শন বন্ধ করা হয়েছে"
        );
      } else {
        fetchMenu();
      }
    } catch {
      fetchMenu();
    } finally {
      setShowOrdersSaving(false);
    }
  };

  const saveWaterBottleCount = async (newCount: number) => {
    const validCount = Math.max(0, newCount);
    // Optimistic UI update
    setData((prev) => (prev ? { ...prev, waterBottleCount: validCount } : prev));
    setWaterSaving(true);
    try {
      const res = await fetch("/api/order", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ waterBottleCount: validCount }),
      });
      if (res.ok) {
        showToast(
          validCount === 0
            ? "পানির বোতল কাউন্ট রিসেট করা হয়েছে"
            : `পানির বোতল: ${validCount} টি`
        );
      } else {
        showToast("কাউন্ট আপডেট ব্যর্থ হয়েছে");
      }
    } catch {
      showToast("নেটওয়ার্ক সমস্যা! আবার চেষ্টা করুন");
    } finally {
      setWaterSaving(false);
    }
  };

  const changeWaterBottle = (delta: number) => {
    const current = data?.waterBottleCount ?? 0;
    saveWaterBottleCount(current + delta);
  };

  const categories = (["fuchka", "chatpati", "corn"] as const);

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
              src="/logo.svg"
              alt="Jhupri"
              width={52}
              height={52}
              priority
              className="rounded-full border border-[#c47a35]/50 shadow-md"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="text-xs text-orange-300/60 hover:text-orange-300 bg-white/5 hover:bg-white/10 border border-orange-400/20 rounded-lg px-2.5 sm:px-3 py-1.5 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
              title="পেজ রিফ্রেশ করুন"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-orange-300/60 hover:text-orange-300 bg-white/5 hover:bg-white/10 border border-orange-400/20 rounded-lg px-2.5 sm:px-3 py-1.5 transition-colors flex items-center gap-1.5 shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Display View</span>
              <span className="sm:hidden">ভিউ</span>
            </a>
          </div>
        </div>

        {!data ? (
          <div className="text-center text-orange-300/50 py-20 text-xl animate-pulse">
            লোড হচ্ছে…
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
                <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-white/80">
                    অর্ডার নম্বর
                  </h2>
                  <div className="h-4 w-px bg-white/20 hidden sm:block" />
                  <button
                    type="button"
                    onClick={toggleShowOrders}
                    disabled={showOrdersSaving}
                    className="flex items-center gap-2 bg-white/5 hover:bg-white/10 active:scale-95 px-2.5 py-1 rounded-lg border border-white/10 transition-all cursor-pointer"
                    title={data.showOrders !== false ? "টিভিতে অর্ডার নম্বর বন্ধ করুন" : "টিভিতে অর্ডার নম্বর চালু করুন"}
                  >
                      <span className="text-[11px] sm:text-xs text-white/60">Show:</span>
                    <span
                      className={`text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded ${
                        data.showOrders !== false
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}
                    >
                      {data.showOrders !== false ? "on" : "off"}
                    </span>
                    <span
                      className={`w-7 sm:w-8 h-4 sm:h-4.5 rounded-full transition-colors relative inline-flex items-center p-0.5 ${
                        data.showOrders !== false ? "bg-green-500" : "bg-white/20"
                      }`}
                    >
                      <span
                        className={`w-3 sm:w-3.5 h-3 sm:h-3.5 rounded-full bg-white transition-transform ${
                          data.showOrders !== false ? "translate-x-3 sm:translate-x-3.5" : "translate-x-0"
                        }`}
                      />
                    </span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowResetOrderModal(true)}
                  disabled={orderSaving || nextOrderSaving || prevOrderSaving || resetOrderSaving || (data.currentOrder <= 1)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 active:scale-95 border border-red-500/30 text-red-400 disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-semibold shrink-0 cursor-pointer"
                  title="অর্ডার নম্বর রিসেট করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
                </button>
              </div>
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

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    saveOrder();
                  }}
                  className="flex items-center gap-2 sm:gap-3 flex-wrap"
                  aria-busy={orderSaving || nextOrderSaving || prevOrderSaving || resetOrderSaving}
                >
                  <button
                    type="button"
                    onClick={saveNextOrder}
                    disabled={orderSaving || nextOrderSaving || prevOrderSaving || resetOrderSaving}
                    className="flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 disabled:opacity-50 text-white font-black px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl transition-all text-sm sm:text-base border border-emerald-400/40 shrink-0 cursor-pointer shadow-lg shadow-emerald-500/25 ring-2 ring-emerald-500/20"
                    title="পরবর্তী অর্ডার নম্বরে যান (+১)"
                  >
                    {nextOrderSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
                    ) : (
                      <Plus className="w-5 h-5 stroke-[2.5]" />
                    )}
                    <span>{nextOrderSaving ? "সেট হচ্ছে..." : "+১ পরবর্তী"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={savePrevOrder}
                    disabled={orderSaving || nextOrderSaving || prevOrderSaving || resetOrderSaving || (data.currentOrder <= 1)}
                    className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/15 transition-all text-xs sm:text-sm shrink-0 cursor-pointer shadow-sm"
                    title="আগের অর্ডার নম্বরে যান (-১)"
                  >
                    {prevOrderSaving && (
                      <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                    )}
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                    <span>{prevOrderSaving ? "সেট হচ্ছে..." : "-১ পূর্ববর্তী"}</span>
                  </button>

                  <div className="h-8 w-px bg-white/10 mx-1 hidden sm:block" />

                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={1}
                      value={orderInput}
                      onChange={(e) => setOrderInput(e.target.value)}
                      disabled={orderSaving || nextOrderSaving || prevOrderSaving || resetOrderSaving}
                      className="w-18 sm:w-20 bg-white/10 border border-white/20 rounded-xl px-2.5 py-1.5 sm:py-2 text-sm sm:text-base font-bold text-white text-center focus:outline-none focus:border-orange-400/60 tabular-nums disabled:opacity-50"
                      title="সরাসরি নম্বর লিখুন"
                    />
                    <button
                      type="submit"
                      disabled={orderSaving || nextOrderSaving || prevOrderSaving || resetOrderSaving}
                      className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border border-orange-500/30 active:scale-95 disabled:opacity-50 font-bold px-3 py-1.5 sm:py-2 rounded-xl transition-all text-xs sm:text-sm shrink-0 cursor-pointer"
                      title="লিখা নম্বর সেট করুন"
                    >
                      {orderSaving && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" aria-hidden="true" />
                      )}
                      {orderSaving ? "..." : "সেট"}
                    </button>
                  </div>
                </form>
              </div>
            </section>

            <section className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 shrink-0">
                    <Droplets className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base sm:text-lg font-bold text-white/90 leading-tight">
                      অতিরিক্ত পানির বোতল
                    </h2>
                    <p className="text-[11px] sm:text-xs text-white/40 leading-tight">
                      বিক্রিত অতিরিক্ত বোতলের হিসাব
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowResetWaterModal(true)}
                  disabled={waterSaving || (data.waterBottleCount ?? 0) === 0}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/15 hover:bg-red-500/25 active:scale-95 border border-red-500/30 text-red-400 disabled:opacity-30 disabled:pointer-events-none transition-all text-xs font-semibold shrink-0 cursor-pointer"
                  title="কাউন্ট রিসেট করুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট</span>
                </button>
              </div>

              <div className="flex items-center gap-3 sm:gap-4 flex-wrap pt-1">
                <div className="flex flex-col">
                  <span className="text-[11px] sm:text-xs text-white/40 mb-0.5">
                    মোট বিক্রিত বোতল
                  </span>
                  <span className="text-3xl sm:text-4xl font-black text-sky-400 tabular-nums">
                    {data.waterBottleCount ?? 0}
                  </span>
                </div>

                <div className="h-10 sm:h-12 w-px bg-white/10 mx-1 sm:mx-2" />

                <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    type="button"
                    onClick={() => changeWaterBottle(-1)}
                    disabled={waterSaving || (data.waterBottleCount ?? 0) <= 0}
                    className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 active:scale-95 disabled:opacity-30 disabled:pointer-events-none text-white font-bold px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl border border-white/15 transition-all text-xs sm:text-sm shrink-0 cursor-pointer shadow-sm"
                  >
                    <Minus className="w-4 h-4 stroke-[2.5]" />
                    <span>-১ বোতল</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => changeWaterBottle(1)}
                    disabled={waterSaving}
                    className="flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-400 active:scale-95 disabled:opacity-50 text-white font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl transition-all text-xs sm:text-sm shrink-0 cursor-pointer shadow-md shadow-sky-500/25"
                  >
                    <Plus className="w-4 h-4 stroke-[2.5]" />
                    <span>+১ বোতল</span>
                  </button>
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
                        className={`flex flex-col items-center gap-1.5 rounded-xl px-3 py-4 border transition-all duration-200 font-semibold ${item.available
                            ? "bg-green-500/20 border-green-400/40 text-green-300 hover:bg-green-500/30"
                            : "bg-red-900/20 border-red-700/30 text-red-400/70 hover:bg-red-900/30"
                          } ${saving === item._id ? "opacity-50 cursor-wait" : "cursor-pointer"}`}
                      >
                        <div
                          className={`p-1.5 rounded-full transition-all ${item.available
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
                          className={`text-xs font-bold uppercase tracking-widest ${item.available ? "text-green-400" : "text-red-500/70"
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


      {showResetOrderModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowResetOrderModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#180a03] border border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    রিসেট নিশ্চিতকরণ
                  </h3>
                  <p className="text-xs text-white/40">
                    Reset Order Number
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetOrderModal(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
              আপনি কি নিশ্চিত যে বর্তমান অর্ডার নম্বর{" "}
              <strong className="text-orange-400 font-bold">
                {data?.currentOrder ?? 1}
              </strong>{" "}
              রিসেট করে <strong className="text-white">১ (এক)</strong> করতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowResetOrderModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetOrderModal(false);
                  resetOrder();
                }}
                disabled={resetOrderSaving}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer flex items-center gap-1.5"
              >
                {resetOrderSaving && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                )}
                <RotateCcw className="w-3.5 h-3.5" />
                <span>হ্যাঁ, রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showResetWaterModal && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowResetWaterModal(false)}
        >
          <div
            className="w-full max-w-sm bg-[#180a03] border border-orange-500/30 rounded-2xl p-5 sm:p-6 shadow-2xl shadow-black flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 shrink-0">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    রিসেট নিশ্চিতকরণ
                  </h3>
                  <p className="text-xs text-white/40">
                    Reset Water Bottle Count
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowResetWaterModal(false)}
                className="text-white/40 hover:text-white transition-colors p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-white/80 leading-relaxed">
              আপনি কি নিশ্চিত যে বর্তমান পানির বোতল সংখ্যা{" "}
              <strong className="text-sky-400 font-bold">
                {data?.waterBottleCount ?? 0} টি
              </strong>{" "}
              রিসেট করে <strong className="text-white">০ (শূন্য)</strong> করতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowResetWaterModal(false)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white/80 hover:text-white text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowResetWaterModal(false);
                  saveWaterBottleCount(0);
                }}
                disabled={waterSaving}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs sm:text-sm font-bold transition-all shadow-md shadow-red-950/40 cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>হ্যাঁ, রিসেট করুন</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
