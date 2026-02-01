"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Hat, Jersey } from "@/lib/types";

type RecentItem = (Hat | Jersey) & { type: "hat" | "jersey" };

interface RecentItemsProps {
  items: RecentItem[];
  isLoading?: boolean;
}

export function RecentItems({ items, isLoading }: RecentItemsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-36" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Additions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <span className="text-4xl mb-3">⚾</span>
            <p className="text-[var(--muted-foreground)]">
              No items yet. Start building your collection!
            </p>
            <div className="flex gap-2 mt-4">
              <Link
                href="/hats?add=true"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Add a hat
              </Link>
              <span className="text-[var(--muted-foreground)]">or</span>
              <Link
                href="/jerseys?add=true"
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Add a jersey
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Additions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item) => (
            <Link
              key={`${item.type}-${item.id}`}
              href={`/${item.type === "hat" ? "hats" : "jerseys"}?id=${item.id}`}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-white transition-shadow hover:shadow-md"
            >
              <div className="relative aspect-square w-full overflow-hidden bg-[var(--muted)]">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.team}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 16vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-3xl text-[var(--muted-foreground)]">
                    {item.type === "hat" ? "🧢" : "👕"}
                  </div>
                )}
                <Badge
                  variant="secondary"
                  className="absolute top-2 left-2 text-xs capitalize"
                >
                  {item.type}
                </Badge>
              </div>
              <div className="p-2">
                <p className="text-xs font-medium truncate">{item.team}</p>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
