"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Hat } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filters } from "@/components/merchandise/filters";
import { MerchandiseCard } from "@/components/merchandise/merchandise-card";
import { EmptyState } from "@/components/merchandise/empty-state";
import { HatForm } from "@/components/merchandise/hat-form";
import { HatDetail } from "@/components/merchandise/hat-detail";

function HatsPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [hats, setHats] = useState<Hat[]>([]);
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
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedHat, setSelectedHat] = useState<Hat | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingHat, setEditingHat] = useState<Hat | null>(null);

  const fetchHats = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("hats")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setHats(data || []);
    } catch (error) {
      console.error("Error fetching hats:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHats();
  }, [fetchHats]);

  // Handle URL params for opening add form or detail view
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowForm(true);
      router.replace("/hats", { scroll: false });
    }
    const hatId = searchParams.get("id");
    if (hatId && hats.length > 0) {
      const hat = hats.find((h) => h.id === hatId);
      if (hat) {
        setSelectedHat(hat);
        setShowDetail(true);
        router.replace("/hats", { scroll: false });
      }
    }
  }, [searchParams, hats, router]);

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

  const handleCardClick = (hat: Hat) => {
    setSelectedHat(hat);
    setShowDetail(true);
  };

  const handleEdit = () => {
    setShowDetail(false);
    setEditingHat(selectedHat);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchHats();
    setEditingHat(null);
  };

  const handleDelete = () => {
    fetchHats();
    setSelectedHat(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Hats</h1>
          <p className="text-[var(--muted-foreground)]">
            {hats.length} {hats.length === 1 ? "hat" : "hats"} in your collection
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="hidden md:flex">
          <Plus className="h-4 w-4 mr-2" />
          Add Hat
        </Button>
      </div>

      <Filters type="hats" filters={filters} onChange={setFilters} />

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex flex-col">
              <Skeleton className="aspect-square rounded-lg" />
              <Skeleton className="h-4 w-3/4 mt-2" />
              <Skeleton className="h-3 w-1/2 mt-1" />
            </div>
          ))}
        </div>
      ) : filteredHats.length === 0 ? (
        hats.length === 0 ? (
          <EmptyState type="hats" onAdd={() => setShowForm(true)} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-[var(--muted-foreground)]">
              No hats match your filters
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredHats.map((hat) => (
            <MerchandiseCard
              key={hat.id}
              item={hat}
              type="hat"
              onClick={() => handleCardClick(hat)}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button for mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg md:hidden"
        aria-label="Add hat"
      >
        <Plus className="h-6 w-6" />
      </button>

      <HatForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingHat(null);
        }}
        hat={editingHat}
        onSuccess={handleFormSuccess}
      />

      <HatDetail
        hat={selectedHat}
        open={showDetail}
        onOpenChange={setShowDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default function HatsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-24 w-full" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="aspect-square rounded-lg" />
            ))}
          </div>
        </div>
      }
    >
      <HatsPageContent />
    </Suspense>
  );
}
