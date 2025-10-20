import { useState } from "react";
import HeroSection from "@/components/HeroSection";
import RecommendedProducts from "@/components/RecommendedProducts";
import applesImg from '@assets/generated_images/Product_image_red_apples_284e8d69.png';
import breadImg from '@assets/generated_images/Product_image_artisan_bread_95f14847.png';
import milkImg from '@assets/generated_images/Product_image_milk_bottle_35e9e2b1.png';
import bananasImg from '@assets/generated_images/Product_image_yellow_bananas_43a8e66f.png';
import coffeeImg from '@assets/generated_images/Product_image_coffee_beans_d0bb6ddc.png';
import juiceImg from '@assets/generated_images/Product_image_orange_juice_9d3b486d.png';

export default function Home() {
  // TODO: remove mock functionality - these will come from API
  const recommendedProducts = [
    { id: 1, name: "Organic Red Apples", price: 4.99, stock: 25, image: applesImg },
    { id: 2, name: "Artisan Bread", price: 5.49, stock: 12, image: breadImg },
    { id: 3, name: "Fresh Milk", price: 3.99, stock: 30, image: milkImg },
    { id: 4, name: "Ripe Bananas", price: 2.99, stock: 18, image: bananasImg },
  ];

  const trendingProducts = [
    { id: 5, name: "Premium Coffee Beans", price: 12.99, stock: 8, image: coffeeImg },
    { id: 6, name: "Fresh Orange Juice", price: 5.99, stock: 15, image: juiceImg },
    { id: 1, name: "Organic Red Apples", price: 4.99, stock: 25, image: applesImg },
    { id: 3, name: "Fresh Milk", price: 3.99, stock: 30, image: milkImg },
  ];

  return (
    <div className="space-y-12">
      <HeroSection onSearch={(query) => console.log('Search:', query)} />
      
      <RecommendedProducts
        products={recommendedProducts}
        type="recommended"
        onAddToCart={(id, qty) => console.log(`Add ${qty} of product ${id} to cart`)}
        onQuickView={(id) => console.log(`Quick view product ${id}`)}
      />

      <RecommendedProducts
        products={trendingProducts}
        type="trending"
        onAddToCart={(id, qty) => console.log(`Add ${qty} of product ${id} to cart`)}
        onQuickView={(id) => console.log(`Quick view product ${id}`)}
      />
    </div>
  );
}
