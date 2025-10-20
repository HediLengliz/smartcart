import OrderCard from '../OrderCard';

export default function OrderCardExample() {
  return (
    <div className="w-80">
      <OrderCard
        id={1}
        orderNumber="ORD-2024-001"
        date="Jan 15, 2024"
        status="completed"
        total={45.97}
        itemCount={5}
        onViewDetails={() => console.log('View order details')}
      />
    </div>
  );
}
