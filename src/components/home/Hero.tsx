
import Link from 'next/link';
import { Search, ShieldCheck, BadgeCheck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Hero() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-bike')?.imageUrl;

  return (
    <div className="relative overflow-hidden bg-primary py-16 lg:py-24">
      {/* Background with opacity */}
      <div 
        className="absolute inset-0 z-0 opacity-20 bg-center bg-cover"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left space-y-6">
            <h1 className="font-headline font-bold text-4xl md:text-6xl text-white leading-tight">
              Reliable Rides, <br />
              <span className="text-secondary">Unbeatable Value</span>
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-lg mx-auto lg:mx-0">
              Find your perfect second-hand bike or scooter at Kathmandu's most trusted showroom. Fully inspected, fairly priced.
            </p>
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button size="lg" className="bg-secondary hover:bg-secondary/90 text-lg font-bold" asChild>
                <Link href="/inventory">Browse Inventory</Link>
              </Button>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary text-lg" asChild>
                <Link href="/sell">Sell Your Bike</Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8">
              <div className="flex items-center gap-2 text-white/90">
                <ShieldCheck className="w-5 h-5 text-secondary" />
                <span className="text-sm">Certified Bikes</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <BadgeCheck className="w-5 h-5 text-secondary" />
                <span className="text-sm">Fair Pricing</span>
              </div>
              <div className="flex items-center gap-2 text-white/90">
                <Clock className="w-5 h-5 text-secondary" />
                <span className="text-sm">Instant Exchange</span>
              </div>
            </div>
          </div>
          
          <div className="hidden lg:block relative">
            <img 
              src={heroImage} 
              alt="Premium Bike" 
              className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              data-ai-hint="sports motorcycle"
            />
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl flex items-center gap-4">
              <div className="bg-secondary/20 p-3 rounded-full">
                <Bike className="w-8 h-8 text-secondary" />
              </div>
              <div>
                <p className="text-primary font-bold text-xl leading-none">500+</p>
                <p className="text-muted-foreground text-sm">Bikes Sold</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Bike } from 'lucide-react';
