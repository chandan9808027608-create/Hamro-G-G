
"use client"

import { useParams, useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Gauge, Bike, ChevronLeft, Phone, MessageCircle, Share2, ShieldCheck, MapPin, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { CONTACT_INFO } from '@/lib/constants';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Vehicle } from '@/types/vehicle';

export default function VehicleDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const db = useFirestore();
  
  const vehicleRef = useMemoFirebase(() => {
    if (!db || !id) return null;
    return doc(db, 'vehicles', id as string);
  }, [db, id]);

  const { data: vehicle, isLoading } = useDoc<Vehicle>(vehicleRef);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-40 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-xl font-medium text-muted-foreground">Fetching vehicle details...</p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-3xl font-bold">Vehicle Not Found</h1>
        <Button onClick={() => router.push('/inventory')}>Back to Inventory</Button>
      </div>
    );
  }

  const whatsappMessage = `Hello Hamro G&G Auto, I am interested in the ${vehicle.title} (${vehicle.year} model) priced at NPR ${vehicle.price.toLocaleString()}. Is it still available?`;
  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>
        <span className="text-sm text-muted-foreground">Inventory / {vehicle.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Media */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm aspect-video relative group">
            <img 
              src={vehicle.image_urls?.[0] || 'https://picsum.photos/seed/vehicle/800/600'} 
              alt={vehicle.title} 
              className="w-full h-full object-cover"
            />
            {vehicle.status === 'sold' && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white font-bold text-6xl tracking-widest -rotate-12 border-4 border-white p-4">SOLD</span>
              </div>
            )}
          </div>

          {/* Specs Grid */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Year</p>
              <div className="flex items-center gap-2 font-bold text-primary">
                <Calendar className="w-4 h-4 text-secondary" />
                <span>{vehicle.year}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">KM Run</p>
              <div className="flex items-center gap-2 font-bold text-primary">
                <Gauge className="w-4 h-4 text-secondary" />
                <span>{vehicle.km_run.toLocaleString()} KM</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Brand</p>
              <div className="flex items-center gap-2 font-bold text-primary">
                <Bike className="w-4 h-4 text-secondary" />
                <span>{vehicle.brand}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Condition</p>
              <div className="flex items-center gap-2 font-bold text-primary">
                <ShieldCheck className="w-4 h-4 text-secondary" />
                <span>{vehicle.condition}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-4">
            <h2 className="font-headline font-bold text-2xl">Description</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {vehicle.description}
            </div>
          </div>
        </div>

        {/* Right Column: Pricing and CTA */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-primary/5 space-y-6 sticky top-24">
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <h1 className="font-headline font-bold text-3xl">{vehicle.title}</h1>
                <Button variant="ghost" size="icon"><Share2 className="w-5 h-5" /></Button>
              </div>
              <div className="flex items-center gap-2 text-primary font-bold text-4xl pt-2">
                <span className="text-2xl">NPR</span>
                <span>{vehicle.price.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-3 pt-4">
              <Button 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-lg font-bold gap-3"
                asChild
              >
                <a href={`tel:${CONTACT_INFO.phone}`}>
                  <Phone className="w-5 h-5" /> Call Showroom
                </a>
              </Button>
              <Button 
                className="w-full h-14 bg-[#25D366] hover:bg-[#25D366]/90 text-white text-lg font-bold gap-3 border-none"
                asChild
              >
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                </a>
              </Button>
            </div>

            <div className="pt-6 border-t space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                <div className="text-sm">
                  <p className="font-bold">Showroom Location</p>
                  <a 
                    href={CONTACT_INFO.mapsLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    {CONTACT_INFO.address}
                  </a>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg text-green-700 text-sm font-medium">
                <ShieldCheck className="w-5 h-5" />
                <span>Ownership transfer handled by us</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
