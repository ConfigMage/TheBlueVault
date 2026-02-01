"use client";

import { Select } from "@/components/ui/select";
import { MLB_TEAMS } from "@/lib/constants";

interface TeamSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  showAll?: boolean;
}

export function TeamSelect({
  value,
  onChange,
  label,
  required,
  showAll = false,
}: TeamSelectProps) {
  return (
    <Select
      label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
    >
      {showAll && <option value="">All Teams</option>}
      {!showAll && <option value="">Select a team</option>}
      <option disabled>──────────</option>
      <option value="Los Angeles Dodgers">Los Angeles Dodgers</option>
      <option disabled>──────────</option>
      {MLB_TEAMS.slice(1).map((team) => (
        <option key={team} value={team}>
          {team}
        </option>
      ))}
    </Select>
  );
}
