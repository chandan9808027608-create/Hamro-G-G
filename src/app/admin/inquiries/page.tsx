
"use client"

import { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Phone, User, Calendar, Trash2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([
    { id: 'l1', name: 'Rohan Sharma', phone: '9841234567', type: 'Exchange', vehicle: 'Pulsar 220', date: '2023-11-20', status: 'new' },
    { id: 'l2', name: 'Anita Gurung', phone: '9851098765', type: 'Purchase', vehicle: 'Honda Dio', date: '2023-11-19', status: 'viewed' },
    { id: 'l3', name: 'Suman Thapa', phone: '9867554433', type: 'Sell', vehicle: 'Ntorq 125', date: '2023-11-18', status: 'replied' },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Customer Leads</h1>
        <p className="text-muted-foreground">Manage inquiries from potential buyers and sellers</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Vehicle Interest</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {inquiries.map((lead) => (
              <TableRow key={lead.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-bold"><User className="w-3 h-3" /> {lead.name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground"><Phone className="w-3 h-3" /> {lead.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">{lead.type}</Badge>
                </TableCell>
                <TableCell className="font-medium">{lead.vehicle}</TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  <div className="flex items-center gap-2"><Calendar className="w-3 h-3" /> {lead.date}</div>
                </TableCell>
                <TableCell>
                  <Badge className={lead.status === 'new' ? 'bg-blue-100 text-blue-700' : lead.status === 'viewed' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'}>
                    {lead.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button size="icon" variant="ghost" title="Mark as Replied">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  </Button>
                  <Button size="icon" variant="ghost" className="text-destructive hover:bg-destructive/10">
                    <Trash2 className="w-4 h-4" />
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
