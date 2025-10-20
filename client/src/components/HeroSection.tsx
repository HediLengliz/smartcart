import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import heroImg from '@assets/generated_images/E-commerce_hero_banner_image_78e4f9ae.png';

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    console.log('Search:', query);
    onSearch?.(query);
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="SmartShop groceries and products"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      
      <div className="relative px-6 py-24 sm:px-12 sm:py-32">
        <div className="max-w-2xl">
          <h1 className="mb-4 text-4xl font-bold text-white sm:text-5xl" data-testid="text-hero-title">
            Smart Shopping Made Simple
          </h1>
          <p className="mb-8 text-lg text-white/90" data-testid="text-hero-subtitle">
            AI-powered recommendations, easy list management, and secure checkout all in one place
          </p>
          
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                name="search"
                placeholder="Search for products..."
                className="h-12 border-0 bg-white/95 pl-10 text-base backdrop-blur-sm"
                data-testid="input-hero-search"
              />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" data-testid="button-hero-search">
              Search
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
