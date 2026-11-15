"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { getPusherClient } from "@/lib/pusher-client";
import { MenuData } from "@/components/menu-constants";
import ImageMenuDisplay from "@/components/ImageMenuDisplay";

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
      (payload: { currentOrder?: number; showOrders?: boolean }) => {
        setData((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            currentOrder: payload.currentOrder ?? prev.currentOrder,
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
      <div className="flex items-center justify-center min-h-screen bg-[#0c0502]">
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

  return (
    <div
      className="overflow-hidden select-none"
      style={{
        width: "100vw",
        height: "100vh",
      }}
    >
      <ImageMenuDisplay data={data} />
    </div>
  );
}
