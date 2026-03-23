
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
import { Settings, Save, Loader2, Image as ImageIcon, Store, Mail, Phone, MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const settingsSchema = z.object({
  logo_url: z.string().url("Please enter a valid URL").or(z.literal("")),
  business_name: z.string().min(3),
  contact_phone: z.string().min(10),
  contact_email: z.string().email(),
  address: z.string().min(5),
  hero_image_url: z.string().url("Please enter a valid URL").or(z.literal("")),
  service_image_url: z.string().url("Please enter a valid URL").or(z.literal("")),
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
      hero_image_url: "",
      service_image_url: "",
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
        hero_image_url: settings.hero_image_url || "",
        service_image_url: settings.service_image_url || "",
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold font-headline flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" /> Site Settings
        </h1>
        <p className="text-muted-foreground">Manage your showroom's online identity and branding</p>
      </div>

      <div className="bg-white rounded-[2.5rem] shadow-xl border overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground">Fetching settings...</p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs defaultValue="showroom" className="w-full">
                <div className="bg-gray-50 border-b px-8 py-4">
                  <TabsList className="bg-transparent gap-8">
                    <TabsTrigger value="showroom" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold">Showroom</TabsTrigger>
                    <TabsTrigger value="branding" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold">Branding & Images</TabsTrigger>
                    <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold">Contact Details</TabsTrigger>
                  </TabsList>
                </div>

                <div className="p-8 md:p-12 space-y-10">
                  <TabsContent value="showroom" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b pb-4">
                        <Store className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-xl">General Information</h3>
                      </div>
                      <FormField
                        control={form.control}
                        name="business_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Showroom Display Name</FormLabel>
                            <FormControl><Input className="h-12 rounded-xl bg-gray-50 focus:bg-white" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Showroom Physical Address</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input className="h-12 rounded-xl bg-gray-50 focus:bg-white pl-10" {...field} />
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="branding" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="space-y-8">
                      <div className="flex items-center gap-2 border-b pb-4">
                        <ImageIcon className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-xl">Visual Assets</h3>
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="logo_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Showroom Logo URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <Input placeholder="https://..." className="h-12 rounded-xl bg-gray-50 focus:bg-white" {...field} />
                                {field.value && (
                                  <div className="w-12 h-12 border rounded-xl overflow-hidden shrink-0 bg-white flex items-center justify-center p-1 shadow-sm">
                                    <img src={field.value} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>Appears on the Navbar and Footer.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hero_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Hero Section Image URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <Input placeholder="https://..." className="h-12 rounded-xl bg-gray-50 focus:bg-white" {...field} />
                                {field.value && (
                                  <div className="w-20 h-12 border rounded-xl overflow-hidden shrink-0 bg-white shadow-sm">
                                    <img src={field.value} alt="Hero preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>Main image displayed on the homepage banner.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Maintenance Section Image URL</FormLabel>
                            <FormControl>
                              <div className="flex gap-4">
                                <Input placeholder="https://..." className="h-12 rounded-xl bg-gray-50 focus:bg-white" {...field} />
                                {field.value && (
                                  <div className="w-20 h-12 border rounded-xl overflow-hidden shrink-0 bg-white shadow-sm">
                                    <img src={field.value} alt="Service preview" className="w-full h-full object-cover" />
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>Image displayed next to the service booking section.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="contact" className="mt-0 space-y-8 animate-in fade-in slide-in-from-left-2 duration-300">
                    <div className="space-y-6">
                      <div className="flex items-center gap-2 border-b pb-4">
                        <Mail className="w-5 h-5 text-primary" />
                        <h3 className="font-bold text-xl">Public Contact Details</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="contact_email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-widest">Business Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <Input className="h-12 rounded-xl bg-gray-50 focus:bg-white pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="contact_phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-widest">Contact Phone</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                  <Input className="h-12 rounded-xl bg-gray-50 focus:bg-white pl-10" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform flex gap-3 mt-8">
                    <Save className="w-5 h-5" /> Save All Settings
                  </Button>
                </div>
              </Tabs>
            </form>
          </Form>
        )}
      </div>
    </div>
  );
}
