import { useState } from 'react';
import CartDrawer from '../CartDrawer';
import { Button } from '@/components/ui/button';
import applesImg from '@assets/generated_images/Product_image_red_apples_284e8d69.png';
import breadImg from '@assets/generated_images/Product_image_artisan_bread_95f14847.png';

export default function CartDrawerExample() {
  const [isOpen, setIsOpen] = useState(true);
  
  const mockItems = [
    { id: 1, productId: 1, name: "Organic Red Apples", price: 4.99, quantity: 2, image: applesImg },
    { id: 2, productId: 2, name: "Artisan Bread", price: 5.49, quantity: 1, image: breadImg },
  ];

  return (
    <div>
      <Button onClick={() => setIsOpen(true)}>Open Cart</Button>
      <CartDrawer
        isOpen={isOpen}
        items={mockItems}
        onClose={() => setIsOpen(false)}
        onUpdateQuantity={(id, qty) => console.log(`Update ${id} to ${qty}`)}
        onRemoveItem={(id) => console.log(`Remove ${id}`)}
        onCheckout={() => console.log('Checkout')}
      />
    </div>
  );
}
