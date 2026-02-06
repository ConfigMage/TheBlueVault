"use client";

import { Select } from "@/components/ui/select";
import { LOCATIONS } from "@/lib/constants";

interface LocationSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  showAll?: boolean;
}

export function LocationSelect({
  value,
  onChange,
  label,
  required,
  showAll = false,
}: LocationSelectProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {showAll && <option value="">All Locations</option>}
      {!showAll && <option value="">Select a location</option>}
      {LOCATIONS.map((location) => (
        <option key={location} value={location}>
          {location}
        </option>
      ))}
    </Select>
  );
}
