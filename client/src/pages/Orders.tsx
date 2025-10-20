import OrderCard from "@/components/OrderCard";

export default function Orders() {
  // TODO: remove mock functionality - these will come from API
  const mockOrders = [
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
    {
      id: 3,
      orderNumber: "ORD-2024-003",
      date: "Jan 20, 2024",
      status: "completed" as const,
      total: 67.89,
      itemCount: 8,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold" data-testid="text-orders-title">
          Order History
        </h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockOrders.map((order) => (
          <OrderCard
            key={order.id}
            {...order}
            onViewDetails={() => console.log(`View details for order ${order.id}`)}
          />
        ))}
      </div>
    </div>
  );
}
