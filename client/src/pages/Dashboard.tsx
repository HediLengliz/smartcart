import DashboardStats from "@/components/DashboardStats";
import UserProfileCard from "@/components/UserProfileCard";
import OrderCard from "@/components/OrderCard";
import { Button } from "@/components/ui/button";
import { Plus, ShoppingBag, List } from "lucide-react";

export default function Dashboard() {
  // TODO: remove mock functionality - these will come from API
  const recentOrders = [
    {
      id: 1,
      orderNumber: "ORD-2024-001",
      date: "Jan 15, 2024",
      status: "completed" as const,
      total: 45.97,
      itemCount: 5,
    },
    {
      id: 2,
      orderNumber: "ORD-2024-002",
      date: "Jan 18, 2024",
      status: "pending" as const,
      total: 23.45,
      itemCount: 3,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold" data-testid="text-dashboard-title">
          Dashboard
        </h1>
        <p className="text-muted-foreground">Welcome back! Here's your activity overview</p>
      </div>

      <DashboardStats totalOrders={12} activeLists={3} savedProducts={28} />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Recent Orders</h2>
            <Button variant="outline" data-testid="button-view-all-orders">
              View All
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {recentOrders.map((order) => (
              <OrderCard
                key={order.id}
                {...order}
                onViewDetails={() => console.log(`View order ${order.id}`)}
              />
            ))}
          </div>

          <div>
            <h2 className="mb-4 text-2xl font-bold">Quick Actions</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                data-testid="button-quick-create-list"
                onClick={() => console.log('Create list')}
              >
                <Plus className="h-6 w-6" />
                <span>Create Shopping List</span>
              </Button>
              <Button
                variant="outline"
                className="h-24 flex-col gap-2"
                data-testid="button-quick-browse-products"
                onClick={() => console.log('Browse products')}
              >
                <ShoppingBag className="h-6 w-6" />
                <span>Browse Products</span>
              </Button>
            </div>
          </div>
        </div>

        <div>
          <UserProfileCard
            name="John Doe"
            email="john.doe@example.com"
            facebookLinked={false}
            onEdit={() => console.log('Edit profile')}
            onLinkFacebook={() => console.log('Link Facebook')}
            onShare={() => console.log('Share lists')}
          />
        </div>
      </div>
    </div>
  );
}
