
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MOCK_VEHICLES } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Pencil, Trash2, CheckCircle, ExternalLink, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [vehicles, setVehicles] = useState(MOCK_VEHICLES);

  const toggleStatus = (id: string) => {
    setVehicles(prev => prev.map(v => 
      v.id === id ? { ...v, status: v.status === 'available' ? 'sold' : 'available' } : v
    ));
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
            {vehicles.map((v) => (
              <TableRow key={v.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <img src={v.image_urls[0]} alt="" className="w-12 h-12 rounded object-cover" />
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
                  <Button size="icon" variant="ghost" title="Mark as Sold" onClick={() => toggleStatus(v.id)}>
                    <CheckCircle className={`w-4 h-4 ${v.status === 'sold' ? 'text-green-600' : 'text-muted-foreground'}`} />
                  </Button>
                  <Button size="icon" variant="ghost" title="Edit">
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" asChild>
                    <Link href={`/inventory/${v.id}`} target="_blank"><ExternalLink className="w-4 h-4" /></Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
