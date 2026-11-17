import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "ঝুপড়ি অ্যাডমিন",
  description: "Jhupri Menu Management Admin Panel",
  manifest: "/admin-manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ঝুপড়ি অ্যাডমিন",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0602",
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
