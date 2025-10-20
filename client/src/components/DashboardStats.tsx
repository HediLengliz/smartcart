import { ShoppingBag, List, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalOrders: number;
  activeLists: number;
  savedProducts: number;
}

export default function DashboardStats({ totalOrders, activeLists, savedProducts }: DashboardStatsProps) {
  const stats = [
    {
      label: "Total Orders",
      value: totalOrders,
      icon: ShoppingBag,
      color: "text-blue-600 dark:text-blue-500",
    },
    {
      label: "Active Lists",
      value: activeLists,
      icon: List,
      color: "text-green-600 dark:text-green-500",
    },
    {
      label: "Saved Products",
      value: savedProducts,
      icon: Heart,
      color: "text-orange-600 dark:text-orange-500",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="hover-elevate" data-testid={`card-stat-${index}`}>
          <CardContent className="flex items-center gap-4 p-6">
            <div className={`rounded-lg bg-muted p-3 ${stat.color}`}>
              <stat.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold" data-testid={`text-stat-value-${index}`}>
                {stat.value}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
