import RecommendedProducts from '../RecommendedProducts';
import applesImg from '@assets/generated_images/Product_image_red_apples_284e8d69.png';
import breadImg from '@assets/generated_images/Product_image_artisan_bread_95f14847.png';
import milkImg from '@assets/generated_images/Product_image_milk_bottle_35e9e2b1.png';
import bananasImg from '@assets/generated_images/Product_image_yellow_bananas_43a8e66f.png';

export default function RecommendedProductsExample() {
  const mockProducts = [
    { id: 1, name: "Organic Red Apples", price: 4.99, stock: 25, image: applesImg },
    { id: 2, name: "Artisan Bread", price: 5.49, stock: 12, image: breadImg },
    { id: 3, name: "Fresh Milk", price: 3.99, stock: 30, image: milkImg },
    { id: 4, name: "Ripe Bananas", price: 2.99, stock: 18, image: bananasImg },
  ];

  return (
    <RecommendedProducts
      products={mockProducts}
      type="recommended"
      onAddToCart={(id, qty) => console.log(`Add ${qty} of product ${id}`)}
      onQuickView={(id) => console.log(`View product ${id}`)}
    />
  );
}
