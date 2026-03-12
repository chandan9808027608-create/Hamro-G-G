"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Lock, Loader2, ShieldCheck, UserCog } from 'lucide-react';
import { useAuth, useFirestore, setDocumentNonBlocking } from '@/firebase';
import { signInAnonymously } from 'firebase/auth';
import { doc } from 'firebase/firestore';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'super_admin']),
});

export default function LoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const db = useFirestore();

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      role: "admin",
    },
  });

  async function onSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true);
    
    try {
      // Use anonymous sign-in to bootstrap the prototype admin session
      const userCredential = await signInAnonymously(auth);
      const user = userCredential.user;

      if (user && db) {
        // Create or update the admin role document for this UID
        const adminDocRef = doc(db, 'roles_admin', user.uid);
        
        // Non-blocking write to register the role in Firestore
        setDocumentNonBlocking(adminDocRef, {
          email: values.email,
          role: values.role,
          createdAt: new Date().toISOString()
        }, { merge: true });

        toast({ 
          title: "Access Granted", 
          description: `Logged in as ${values.role === 'super_admin' ? 'Super Admin' : 'Staff Admin'}.` 
        });
        
        // Redirect to dashboard
        router.push('/admin/dashboard');
      }
    } catch (error) {
      toast({ 
        variant: "destructive", 
        title: "Login Failed", 
        description: "Could not initialize secure session. Please try again." 
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 bg-gray-50/50">
      <Card className="w-full max-w-md shadow-2xl border-2 rounded-[2rem] overflow-hidden">
        <CardHeader className="space-y-2 text-center pb-8 pt-10 bg-white">
          <div className="bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
            <Lock className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-4xl font-headline font-black tracking-tight text-primary">STAFF PORTAL</CardTitle>
          <CardDescription className="text-base font-medium">G&G Auto Enterprises Hub</CardDescription>
        </CardHeader>
        <CardContent className="p-8 bg-white">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Access Level</FormLabel>
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <Tabs 
                      defaultValue={field.value} 
                      onValueChange={(val) => field.onChange(val as 'admin' | 'super_admin')}
                      className="w-full"
                    >
                      <TabsList className="grid w-full grid-cols-2 h-12 rounded-xl bg-gray-100 p-1">
                        <TabsTrigger 
                          value="admin" 
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 font-bold"
                        >
                          <UserCog className="w-4 h-4" /> Admin
                        </TabsTrigger>
                        <TabsTrigger 
                          value="super_admin" 
                          className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm gap-2 font-bold"
                        >
                          <ShieldCheck className="w-4 h-4" /> Super
                        </TabsTrigger>
                      </TabsList>
                    </Tabs>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="staff@ggauto.com" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Secret Key</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" className="h-12 rounded-xl bg-gray-50 border-gray-200 focus:bg-white transition-colors" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform active:scale-[0.98]" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="animate-spin mr-3 w-6 h-6" />
                    Verifying...
                  </>
                ) : (
                  "Unlock Dashboard"
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
        <div className="bg-gray-50 p-4 text-center border-t">
          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-[0.2em]">Authorized Personnel Only</p>
        </div>
      </Card>
    </div>
  );
}