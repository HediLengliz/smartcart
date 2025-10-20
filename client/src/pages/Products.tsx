import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ProductCard";
import applesImg from '@assets/generated_images/Product_image_red_apples_284e8d69.png';
import breadImg from '@assets/generated_images/Product_image_artisan_bread_95f14847.png';
import milkImg from '@assets/generated_images/Product_image_milk_bottle_35e9e2b1.png';
import bananasImg from '@assets/generated_images/Product_image_yellow_bananas_43a8e66f.png';
import coffeeImg from '@assets/generated_images/Product_image_coffee_beans_d0bb6ddc.png';
import juiceImg from '@assets/generated_images/Product_image_orange_juice_9d3b486d.png';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState("");

  // TODO: remove mock functionality - these will come from API
  const allProducts = [
    { id: 1, name: "Organic Red Apples", price: 4.99, stock: 25, image: applesImg },
    { id: 2, name: "Artisan Bread", price: 5.49, stock: 12, image: breadImg },
    { id: 3, name: "Fresh Milk", price: 3.99, stock: 30, image: milkImg },
    { id: 4, name: "Ripe Bananas", price: 2.99, stock: 18, image: bananasImg },
    { id: 5, name: "Premium Coffee Beans", price: 12.99, stock: 8, image: coffeeImg },
    { id: 6, name: "Fresh Orange Juice", price: 5.99, stock: 15, image: juiceImg },
  ];

  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="mb-2 text-3xl font-bold" data-testid="text-products-title">
          All Products
        </h1>
        <p className="text-muted-foreground">Browse our complete product catalog</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          data-testid="input-search-products"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={(qty) => console.log(`Add ${qty} of ${product.name} to cart`)}
            onQuickView={() => console.log(`Quick view ${product.name}`)}
          />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-12 text-center text-muted-foreground">
          No products found matching "{searchQuery}"
        </div>
      )}
    </div>
  );
}
