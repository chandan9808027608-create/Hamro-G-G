
"use client"

import { useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, useUser } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShieldCheck, UserCog, Loader2, Users, AlertTriangle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function RolesPage() {
  const db = useFirestore();
  const { user } = useUser();
  const { toast } = useToast();
  
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

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
            <Users className="w-8 h-8 text-primary" /> Staff Management
          </h1>
          <p className="text-muted-foreground">Manage administrative roles and access levels</p>
        </div>
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
                <TableHead>Staff Member</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Current Role</TableHead>
                <TableHead className="text-right px-8">Change Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles?.map((r: any) => (
                <TableRow key={r.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full">
                        {r.role === 'super_admin' ? <ShieldCheck className="w-5 h-5 text-primary" /> : <UserCog className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <span className="font-bold">{r.id === user?.uid ? "You (Current Session)" : "Staff Member"}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-medium">{r.email}</TableCell>
                  <TableCell>
                    <Badge className={r.role === 'super_admin' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700'}>
                      {r.role.toUpperCase().replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right px-8">
                    <Select defaultValue={r.role} onValueChange={(val) => changeRole(r.id, val)} disabled={r.id === user?.uid}>
                      <SelectTrigger className="w-40 ml-auto h-10 rounded-xl">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-2xl flex items-start gap-4">
        <AlertTriangle className="w-6 h-6 text-yellow-600 shrink-0" />
        <div className="text-sm text-yellow-800">
          <p className="font-bold mb-1">Caution: High Level Access</p>
          <p>Super Admins have full control over site settings, roles, and data. Only grant Super Admin status to trusted core team members.</p>
        </div>
      </div>
    </div>
  );
}
