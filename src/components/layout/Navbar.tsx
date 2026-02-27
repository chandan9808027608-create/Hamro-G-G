"use client"

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Bike } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Inventory', href: '/inventory' },
    { name: 'Services', href: '/services' },
    { name: 'Sell Bike', href: '/sell' },
    { name: 'Exchange', href: '/exchange' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-primary rounded-xl group-hover:rotate-12 transition-transform duration-300">
              <Bike className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-headline font-bold text-xl tracking-tight leading-none text-primary">G&G</span>
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground">auto enterprises</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href}
                className="text-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Button className="font-bold rounded-full px-6 shadow-lg shadow-primary/20" asChild>
              <Link href="/inventory">Browse Bikes</Link>
            </Button>
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
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block px-4 py-3 rounded-xl text-base font-semibold text-foreground/80 hover:bg-gray-50 hover:text-primary transition-all"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4">
              <Button className="w-full h-12 rounded-xl font-bold" asChild onClick={() => setIsOpen(false)}>
                <Link href="/inventory">Browse Inventory</Link>
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}