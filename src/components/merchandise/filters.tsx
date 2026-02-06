"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TeamSelect } from "./team-select";
import { LocationSelect } from "./location-select";
import { cn } from "@/lib/utils";

interface FilterValues {
  team: string;
  colorDesign: string;
  location?: string;
  player?: string;
  itemType?: "all" | "hats" | "jerseys";
}

interface FiltersProps {
  type: "hats" | "jerseys" | "dashboard";
  filters: FilterValues;
  onChange: (filters: FilterValues) => void;
}

export function Filters({ type, filters, onChange }: FiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.team ||
    filters.colorDesign ||
    filters.location ||
    filters.player ||
    (filters.itemType && filters.itemType !== "all");

  const clearFilters = () => {
    onChange({
      team: "",
      colorDesign: "",
      location: "",
      player: "",
      itemType: "all",
    });
  };

  return (
    <div className="mb-6 rounded-lg border border-[var(--border)] bg-white p-4">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between md:hidden"
      >
        <span className="font-medium">
          Filters {hasActiveFilters && "(Active)"}
        </span>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </button>

      <div
        className={cn(
          "mt-4 grid gap-4 md:mt-0 md:grid-cols-4",
          !isExpanded && "hidden md:grid"
        )}
      >
        {type === "dashboard" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Type</label>
            <select
              value={filters.itemType || "all"}
              onChange={(e) =>
                onChange({
                  ...filters,
                  itemType: e.target.value as "all" | "hats" | "jerseys",
                })
              }
              className="flex h-10 w-full appearance-none rounded-md border border-[var(--border)] bg-white px-3 py-2 text-sm"
            >
              <option value="all">All Items</option>
              <option value="hats">Hats Only</option>
              <option value="jerseys">Jerseys Only</option>
            </select>
          </div>
        )}

        <TeamSelect
          label="Team"
          value={filters.team}
          onChange={(team) => onChange({ ...filters, team })}
          showAll
        />

        <div>
          <label className="block text-sm font-medium mb-1.5">
            Color/Design
          </label>
          <Input
            placeholder="Search color or design..."
            value={filters.colorDesign}
            onChange={(e) =>
              onChange({ ...filters, colorDesign: e.target.value })
            }
          />
        </div>

        <LocationSelect
          label="Location"
          value={filters.location || ""}
          onChange={(location) => onChange({ ...filters, location })}
          showAll
        />

        {type === "jerseys" && (
          <div>
            <label className="block text-sm font-medium mb-1.5">Player</label>
            <Input
              placeholder="Search player..."
              value={filters.player || ""}
              onChange={(e) => onChange({ ...filters, player: e.target.value })}
            />
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className={cn("mt-4", !isExpanded && "hidden md:block")}>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
