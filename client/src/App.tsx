import { useState } from "react";
import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import CartBadge from "@/components/CartBadge";
import CartDrawer from "@/components/CartDrawer";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ShoppingLists from "@/pages/ShoppingLists";
import Orders from "@/pages/Orders";
import Dashboard from "@/pages/Dashboard";
import Checkout from "@/pages/Checkout";
import FAQ from "@/pages/FAQ";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";
import { ShoppingBag, List, Package, LayoutDashboard, HelpCircle, Home as HomeIcon } from "lucide-react";

function Navigation() {
  const [location] = useLocation();
  const [cartOpen, setCartOpen] = useState(false);

  // TODO: remove mock functionality - cart items will come from cart state
  const cartItems = [
    { id: 1, productId: 1, name: "Organic Red Apples", price: 4.99, quantity: 2, image: "/placeholder.png" },
    { id: 2, productId: 2, name: "Artisan Bread", price: 5.49, quantity: 1, image: "/placeholder.png" },
  ];

  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/products", label: "Products", icon: ShoppingBag },
    { path: "/lists", label: "Lists", icon: List },
    { path: "/orders", label: "Orders", icon: Package },
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2" data-testid="link-logo">
            <ShoppingBag className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">SmartShop</span>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location === item.path ? "text-foreground" : "text-muted-foreground"
                }`}
                data-testid={`link-nav-${item.label.toLowerCase()}`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CartBadge itemCount={cartItems.length} onClick={() => setCartOpen(true)} />
          </div>
        </div>
      </header>

      <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background md:hidden">
        <nav className="flex items-center justify-around">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex flex-col items-center gap-1 p-3 text-xs ${
                  location === item.path ? "text-primary" : "text-muted-foreground"
                }`}
                data-testid={`link-mobile-${item.label.toLowerCase()}`}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <CartDrawer
        isOpen={cartOpen}
        items={cartItems}
        onClose={() => setCartOpen(false)}
        onUpdateQuantity={(id, qty) => console.log(`Update ${id} to ${qty}`)}
        onRemoveItem={(id) => console.log(`Remove ${id}`)}
        onCheckout={() => {
          setCartOpen(false);
          window.location.href = '/checkout';
        }}
      />
    </>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/products" component={Products} />
      <Route path="/lists" component={ShoppingLists} />
      <Route path="/orders" component={Orders} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/faq" component={FAQ} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-background">
            <Navigation />
            <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
              <Router />
            </main>
          </div>
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
