import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  type: "hats" | "jerseys";
  onAdd: () => void;
}

export function EmptyState({ type, onAdd }: EmptyStateProps) {
  const emoji = type === "hats" ? "🧢" : "👕";
  const singular = type === "hats" ? "hat" : "jersey";

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <span className="text-6xl mb-4">{emoji}</span>
      <h3 className="text-lg font-semibold mb-2">No {type} yet</h3>
      <p className="text-[var(--muted-foreground)] mb-6">
        Add your first {singular} to start tracking your collection!
      </p>
      <Button onClick={onAdd}>
        <Plus className="h-4 w-4 mr-2" />
        Add {singular}
      </Button>
    </div>
  );
}
