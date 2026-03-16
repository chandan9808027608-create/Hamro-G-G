"use client"

import Link from 'next/link';
import { Phone, Mail, MapPin, Facebook, MessageCircle } from 'lucide-react';
import { useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { CONTACT_INFO } from '@/lib/constants';

export function Footer() {
  const db = useFirestore();
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'general');
  }, [db]);
  const { data: settings } = useDoc(settingsRef);

  const logoImage = settings?.logo_url || PlaceHolderImages.find(img => img.id === 'logo')?.imageUrl;
  const businessName = settings?.business_name || "Hamro G&G Auto Enterprises";
  const contactPhone = settings?.contact_phone || CONTACT_INFO.phone;
  const contactEmail = settings?.contact_email || CONTACT_INFO.email;
  const address = settings?.address || CONTACT_INFO.address;

  const whatsappUrl = `https://wa.me/${CONTACT_INFO.whatsapp}`;

  return (
    <footer className="bg-primary text-white pt-12 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-white rounded-lg group-hover:rotate-6 transition-transform p-1 overflow-hidden flex items-center justify-center">
              <img 
                src={logoImage} 
                alt="Logo" 
                className="w-full h-full object-contain"
                data-ai-hint="business logo"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-lg uppercase leading-none">{businessName}</span>
              <span className="text-[8px] uppercase tracking-widest font-bold text-white/70">auto enterprises</span>
            </div>
          </Link>
          <p className="text-sm text-white/70 leading-relaxed">
            Reliable second-hand bikes and scooters showroom in {address.split(',')[0]}. 
            We offer sales, exchange, and servicing for all major brands.
          </p>
          <div className="flex gap-4">
            <a 
              href={CONTACT_INFO.facebook} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-secondary transition-colors"
              title="Follow us on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-secondary transition-colors"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link href="/inventory" className="hover:text-white transition-colors">All Inventory</Link></li>
            <li><Link href="/sell" className="hover:text-white transition-colors">Sell Your Bike</Link></li>
            <li><Link href="/exchange" className="hover:text-white transition-colors">Exchange Offers</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Our Services</Link></li>
            <li><Link href="/admin/login" className="hover:text-white transition-colors">Staff Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-4">Our Services</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Used Bike Sales</li>
            <li>Second Hand Scooters</li>
            <li>Easy Exchange Facility</li>
            <li>Insurance & Ownership Transfer</li>
            <li>Complete Servicing & Repairs</li>
          </ul>
        </div>

        <div>
          <h4 className="font-headline font-bold mb-4">Contact Us</h4>
          <ul className="space-y-3 text-sm text-white/70">
            <li className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-white/60" />
              <a 
                href={CONTACT_INFO.mapsLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                {address}
              </a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-white/60" />
              <a href={`tel:${contactPhone}`} className="hover:text-white transition-colors">{contactPhone}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-white/60" />
              <a href={`mailto:${contactEmail}`} className="hover:text-white transition-colors">{contactEmail}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} {businessName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
