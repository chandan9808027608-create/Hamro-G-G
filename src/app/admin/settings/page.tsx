
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
import { Settings, Save, Loader2, Image as ImageIcon, Store, Mail, Phone, MapPin, Upload, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const settingsSchema = z.object({
  logo_url: z.string().min(1, "Logo is required"),
  business_name: z.string().min(3),
  contact_phone: z.string().min(10),
  contact_email: z.string().email(),
  address: z.string().min(5),
  hero_image_url: z.string().min(1, "Hero image is required"),
  service_image_url: z.string().min(1, "Service image is required"),
});

export default function SettingsPage() {
  const db = useFirestore();
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: keyof z.infer<typeof settingsSchema>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Limit file size for Firestore (keeping it under 500KB for safety in Base64)
    if (file.size > 500 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please upload an image smaller than 500KB for optimal performance."
      });
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      form.setValue(fieldName, base64, { shouldValidate: true });
      toast({ title: "Image Uploaded", description: "Image converted and ready to save." });
    } catch (err) {
      toast({ variant: "destructive", title: "Upload Failed", description: "Could not process the image file." });
    }
  };

  function onSubmit(values: z.infer<typeof settingsSchema>) {
    if (!db) return;
    setIsSaving(true);
    const docRef = doc(db, 'settings', 'general');
    
    // We use a small timeout to simulate processing since setDocumentNonBlocking is instantaneous
    setDocumentNonBlocking(docRef, values, { merge: true });
    
    setTimeout(() => {
      setIsSaving(false);
      toast({ title: "Settings Saved", description: "Global site configurations updated successfully." });
    }, 500);
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
                    <TabsTrigger value="contact" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold">Contact & Gmail</TabsTrigger>
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
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Showroom Logo</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                  <div className="flex-1">
                                    <Input placeholder="URL or Base64" className="h-12 rounded-xl bg-gray-50 focus:bg-white text-xs" {...field} />
                                  </div>
                                  <label className="h-12 px-6 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors gap-2 text-sm font-bold">
                                    <Upload className="w-4 h-4" /> Upload JPEG
                                    <input type="file" className="hidden" accept="image/jpeg,image/png,image/svg+xml" onChange={(e) => handleFileUpload(e, 'logo_url')} />
                                  </label>
                                </div>
                                {field.value && (
                                  <div className="relative w-24 h-24 border-2 border-primary/10 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-2 group">
                                    <img src={field.value} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                    <button type="button" onClick={() => field.onChange("")} className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>Recommended: Square logo with white or transparent background.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="hero_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Hero Section Image</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                  <div className="flex-1">
                                    <Input placeholder="URL or Base64" className="h-12 rounded-xl bg-gray-50 focus:bg-white text-xs" {...field} />
                                  </div>
                                  <label className="h-12 px-6 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors gap-2 text-sm font-bold">
                                    <Upload className="w-4 h-4" /> Upload
                                    <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={(e) => handleFileUpload(e, 'hero_image_url')} />
                                  </label>
                                </div>
                                {field.value && (
                                  <div className="relative w-full aspect-[21/9] border-2 border-primary/10 rounded-2xl overflow-hidden bg-gray-50 group">
                                    <img src={field.value} alt="Hero preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => field.onChange("")} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>Main banner image on the homepage.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="service_image_url"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-widest">Maintenance Section Image</FormLabel>
                            <FormControl>
                              <div className="space-y-4">
                                <div className="flex gap-4 items-center">
                                  <div className="flex-1">
                                    <Input placeholder="URL or Base64" className="h-12 rounded-xl bg-gray-50 focus:bg-white text-xs" {...field} />
                                  </div>
                                  <label className="h-12 px-6 rounded-xl border-2 border-dashed border-primary/20 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-colors gap-2 text-sm font-bold">
                                    <Upload className="w-4 h-4" /> Upload
                                    <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={(e) => handleFileUpload(e, 'service_image_url')} />
                                  </label>
                                </div>
                                {field.value && (
                                  <div className="relative w-full aspect-video border-2 border-primary/10 rounded-2xl overflow-hidden bg-gray-50 group max-w-sm">
                                    <img src={field.value} alt="Service preview" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => field.onChange("")} className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </FormControl>
                            <FormDescription>Image shown next to the service booking section.</FormDescription>
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
                              <FormLabel className="text-xs font-bold uppercase tracking-widest">Business Gmail / Email</FormLabel>
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

                  <Button type="submit" disabled={isSaving} className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform flex gap-3 mt-8">
                    {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Save className="w-5 h-5" />}
                    {isSaving ? "Saving Configuration..." : "Save All Settings"}
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
