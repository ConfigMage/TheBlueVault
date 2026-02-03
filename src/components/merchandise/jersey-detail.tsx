"use client";

import { useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { Jersey } from "@/lib/types";
import { formatDate } from "@/lib/utils";

interface JerseyDetailProps {
  jersey: Jersey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function JerseyDetail({
  jersey,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: JerseyDetailProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!jersey) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // Delete image from storage if exists
      if (jersey.image_url) {
        const filename = jersey.image_url.split("/").pop();
        if (filename) {
          await supabase.storage.from(STORAGE_BUCKET).remove([filename]);
        }
      }

      // Delete jersey record
      const { error } = await supabase
        .from("jerseys")
        .delete()
        .eq("id", jersey.id);

      if (error) throw error;

      toast.success("Jersey deleted successfully!");
      onDelete();
      onOpenChange(false);
    } catch (error) {
      console.error("Error deleting jersey:", error);
      toast.error("Failed to delete jersey. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{jersey.player}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-[var(--muted)]">
            {jersey.image_url ? (
              <Image
                src={jersey.image_url}
                alt={jersey.player}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-6xl text-[var(--muted-foreground)]">
                👕
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Team
              </span>
              <p className="font-medium">{jersey.team}</p>
            </div>

            <div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Player
              </span>
              <p className="font-medium text-[var(--primary)]">
                {jersey.player}
              </p>
            </div>

            <div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Color/Design
              </span>
              <p className="font-medium">
                {jersey.color_design || "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Location
              </span>
              <div className="mt-1">
                <Badge variant="secondary">{jersey.location}</Badge>
              </div>
            </div>

            <div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Price Paid
              </span>
              <p className="font-medium">
                {jersey.price_paid ? `$${jersey.price_paid.toFixed(2)}` : "Not specified"}
              </p>
            </div>

            <div>
              <span className="text-sm text-[var(--muted-foreground)]">
                Added
              </span>
              <p className="font-medium">{formatDate(jersey.created_at)}</p>
            </div>
          </div>

          {showDeleteConfirm ? (
            <div className="rounded-lg border border-[var(--destructive)] bg-red-50 p-4">
              <p className="text-sm font-medium text-[var(--destructive)]">
                Are you sure you want to delete this jersey?
              </p>
              <div className="mt-3 flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={onEdit}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={() => setShowDeleteConfirm(true)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
