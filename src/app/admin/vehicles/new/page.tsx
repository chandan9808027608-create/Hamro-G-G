"use client"

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Sparkles, Save, ChevronLeft, Loader2, Image as ImageIcon } from 'lucide-react';
import { generateVehicleDescription } from '@/ai/flows/generate-vehicle-description';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

const formSchema = z.object({
  title: z.string().min(5),
  brand: z.string().min(1),
  model: z.string().min(1),
  type: z.enum(['bike', 'scooter']),
  year: z.coerce.number().min(1990),
  kmRun: z.coerce.number().min(0),
  price: z.coerce.number().min(1),
  condition: z.string().min(1),
  description: z.string().min(10),
  imageUrl: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

export default function AddVehiclePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const db = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "", brand: "", model: "", type: "bike", year: 2022, kmRun: 0, price: 0, condition: "Excellent", description: "", imageUrl: ""
    },
  });

  async function handleGenerateAI() {
    const values = form.getValues();
    if (!values.brand || !values.model) {
      toast({ 
        variant: "destructive", 
        title: "Missing Info", 
        description: "Please enter at least the brand and model to generate a description." 
      });
      return;
    }

    setGenerating(true);
    try {
      const result = await generateVehicleDescription({
        brand: values.brand,
        model: values.model,
        type: values.type,
        year: values.year,
        kmRun: values.kmRun,
        condition: values.condition,
        price: values.price
      });
      
      if (result && result.description) {
        form.setValue('description', result.description);
        toast({ title: "Success", description: "AI description generated successfully!" });
      } else {
        throw new Error("Invalid AI response");
      }
    } catch (err: any) {
      toast({ 
        variant: "destructive", 
        title: "AI Generation Failed", 
        description: err.message || "Something went wrong while generating the description." 
      });
    } finally {
      setGenerating(false);
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!db) return;
    
    const vehiclesRef = collection(db, 'vehicles');
    const vehicleData = {
      title: values.title,
      brand: values.brand,
      model: values.model,
      type: values.type,
      year: values.year,
      km_run: values.kmRun,
      price: values.price,
      condition: values.condition,
      description: values.description,
      image_urls: values.imageUrl ? [values.imageUrl] : ['https://picsum.photos/seed/vehicle/600/400'],
      status: 'available',
      created_at: new Date().toISOString(),
      featured: false
    };

    addDocumentNonBlocking(vehiclesRef, vehicleData);
    toast({ title: "Vehicle Added", description: "Successfully added to inventory." });
    router.push('/admin/dashboard');
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ChevronLeft className="w-4 h-4" /> Back</Button>
        <h1 className="text-3xl font-bold font-headline">Add New Vehicle</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-8 rounded-[2rem] shadow-xl border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Listing Title</FormLabel>
                    <FormControl><Input placeholder="e.g. Pristine Honda Dio BS6 2022" className="h-12 rounded-xl shadow-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://images.unsplash.com/..." className="h-12 rounded-xl shadow-sm" {...field} />
                        <div className="w-12 h-12 border rounded-xl flex items-center justify-center shrink-0 bg-gray-50">
                          <ImageIcon className="text-muted-foreground w-5 h-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Link to an image of the vehicle.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Brand</FormLabel>
                    <FormControl><Input placeholder="Yamaha" className="h-12 rounded-xl shadow-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Model</FormLabel>
                    <FormControl><Input placeholder="MT-15" className="h-12 rounded-xl shadow-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl shadow-sm"><SelectValue placeholder="Select type" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="bike">Bike</SelectItem>
                        <SelectItem value="scooter">Scooter</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="condition"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-12 rounded-xl shadow-sm"><SelectValue placeholder="Select condition" /></SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Excellent">Excellent</SelectItem>
                        <SelectItem value="Good">Good</SelectItem>
                        <SelectItem value="Fair">Fair</SelectItem>
                        <SelectItem value="Like New">Like New</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Year</FormLabel>
                    <FormControl><Input type="number" className="h-12 rounded-xl shadow-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kmRun"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">KM Run</FormLabel>
                    <FormControl><Input type="number" className="h-12 rounded-xl shadow-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Price (NPR)</FormLabel>
                    <FormControl><Input type="number" className="h-12 rounded-xl shadow-sm" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-full space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vehicle Description</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-primary border-primary hover:bg-primary/5 rounded-full px-4"
                    onClick={handleGenerateAI}
                    disabled={generating}
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {generating ? "AI Working..." : "Generate AI Description"}
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl><Textarea className="min-h-[200px] rounded-2xl shadow-sm" placeholder="Tell us more about this vehicle..." {...field} /></FormControl>
                      <FormMessage />
                      <FormDescription>Craft a persuasive description or use our AI assistant.</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform flex items-center justify-center gap-3">
                <Save className="w-5 h-5" /> Save Vehicle to Inventory
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
