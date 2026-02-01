"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Hat, Jersey } from "@/lib/types";

interface MerchandiseCardProps {
  item: Hat | Jersey;
  type: "hat" | "jersey";
  onClick: () => void;
}

export function MerchandiseCard({ item, type, onClick }: MerchandiseCardProps) {
  const isHat = type === "hat";
  const hat = item as Hat;
  const jersey = item as Jersey;

  return (
    <button
      type="button"
      onClick={onClick}
      className="group relative flex flex-col overflow-hidden rounded-lg border border-[var(--border)] bg-white transition-shadow hover:shadow-md text-left w-full"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[var(--muted)]">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.team}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-4xl text-[var(--muted-foreground)]">
            {isHat ? "🧢" : "👕"}
          </div>
        )}
      </div>
      <div className="flex flex-col gap-1 p-3">
        <h3 className="font-medium text-sm truncate">{item.team}</h3>
        {isHat ? (
          <>
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {hat.color_design || "No design specified"}
            </p>
            <Badge variant="secondary" className="w-fit text-xs">
              {hat.storage_bin}
            </Badge>
          </>
        ) : (
          <>
            <p className="text-xs font-medium text-[var(--primary)] truncate">
              {jersey.player}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] truncate">
              {jersey.color_design || "No design specified"}
            </p>
          </>
        )}
      </div>
    </button>
  );
}
