"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Bike, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CONTACT_INFO } from '@/lib/constants';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Services', href: '/services' },
    { name: 'Sell Bike', href: '/sell' },
    { name: 'Exchange', href: '/exchange' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-primary text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="p-1 bg-secondary rounded-full">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <span className="font-headline font-bold text-xl tracking-tight uppercase">G&G auto enterprises</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-medium hover:text-secondary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Button variant="secondary" className="font-semibold" asChild>
              <Link href="/inventory">Browse Bikes</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-primary-foreground/10"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-primary border-t border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-3 py-2 rounded-md text-base font-medium hover:bg-primary-foreground/10"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
