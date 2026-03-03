
"use client"

import { useState, useMemo } from 'react';
import { VehicleCard } from '@/components/inventory/VehicleCard';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Loader2 } from 'lucide-react';
import { BRANDS } from '@/lib/constants';
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection } from 'firebase/firestore';
import { Vehicle } from '@/types/vehicle';

export default function InventoryPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');

  const db = useFirestore();
  const vehiclesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'vehicles');
  }, [db]);

  const { data: dbVehicles, isLoading } = useCollection<Vehicle>(vehiclesQuery);

  const filteredVehicles = useMemo(() => {
    if (!dbVehicles) return [];
    
    return dbVehicles.filter(v => {
      const matchesSearch = v.title.toLowerCase().includes(search.toLowerCase()) || 
                           v.brand.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || v.type === typeFilter;
      const matchesBrand = brandFilter === 'all' || v.brand === brandFilter;
      return matchesSearch && matchesType && matchesBrand;
    }).sort((a, b) => {
      if (sortOrder === 'price-low') return a.price - b.price;
      if (sortOrder === 'price-high') return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [dbVehicles, search, typeFilter, brandFilter, sortOrder]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="font-headline font-bold text-3xl">Our Inventory</h1>
        <p className="text-muted-foreground">Find the perfect two-wheeler that fits your budget and lifestyle.</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        <div className="relative col-span-1 md:col-span-1 lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search by brand or model..." 
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Vehicle Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="bike">Bikes</SelectItem>
            <SelectItem value="scooter">Scooters</SelectItem>
          </SelectContent>
        </Select>

        <Select value={brandFilter} onValueChange={setBrandFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Brand" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Brands</SelectItem>
            {BRANDS.map(brand => (
              <SelectItem key={brand} value={brand}>{brand}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sortOrder} onValueChange={setSortOrder}>
          <SelectTrigger>
            <SelectValue placeholder="Sort By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="latest">Latest Added</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results */}
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <p className="text-muted-foreground">Refreshing inventory...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredVehicles.length > 0 ? (
            filteredVehicles.map(vehicle => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-muted w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-headline font-bold text-xl">No vehicles found</h3>
              <p className="text-muted-foreground">Try adjusting your filters or search terms.</p>
              <button 
                onClick={() => {setSearch(''); setTypeFilter('all'); setBrandFilter('all');}}
                className="text-primary font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
