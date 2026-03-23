
"use client"

import { Hero } from '@/components/home/Hero';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Clock, CheckCircle, ArrowRight, Calendar, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useFirestore, useCollection, useMemoFirebase, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Vehicle } from '@/types/vehicle';

export default function Home() {
  const db = useFirestore();
  const vehiclesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'vehicles');
  }, [db]);

  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'general');
  }, [db]);

  const { data: vehicles, isLoading } = useCollection<Vehicle>(vehiclesQuery);
  const { data: settings } = useDoc(settingsRef);
  
  const featuredVehicles = vehicles?.slice(0, 4) || [];
  const serviceImage = settings?.service_image_url || "https://picsum.photos/seed/service/800/600";

  return (
    <div className="space-y-24 pb-20">
      <Hero />

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center text-center space-y-6 group hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-primary/10 p-5 rounded-3xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
              <Shield className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline font-bold text-2xl">Verified Quality</h3>
              <p className="text-muted-foreground leading-relaxed">Every vehicle undergoes a rigorous 40-point expert inspection process.</p>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center text-center space-y-6 group hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-primary/10 p-5 rounded-3xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
              <Clock className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline font-bold text-2xl">Quick Exchange</h3>
              <p className="text-muted-foreground leading-relaxed">Upgrade your ride in minutes with the best market valuation for your old bike.</p>
            </div>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-gray-50 flex flex-col items-center text-center space-y-6 group hover:-translate-y-2 transition-transform duration-300">
            <div className="bg-primary/10 p-5 rounded-3xl group-hover:bg-primary group-hover:text-white transition-colors duration-300 text-primary">
              <CheckCircle className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-headline font-bold text-2xl">Smooth Transfer</h3>
              <p className="text-muted-foreground leading-relaxed">Hassle-free ownership and document transfer handled entirely by our experts.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-12 text-center md:text-left gap-6">
          <div className="space-y-4">
            <Badge className="bg-primary/10 text-primary border-none font-bold px-4 py-1">HOT ARRIVALS</Badge>
            <h2 className="font-headline font-bold text-4xl md:text-5xl leading-tight">Featured <br className="hidden md:block" /> Inventory</h2>
          </div>
          <Link href="/inventory" className="group flex items-center gap-2 text-primary font-bold text-lg hover:underline transition-all">
            View Full Inventory <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
            {featuredVehicles.length === 0 && (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                Check back soon for new inventory!
              </div>
            )}
          </div>
        )}
      </section>

      {/* Service Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gray-50 rounded-[3rem] p-8 md:p-16 flex flex-col lg:flex-row gap-12 items-center border">
          <div className="flex-1 space-y-6">
            <Badge className="bg-secondary text-white border-none font-bold px-4 py-1">MAINTENANCE</Badge>
            <h2 className="font-headline font-bold text-4xl md:text-5xl leading-tight">Professional <br /> Bike Servicing</h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-xl">
              Don't wait for a breakdown. Get regular servicing from our expert mechanics. We use premium oil and genuine parts for all major brands.
            </p>
            <Button size="lg" className="h-16 px-10 bg-primary hover:bg-primary/90 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 gap-3" asChild>
              <Link href="/book-service"><Calendar className="w-5 h-5" /> Book Appointment Now</Link>
            </Button>
          </div>
          <div className="flex-1 relative group w-full lg:w-auto">
            <img 
              src={serviceImage} 
              alt="Bike Service" 
              className="relative w-full rounded-[2.5rem] shadow-2xl object-cover aspect-[4/3]" 
              data-ai-hint="motorcycle maintenance"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
