export interface Hat {
  id: string;
  team: string;
  color_design: string;
  location: string;
  price_paid: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Jersey {
  id: string;
  team: string;
  player: string;
  color_design: string;
  location: string;
  price_paid: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export type MerchandiseType = "hat" | "jersey";

export interface DashboardStats {
  totalHats: number;
  totalJerseys: number;
  totalItems: number;
  locationCounts: Record<string, number>;
  teamCounts: { team: string; count: number }[];
}

export interface FilterState {
  type: "all" | "hats" | "jerseys";
  team: string;
  colorDesign: string;
  location: string;
  player: string;
}
