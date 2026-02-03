"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./image-upload";
import { TeamSelect } from "./team-select";
import { LocationSelect } from "./location-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { generateUniqueFilename } from "@/lib/utils";
import { Hat } from "@/lib/types";

interface HatFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  hat?: Hat | null;
  onSuccess: () => void;
}

export function HatForm({ open, onOpenChange, hat, onSuccess }: HatFormProps) {
  const [team, setTeam] = useState(hat?.team || "");
  const [colorDesign, setColorDesign] = useState(hat?.color_design || "");
  const [location, setLocation] = useState(hat?.location || "");
  const [pricePaid, setPricePaid] = useState(hat?.price_paid?.toString() || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState(
    hat?.image_url || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!hat;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!team) {
      toast.error("Please select a team");
      return;
    }

    if (!location) {
      toast.error("Please select a location");
      return;
    }

    setIsLoading(true);

    try {
      let imageUrl = existingImageUrl;

      // Upload new image if provided
      if (imageFile) {
        const filename = generateUniqueFilename(imageFile.name);
        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filename, imageFile);

        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(filename);

        imageUrl = publicUrl;

        // Delete old image if replacing
        if (isEdit && hat?.image_url) {
          const oldFilename = hat.image_url.split("/").pop();
          if (oldFilename) {
            await supabase.storage.from(STORAGE_BUCKET).remove([oldFilename]);
          }
        }
      }

      const hatData = {
        team,
        color_design: colorDesign,
        location,
        price_paid: pricePaid ? parseFloat(pricePaid) : null,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from("hats")
          .update(hatData)
          .eq("id", hat.id);

        if (error) throw error;
        toast.success("Hat updated successfully!");
      } else {
        const { error } = await supabase.from("hats").insert([hatData]);

        if (error) throw error;
        toast.success("Hat added successfully!");
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error saving hat:", error);
      toast.error("Failed to save hat. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTeam("");
    setColorDesign("");
    setLocation("");
    setPricePaid("");
    setImageFile(null);
    setExistingImageUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Hat" : "Add New Hat"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            value={existingImageUrl}
            onChange={(file) => {
              setImageFile(file);
              if (file) setExistingImageUrl(null);
            }}
          />

          <TeamSelect
            label="Team"
            value={team}
            onChange={setTeam}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Color/Design
            </label>
            <Input
              placeholder="e.g., Navy blue with gold trim"
              value={colorDesign}
              onChange={(e) => setColorDesign(e.target.value)}
            />
          </div>

          <LocationSelect
            label="Location"
            value={location}
            onChange={setLocation}
            required
          />

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Price Paid
            </label>
            <Input
              type="number"
              step="0.01"
              min="0"
              placeholder="e.g., 29.99"
              value={pricePaid}
              onChange={(e) => setPricePaid(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={isLoading}>
              {isLoading ? "Saving..." : isEdit ? "Update" : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
