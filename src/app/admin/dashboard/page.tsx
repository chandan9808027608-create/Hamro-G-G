
"use client"

import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle, ExternalLink, MessageSquare, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Vehicle } from '@/types/vehicle';

export default function AdminDashboard() {
  const db = useFirestore();
  
  const vehiclesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'vehicles');
  }, [db]);

  const { data: vehicles, isLoading } = useCollection<Vehicle>(vehiclesQuery);

  const toggleStatus = (id: string, currentStatus: string) => {
    if (!db) return;
    const docRef = doc(db, 'vehicles', id);
    const newStatus = currentStatus === 'available' ? 'sold' : 'available';
    updateDocumentNonBlocking(docRef, { status: newStatus });
  };

  const deleteVehicle = (id: string) => {
    if (!db || !confirm('Are you sure you want to delete this vehicle?')) return;
    const docRef = doc(db, 'vehicles', id);
    deleteDocumentNonBlocking(docRef);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold font-headline">Vehicle Management</h1>
          <p className="text-muted-foreground">Add and manage your active inventory</p>
        </div>
        <div className="flex gap-4">
          <Button variant="outline" asChild>
            <Link href="/admin/inquiries"><MessageSquare className="w-4 h-4 mr-2" /> Leads</Link>
          </Button>
          <Button className="bg-primary" asChild>
            <Link href="/admin/vehicles/new"><Plus className="w-4 h-4 mr-2" /> Add Vehicle</Link>
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading inventory...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Brand/Model</TableHead>
                <TableHead>Year/KM</TableHead>
                <TableHead>Price (NPR)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vehicles?.map((v) => (
                <TableRow key={v.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-3">
                      <img src={v.image_urls?.[0] || 'https://picsum.photos/seed/placeholder/100/100'} alt="" className="w-12 h-12 rounded object-cover" />
                      <span>{v.title}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">{v.brand}</div>
                    <div className="font-medium">{v.model}</div>
                  </TableCell>
                  <TableCell>
                    <div className="text-xs">{v.year} Model</div>
                    <div className="font-medium">{v.km_run.toLocaleString()} KM</div>
                  </TableCell>
                  <TableCell className="font-bold">{v.price.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={v.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}>
                      {v.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button size="icon" variant="ghost" title="Mark as Sold" onClick={() => toggleStatus(v.id, v.status)}>
                      <CheckCircle className={`w-4 h-4 ${v.status === 'sold' ? 'text-green-600' : 'text-muted-foreground'}`} />
                    </Button>
                    <Button size="icon" variant="ghost" title="Edit">
                      <Pencil className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteVehicle(v.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button size="icon" variant="ghost" asChild>
                      <Link href={`/inventory/${v.id}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {vehicles?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="h-40 text-center text-muted-foreground">
                    No vehicles in inventory yet. Add your first listing!
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
