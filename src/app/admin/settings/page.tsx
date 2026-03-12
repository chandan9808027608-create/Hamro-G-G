
"use client"

import { useFirestore, useDoc, useMemoFirebase, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Settings, Save, Loader2, Image as ImageIcon, Store } from 'lucide-react';
import { useEffect } from 'react';

const settingsSchema = z.object({
  logo_url: z.string().url("Please enter a valid URL"),
  business_name: z.string().min(3),
  contact_phone: z.string().min(10),
  contact_email: z.string().email(),
  address: z.string().min(5),
});

export default function SettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  
  const settingsRef = useMemoFirebase(() => {
    if (!db) return null;
    return doc(db, 'settings', 'general');
  }, [db]);

  const { data: settings, isLoading } = useDoc(settingsRef);

  const form = useForm<z.infer<typeof settingsSchema>>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      logo_url: "",
      business_name: "",
      contact_phone: "",
      contact_email: "",
      address: "",
    },
  });

  useEffect(() => {
    if (settings) {
      form.reset({
        logo_url: settings.logo_url || "",
        business_name: settings.business_name || "Hamro G&G Auto Enterprises",
        contact_phone: settings.contact_phone || "9860087161",
        contact_email: settings.contact_email || "info@ggautonp.com",
        address: settings.address || "Nayabasti, Boudha",
      });
    }
  }, [settings, form]);

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    if (!db) return;
    const docRef = doc(db, 'settings', 'general');
    setDocumentNonBlocking(docRef, values, { merge: true });
    toast({ title: "Settings Saved", description: "Global site configurations updated." });
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> Site Settings
        </h1>
        <p className="text-muted-foreground">Customize global branding and contact information</p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl border overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching settings...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <ImageIcon className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-xl">Branding</h3>
                </div>
                <FormField
                  control={form.control}
                  name="logo_url"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest">Logo URL</FormLabel>
                      <FormControl>
                        <div className="flex gap-4">
                          <Input placeholder="https://..." className="h-12 rounded-xl" {...field} />
                          {field.value && (
                            <div className="w-12 h-12 border rounded-xl overflow-hidden shrink-0 bg-gray-50 flex items-center justify-center p-1">
                              <img src={field.value} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>Link to your showroom logo (PNG or SVG recommended).</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="business_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-bold uppercase tracking-widest">Display Name</FormLabel>
                      <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-2 border-b pb-4">
                  <Store className="w-5 h-5 text-primary" />
                  <h3 className="font-bold text-xl">Showroom Info</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="contact_phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest">Contact Phone</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="contact_email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-widest">Public Email</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-full">
                        <FormLabel className="text-xs font-bold uppercase tracking-widest">Showroom Address</FormLabel>
                        <FormControl><Input className="h-12 rounded-xl" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform flex gap-3">
                <Save className="w-5 h-5" /> Save Global Changes
              </Button>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
