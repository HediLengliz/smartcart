import ProductCard from '../ProductCard';
import applesImg from '@assets/generated_images/Product_image_red_apples_284e8d69.png';

export default function ProductCardExample() {
  return (
    <div className="w-80">
      <ProductCard
        id={1}
        name="Organic Red Apples"
        price={4.99}
        stock={25}
        image={applesImg}
        onAddToCart={(qty) => console.log(`Added ${qty} apples`)}
        onQuickView={() => console.log('Quick view')}
      />
    </div>
  );
}
