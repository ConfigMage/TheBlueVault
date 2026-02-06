"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Jersey } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Filters } from "@/components/merchandise/filters";
import { MerchandiseCard } from "@/components/merchandise/merchandise-card";
import { EmptyState } from "@/components/merchandise/empty-state";
import { JerseyForm } from "@/components/merchandise/jersey-form";
import { JerseyDetail } from "@/components/merchandise/jersey-detail";

function JerseysPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jerseys, setJerseys] = useState<Jersey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<{
    team: string;
    colorDesign: string;
    location?: string;
    player?: string;
    itemType?: "all" | "hats" | "jerseys";
  }>({
    team: "",
    colorDesign: "",
    location: "",
    player: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [selectedJersey, setSelectedJersey] = useState<Jersey | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [editingJersey, setEditingJersey] = useState<Jersey | null>(null);

  const fetchJerseys = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("jerseys")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setJerseys(data || []);
    } catch (error) {
      console.error("Error fetching jerseys:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchJerseys();
  }, [fetchJerseys]);

  // Handle URL params for opening add form or detail view
  useEffect(() => {
    if (searchParams.get("add") === "true") {
      setShowForm(true);
      router.replace("/jerseys", { scroll: false });
    }
    const jerseyId = searchParams.get("id");
    if (jerseyId && jerseys.length > 0) {
      const jersey = jerseys.find((j) => j.id === jerseyId);
      if (jersey) {
        setSelectedJersey(jersey);
        setShowDetail(true);
        router.replace("/jerseys", { scroll: false });
      }
    }
  }, [searchParams, jerseys, router]);

  const filteredJerseys = jerseys.filter((jersey) => {
    if (filters.team && jersey.team !== filters.team) return false;
    if (
      filters.colorDesign &&
      !jersey.color_design
        ?.toLowerCase()
        .includes(filters.colorDesign.toLowerCase())
    )
      return false;
    if (filters.location && jersey.location !== filters.location) return false;
    if (
      filters.player &&
      !jersey.player.toLowerCase().includes(filters.player.toLowerCase())
    )
      return false;
    return true;
  });

  const handleCardClick = (jersey: Jersey) => {
    setSelectedJersey(jersey);
    setShowDetail(true);
  };

  const handleEdit = () => {
    setShowDetail(false);
    setEditingJersey(selectedJersey);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    fetchJerseys();
    setEditingJersey(null);
  };

  const handleDelete = () => {
    fetchJerseys();
    setSelectedJersey(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--primary)]">Jerseys</h1>
          <p className="text-[var(--muted-foreground)]">
            {jerseys.length} {jerseys.length === 1 ? "jersey" : "jerseys"} in
            your collection
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="hidden md:flex">
          <Plus className="h-4 w-4 mr-2" />
          Add Jersey
        </Button>
      </div>

      <Filters type="jerseys" filters={filters} onChange={setFilters} />

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
      ) : filteredJerseys.length === 0 ? (
        jerseys.length === 0 ? (
          <EmptyState type="jerseys" onAdd={() => setShowForm(true)} />
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="text-4xl mb-3">🔍</span>
            <p className="text-[var(--muted-foreground)]">
              No jerseys match your filters
            </p>
          </div>
        )
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredJerseys.map((jersey) => (
            <MerchandiseCard
              key={jersey.id}
              item={jersey}
              type="jersey"
              onClick={() => handleCardClick(jersey)}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button for mobile */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-20 right-4 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-white shadow-lg md:hidden"
        aria-label="Add jersey"
      >
        <Plus className="h-6 w-6" />
      </button>

      <JerseyForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingJersey(null);
        }}
        jersey={editingJersey}
        onSuccess={handleFormSuccess}
      />

      <JerseyDetail
        jersey={selectedJersey}
        open={showDetail}
        onOpenChange={setShowDetail}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default function JerseysPage() {
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
      <JerseysPageContent />
    </Suspense>
  );
}
