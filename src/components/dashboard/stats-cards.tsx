"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { STORAGE_BINS } from "@/lib/constants";

interface StatsCardsProps {
  totalHats: number;
  totalJerseys: number;
  storageBinCounts: Record<string, number>;
  isLoading?: boolean;
}

export function StatsCards({
  totalHats,
  totalJerseys,
  storageBinCounts,
  isLoading,
}: StatsCardsProps) {
  if (isLoading) {
    return (
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const totalItems = totalHats + totalJerseys;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              Total Hats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧢</span>
              <span className="text-3xl font-bold">{totalHats}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              Total Jerseys
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">👕</span>
              <span className="text-3xl font-bold">{totalJerseys}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2 lg:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
              Total Collection
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚾</span>
              <span className="text-3xl font-bold">{totalItems}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-[var(--muted-foreground)]">
            Storage Box Breakdown (Hats)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STORAGE_BINS.map((bin) => (
              <div
                key={bin}
                className="flex flex-col items-center rounded-lg bg-[var(--muted)] p-3"
              >
                <span className="text-sm text-[var(--muted-foreground)]">
                  {bin}
                </span>
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {storageBinCounts[bin] || 0}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
