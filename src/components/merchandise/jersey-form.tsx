"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ImageUpload } from "./image-upload";
import { TeamSelect } from "./team-select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { supabase, STORAGE_BUCKET } from "@/lib/supabase";
import { generateUniqueFilename } from "@/lib/utils";
import { Jersey } from "@/lib/types";

interface JerseyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jersey?: Jersey | null;
  onSuccess: () => void;
}

export function JerseyForm({
  open,
  onOpenChange,
  jersey,
  onSuccess,
}: JerseyFormProps) {
  const [team, setTeam] = useState(jersey?.team || "");
  const [player, setPlayer] = useState(jersey?.player || "");
  const [colorDesign, setColorDesign] = useState(jersey?.color_design || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState(
    jersey?.image_url || null
  );
  const [isLoading, setIsLoading] = useState(false);

  const isEdit = !!jersey;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!team) {
      toast.error("Please select a team");
      return;
    }

    if (!player) {
      toast.error("Please enter a player name");
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
        if (isEdit && jersey?.image_url) {
          const oldFilename = jersey.image_url.split("/").pop();
          if (oldFilename) {
            await supabase.storage.from(STORAGE_BUCKET).remove([oldFilename]);
          }
        }
      }

      const jerseyData = {
        team,
        player,
        color_design: colorDesign,
        image_url: imageUrl,
        updated_at: new Date().toISOString(),
      };

      if (isEdit) {
        const { error } = await supabase
          .from("jerseys")
          .update(jerseyData)
          .eq("id", jersey.id);

        if (error) throw error;
        toast.success("Jersey updated successfully!");
      } else {
        const { error } = await supabase.from("jerseys").insert([jerseyData]);

        if (error) throw error;
        toast.success("Jersey added successfully!");
      }

      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error saving jersey:", error);
      toast.error("Failed to save jersey. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTeam("");
    setPlayer("");
    setColorDesign("");
    setImageFile(null);
    setExistingImageUrl(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Jersey" : "Add New Jersey"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <ImageUpload
            value={existingImageUrl}
            onChange={(file) => {
              setImageFile(file);
              if (file) setExistingImageUrl(null);
            }}
          />

          <TeamSelect label="Team" value={team} onChange={setTeam} required />

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Player Name
            </label>
            <Input
              placeholder="e.g., Shohei Ohtani"
              value={player}
              onChange={(e) => setPlayer(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">
              Color/Design
            </label>
            <Input
              placeholder="e.g., Home white with red accents"
              value={colorDesign}
              onChange={(e) => setColorDesign(e.target.value)}
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
