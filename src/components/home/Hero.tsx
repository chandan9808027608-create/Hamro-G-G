
"use client"

import Link from 'next/link';
import { ShieldCheck, BadgeCheck, Clock, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';

export function Hero() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'general');
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  const defaultHero = PlaceHolderImages.find(img => img.id === 'hero-bike')?.imageUrl;
  const heroImage = settings?.hero_image_url || defaultHero;

  return (
    <div className="relative min-h-[85vh] flex items-center overflow-hidden bg-white">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 -skew-x-12 transform origin-top-right hidden lg:block" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-50" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="text-center lg:text-left space-y-10">
            <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary font-bold text-sm animate-in fade-in slide-in-from-left duration-700">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              KATHMANDU'S #1 SECOND-HAND SHOWROOM
            </div>
            
            <h1 className="font-headline font-bold text-5xl md:text-7xl text-foreground leading-[1.1] tracking-tight">
              Ride Your <span className="text-primary">Dream</span> <br />
              With Confidence
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Find reliable, inspected, and fairly priced second-hand bikes and scooters. Your journey to a perfect ride starts here.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
              <Button size="lg" className="h-14 px-8 bg-primary hover:bg-primary/90 text-lg font-bold rounded-full shadow-2xl shadow-primary/30 group" asChild>
                <Link href="/inventory">
                  Explore Inventory <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-2 border-primary/20 hover:border-primary hover:bg-transparent text-primary text-lg font-bold rounded-full group" asChild>
                <Link href="/sell" className="flex items-center">
                  <Play className="mr-2 w-4 h-4 fill-primary" /> How it Works
                </Link>
              </Button>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm leading-none">Certified</p>
                  <p className="text-xs text-muted-foreground">Quality Check</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BadgeCheck className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm leading-none">Transparent</p>
                  <p className="text-xs text-muted-foreground">Fair Pricing</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm leading-none">Instant</p>
                  <p className="text-xs text-muted-foreground">Exchange</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative group perspective-1000 hidden lg:block">
            <div className="absolute -inset-4 bg-primary/20 rounded-[3rem] blur-2xl group-hover:bg-primary/30 transition-all duration-500" />
            <div className="relative overflow-hidden rounded-[2.5rem] shadow-2xl transition-all duration-500 transform group-hover:scale-[1.02] group-hover:-rotate-1">
              <img 
                src={heroImage} 
                alt="Premium Bike" 
                className="w-full object-cover aspect-[4/5] lg:aspect-auto"
                data-ai-hint="sports motorcycle"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-10 left-10 text-white space-y-2">
                <div className="bg-primary px-3 py-1 rounded-full text-xs font-bold inline-block">TRENDING NOW</div>
                <p className="text-3xl font-bold font-headline leading-tight">Featured <br /> Collection 2024</p>
              </div>
            </div>
            
            {/* Floating Stats Card */}
            <div className="absolute -bottom-10 -right-10 bg-white p-6 rounded-2xl shadow-2xl animate-bounce-slow border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 p-4 rounded-xl">
                  <span className="text-2xl font-bold text-primary">500+</span>
                </div>
                <div>
                  <p className="font-bold text-sm">Happy Riders</p>
                  <p className="text-xs text-muted-foreground text-nowrap">Join our community</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
