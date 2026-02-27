
import { Hero } from '@/components/home/Hero';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { MOCK_VEHICLES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Bike, CheckCircle, Clock, Shield } from 'lucide-react';

export default function Home() {
  const featuredVehicles = MOCK_VEHICLES.slice(0, 4);

  return (
    <div className="space-y-16">
      <Hero />

      {/* Highlights Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border flex flex-col items-center text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-xl">Verified Quality</h3>
            <p className="text-muted-foreground">Every vehicle undergoes a 40-point inspection to ensure complete peace of mind.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border flex flex-col items-center text-center space-y-4">
            <div className="bg-secondary/10 p-4 rounded-full">
              <Clock className="w-8 h-8 text-secondary" />
            </div>
            <h3 className="font-headline font-bold text-xl">Quick Exchange</h3>
            <p className="text-muted-foreground">Get the best market valuation for your old ride and upgrade instantly.</p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm border flex flex-col items-center text-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-headline font-bold text-xl">Easy Ownership</h3>
            <p className="text-muted-foreground">We handle all documentation and transfer processes for a hassle-free experience.</p>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-10">
            <div className="space-y-2">
              <Badge className="bg-secondary text-white">HOT ARRIVALS</Badge>
              <h2 className="font-headline font-bold text-3xl">Featured Inventory</h2>
            </div>
            <Link href="/inventory" className="text-primary font-bold hover:underline hidden sm:block">
              View All Inventory →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
          
          <div className="mt-10 sm:hidden">
            <Button className="w-full bg-primary" asChild>
              <Link href="/inventory">View All Inventory</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Simple CTA */}
      <section className="max-w-7xl mx-auto px-4 pb-16">
        <div className="bg-secondary p-8 md:p-12 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl text-center md:text-left">
            <h2 className="font-headline font-bold text-3xl md:text-4xl">Ready to Upgrade?</h2>
            <p className="text-white/90 text-lg">Bring your old bike or scooter and walk out with a newer model today. We offer the best exchange rates in Kathmandu.</p>
          </div>
          <div className="flex gap-4">
            <Button size="lg" className="bg-white text-secondary hover:bg-white/90 font-bold" asChild>
              <Link href="/exchange">Get Appraisal</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

import { Badge } from '@/components/ui/badge';
