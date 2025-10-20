import CheckoutForm from '../CheckoutForm';

export default function CheckoutFormExample() {
  return (
    <div className="w-full max-w-md">
      <CheckoutForm
        total={45.97}
        onSubmit={(data) => console.log('Payment:', data)}
      />
    </div>
  );
}
