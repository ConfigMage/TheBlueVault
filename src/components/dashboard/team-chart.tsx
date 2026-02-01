"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TeamChartProps {
  data: { team: string; count: number }[];
  isLoading?: boolean;
}

export function TeamChart({ data, isLoading }: TeamChartProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  // Take top 10 teams
  const topTeams = data.slice(0, 10);

  if (topTeams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Items by Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-[var(--muted-foreground)]">
            No data yet. Add some items to see the breakdown!
          </div>
        </CardContent>
      </Card>
    );
  }

  // Shorten team names for display
  const formatTeamName = (name: string) => {
    return name.split(" ").pop() || name;
  };

  const chartData = topTeams.map((item) => ({
    ...item,
    shortName: formatTeamName(item.team),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Top Teams by Item Count</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 70, bottom: 5 }}
            >
              <XAxis type="number" allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="shortName"
                tick={{ fontSize: 12 }}
                width={65}
              />
              <Tooltip
                formatter={(value: number) => [value, "Items"]}
                labelFormatter={(label) => {
                  const item = chartData.find((d) => d.shortName === label);
                  return item?.team || label;
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid var(--border)",
                  borderRadius: "0.5rem",
                }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.team === "Los Angeles Dodgers"
                        ? "#005A9C"
                        : "#94a3b8"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
