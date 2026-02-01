"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import { Hat, Jersey } from "@/lib/types";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { TeamChart } from "@/components/dashboard/team-chart";
import { RecentItems } from "@/components/dashboard/recent-items";
import { Filters } from "@/components/merchandise/filters";
import { STORAGE_BINS } from "@/lib/constants";

type RecentItem = (Hat | Jersey) & { type: "hat" | "jersey" };

export default function DashboardPage() {
  const [hats, setHats] = useState<Hat[]>([]);
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    team: string;
    colorDesign: string;
    storageBin?: string;
    player?: string;
    itemType?: "all" | "hats" | "jerseys";
  }>({
    team: "",
    colorDesign: "",
    storageBin: "",
    itemType: "all",
  });

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [hatsResponse, jerseysResponse] = await Promise.all([
        supabase.from("hats").select("*").order("created_at", { ascending: false }),
        supabase.from("jerseys").select("*").order("created_at", { ascending: false }),
      ]);

      if (hatsResponse.error) throw hatsResponse.error;
      if (jerseysResponse.error) throw jerseysResponse.error;

      setHats(hatsResponse.data || []);
      setJerseys(jerseysResponse.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Filter data
  const filteredHats = hats.filter((hat) => {
    if (filters.team && hat.team !== filters.team) return false;
    if (
      filters.colorDesign &&
      !hat.color_design?.toLowerCase().includes(filters.colorDesign.toLowerCase())
    )
      return false;
    if (filters.storageBin && hat.storage_bin !== filters.storageBin) return false;
    return true;
  });

  const filteredJerseys = jerseys.filter((jersey) => {
    if (filters.team && jersey.team !== filters.team) return false;
    if (
      filters.colorDesign &&
      !jersey.color_design?.toLowerCase().includes(filters.colorDesign.toLowerCase())
    )
      return false;
    return true;
  });

  // Calculate stats based on filter type
  const itemType = filters.itemType || "all";
  const displayHats = itemType === "jerseys" ? [] : filteredHats;
  const displayJerseys = itemType === "hats" ? [] : filteredJerseys;

  // Storage bin counts (only for hats)
  const storageBinCounts: Record<string, number> = {};
  STORAGE_BINS.forEach((bin) => {
    storageBinCounts[bin] = filteredHats.filter(
      (hat) => hat.storage_bin === bin
    ).length;
  });

  // Team counts
  const teamCountMap = new Map<string, number>();
  displayHats.forEach((hat) => {
    teamCountMap.set(hat.team, (teamCountMap.get(hat.team) || 0) + 1);
  });
  displayJerseys.forEach((jersey) => {
    teamCountMap.set(jersey.team, (teamCountMap.get(jersey.team) || 0) + 1);
  });
  const teamCounts = Array.from(teamCountMap.entries())
    .map(([team, count]) => ({ team, count }))
    .sort((a, b) => b.count - a.count);

  // Recent items (combined and sorted by created_at)
  const recentItems: RecentItem[] = [
    ...displayHats.map((hat) => ({ ...hat, type: "hat" as const })),
    ...displayJerseys.map((jersey) => ({ ...jersey, type: "jersey" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 12);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--primary)]">Dashboard</h1>
        <p className="text-[var(--muted-foreground)]">
          Your MLB merchandise collection at a glance
        </p>
      </div>

      <Filters type="dashboard" filters={filters} onChange={setFilters} />

      <StatsCards
        totalHats={displayHats.length}
        totalJerseys={displayJerseys.length}
        storageBinCounts={storageBinCounts}
        isLoading={isLoading}
      />

      <TeamChart data={teamCounts} isLoading={isLoading} />

      <RecentItems items={recentItems} isLoading={isLoading} />
    </div>
  );
}
