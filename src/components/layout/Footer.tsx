
import Link from 'next/link';
import { Bike, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export function Footer() {
  return (
    <footer className="bg-primary text-white pt-12 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-secondary rounded-full">
              <Bike className="w-5 h-5" />
            </div>
            <span className="font-headline font-bold text-lg">G&G AUTO HUB</span>
          </Link>
          <p className="text-sm text-white/70 leading-relaxed">
            Reliable second-hand bikes and scooters showroom in Samakhusi, Kathmandu. 
            We offer sales, exchange, and servicing.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-secondary"><Facebook className="w-5 h-5" /></Link>
            <Link href="#" className="hover:text-secondary"><Instagram className="w-5 h-5" /></Link>
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
              <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-secondary" />
              <span>{CONTACT_INFO.address}</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-4 h-4 shrink-0 text-secondary" />
              <span>{CONTACT_INFO.phone}</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-4 h-4 shrink-0 text-secondary" />
              <span>{CONTACT_INFO.email}</span>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 mt-12 pt-8 border-t border-white/10 text-center text-xs text-white/40">
        <p>&copy; {new Date().getFullYear()} {CONTACT_INFO.businessName}. All rights reserved.</p>
      </div>
    </footer>
  );
}
