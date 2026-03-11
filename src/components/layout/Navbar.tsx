
"use client"

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, X, Wrench, LayoutDashboard, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const isAdminPage = pathname?.startsWith('/admin');
  const logoImage = PlaceHolderImages.find(img => img.id === 'logo')?.imageUrl;

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Services', href: '/services' },
    { name: 'Sell Bike', href: '/sell' },
    { name: 'Exchange', href: '/exchange' },
  ];

  const adminLinks = [
    { name: 'Inventory', href: '/admin/dashboard' },
    { name: 'Leads', href: '/admin/inquiries' },
    { name: 'Add New', href: '/admin/vehicles/new' },
  ];

  const links = isAdminPage ? adminLinks : navLinks;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-white rounded-xl group-hover:rotate-6 transition-transform duration-300 shadow-md border overflow-hidden flex items-center justify-center p-1">
              <img 
                src={logoImage} 
                alt="Hamro G&G Logo" 
                className="w-full h-full object-contain"
                data-ai-hint="business logo"
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline gap-1">
                <span className="font-headline font-black text-xs tracking-widest text-muted-foreground uppercase leading-none">Hamro</span>
              </div>
              <span className="font-headline font-bold text-2xl tracking-tighter leading-none text-primary uppercase">G&G AUTO</span>
              <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-muted-foreground mt-0.5">enterprises</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href ? 'text-primary' : 'text-foreground/70 hover:text-primary'
                }`}
              >
                {link.name}
              </Link>
            ))}
            
            <div className="h-6 w-px bg-gray-200 mx-2" />
            
            <div className="flex items-center gap-3">
              {isAdminPage ? (
                <Button variant="outline" className="font-bold gap-2 rounded-full" asChild>
                  <Link href="/"><Bike className="w-4 h-4" /> View Site</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" className="font-bold text-primary gap-2" asChild>
                    <Link href="/book-service"><Wrench className="w-4 h-4" /> Book Service</Link>
                  </Button>
                  <Button className="font-bold rounded-full px-6 shadow-lg shadow-primary/20" asChild>
                    <Link href="/inventory">Browse Bikes</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-300">
          <div className="px-4 pt-4 pb-6 space-y-2">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-foreground/80 hover:bg-gray-50 hover:text-primary transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {!isAdminPage && (
              <Link
                href="/book-service"
                className="block px-4 py-3 rounded-xl text-base font-semibold text-primary hover:bg-primary/5 transition-all flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <Wrench className="w-4 h-4" /> Book Appointment
              </Link>
            )}
            <div className="pt-4">
              <Button className="w-full h-12 rounded-xl font-bold" asChild onClick={() => setIsOpen(false)}>
                <Link href={isAdminPage ? "/admin/dashboard" : "/inventory"}>
                  {isAdminPage ? "Go to Dashboard" : "Browse Inventory"}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
