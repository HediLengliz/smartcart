import CartBadge from '../CartBadge';

export default function CartBadgeExample() {
  return <CartBadge itemCount={3} onClick={() => console.log('Cart clicked')} />;
}
