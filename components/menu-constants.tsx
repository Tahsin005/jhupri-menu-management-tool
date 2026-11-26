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
