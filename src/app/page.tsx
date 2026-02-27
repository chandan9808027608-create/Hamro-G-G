import { Hero } from '@/components/home/Hero';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { MOCK_VEHICLES } from '@/lib/mock-data';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Shield, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Home() {
  const featuredVehicles = MOCK_VEHICLES.slice(0, 4);

  return (
    <div className="space-y-24 pb-20">
      <Hero />

      {/* Trust Badges / Stats Section */}
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

      {/* Featured Vehicles Section */}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredVehicles.map(vehicle => (
            <VehicleCard key={vehicle.id} vehicle={vehicle} />
          ))}
        </div>
        
        <div className="mt-12 md:hidden">
          <Button className="w-full h-14 rounded-2xl text-lg font-bold" asChild>
            <Link href="/inventory">View All Inventory</Link>
          </Button>
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-[3rem] overflow-hidden bg-primary py-16 px-8 md:px-20 text-white shadow-2xl shadow-primary/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24" />
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 max-w-2xl text-center lg:text-left">
              <h2 className="font-headline font-bold text-4xl md:text-5xl leading-tight">Ready to Upgrade <br /> Your Journey?</h2>
              <p className="text-white/80 text-xl leading-relaxed">
                Bring your old bike or scooter and walk out with a newer model today. We offer the most transparent and competitive exchange rates in Kathmandu.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
              <Button size="lg" className="h-16 px-10 bg-white text-primary hover:bg-gray-100 font-bold text-xl rounded-2xl shadow-xl" asChild>
                <Link href="/exchange">Get Free Appraisal</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}