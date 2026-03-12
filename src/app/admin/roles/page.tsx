"use client"

import { useState } from 'react';
import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, useUser, setDocumentNonBlocking } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserCog, Loader2, Users, AlertTriangle, UserPlus, Trash2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function RolesPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'super_admin'>('admin');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const rolesQuery = useMemoFirebase(() => {
    if (!db) return null;
    return collection(db, 'roles_admin');
  }, [db]);

  const { data: roles, isLoading } = useCollection(rolesQuery);

  const changeRole = (userId: string, newRole: string) => {
    if (!db) return;
    if (userId === user?.uid) {
      toast({ variant: "destructive", title: "Action Denied", description: "You cannot change your own role to avoid self-lockout." });
      return;
    }
    const docRef = doc(db, 'roles_admin', userId);
    updateDocumentNonBlocking(docRef, { role: newRole });
    toast({ title: "Role Updated", description: "The staff role has been updated successfully." });
  };

  const deleteStaff = (userId: string) => {
    if (!db || !confirm('Are you sure you want to remove this staff member?')) return;
    if (userId === user?.uid) {
      toast({ variant: "destructive", title: "Action Denied", description: "You cannot remove yourself." });
      return;
    }
    const docRef = doc(db, 'roles_admin', userId);
    deleteDocumentNonBlocking(docRef);
    toast({ title: "Staff Removed", description: "The access record has been deleted." });
  };

  const handleAddStaff = () => {
    if (!db || !newEmail) return;
    setIsSubmitting(true);
    
    // Create an invitation based on the email
    const newStaffRef = doc(collection(db, 'roles_admin'));
    
    setDocumentNonBlocking(newStaffRef, {
      email: newEmail.toLowerCase(),
      role: newRole,
      createdAt: new Date().toISOString(),
      status: 'invited' 
    }, { merge: true });

    toast({ title: "Staff Authorized", description: `${newEmail} has been pre-authorized as ${newRole}.` });
    setNewEmail('');
    setIsAddOpen(false);
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Staff Management
          </h1>
          <p className="text-muted-foreground">Manage administrative roles and access levels</p>
        </div>

        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full gap-2 px-6">
              <UserPlus className="w-4 h-4" /> Pre-Authorize Staff
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] rounded-[2rem]">
            <DialogHeader>
              <DialogTitle>Pre-Authorize New Staff</DialogTitle>
              <DialogDescription>
                Provide an email address to grant pre-approved access to the dashboard.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold uppercase tracking-widest ml-1">Email Address</Label>
                <Input 
                  id="email" 
                  placeholder="Enter staff email" 
                  autoComplete="off"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="rounded-xl h-12"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-widest ml-1">Assigned Role</Label>
                <Select value={newRole} onValueChange={(val: any) => setNewRole(val)}>
                  <SelectTrigger className="rounded-xl h-12">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin (Standard)</SelectItem>
                    <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button 
                onClick={handleAddStaff} 
                disabled={isSubmitting || !newEmail}
                className="w-full h-12 rounded-xl font-bold"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Authorize Staff Member"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl border overflow-hidden">
        {isLoading ? (
          <div className="p-20 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading staff list...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="py-5">Staff Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead className="text-right px-8">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((r: any) => (
                <TableRow key={r.id} className="hover:bg-gray-50/30 transition-colors">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {r.role === 'super_admin' ? <ShieldCheck className="w-5 h-5 text-primary" /> : <UserCog className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold">{r.id === user?.uid ? "You (Current Session)" : "Staff Member"}</span>
                        {r.status === 'invited' && <span className="text-[10px] text-orange-600 font-bold uppercase">Pending Initial Login</span>}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{r.email}</TableCell>
                  <TableCell>
                    <Badge className={r.role === 'super_admin' ? 'bg-primary text-white px-3 py-1' : 'bg-gray-100 text-gray-700 px-3 py-1'}>
                      {r.role.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <div className="flex items-center justify-end gap-2">
                      <Select defaultValue={r.role} onValueChange={(val) => changeRole(r.id, val)} disabled={r.id === user?.uid}>
                        <SelectTrigger className="w-32 h-10 rounded-xl">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="super_admin">Super</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="text-destructive hover:bg-destructive/10 rounded-full"
                        onClick={() => deleteStaff(r.id)}
                        disabled={r.id === user?.uid}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {roles?.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                    No staff members found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl flex items-start gap-4 shadow-sm">
        <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-bold mb-1 uppercase tracking-tight">Access Control</p>
          <p>Adding a staff member by email allows them to be automatically granted that role when they log in. Super Admins can manage all branding, roles, and showroom settings.</p>
        </div>
      </div>
    </div>
  );
}
