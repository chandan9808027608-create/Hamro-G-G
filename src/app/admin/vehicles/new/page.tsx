
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
import { collection, serverTimestamp } from 'firebase/firestore';

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
      toast({ variant: "destructive", title: "Missing Info", description: "Please enter brand and model first." });
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
      form.setValue('description', result.description);
      toast({ title: "Description Generated", description: "AI has created a detailed listing for you." });
    } catch (err) {
      toast({ variant: "destructive", title: "AI Error", description: "Failed to generate description." });
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
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => router.back()}><ChevronLeft className="w-4 h-4" /> Back</Button>
        <h1 className="text-3xl font-bold font-headline">Add New Vehicle</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Listing Title</FormLabel>
                    <FormControl><Input placeholder="e.g. Pristine Honda Dio BS6 2022" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <div className="flex gap-2">
                        <Input placeholder="https://images.unsplash.com/..." {...field} />
                        <div className="w-10 h-10 border rounded flex items-center justify-center shrink-0">
                          <ImageIcon className="text-muted-foreground w-5 h-5" />
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>Link to an image of the vehicle (Unsplash or similar).</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="brand"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Brand</FormLabel>
                    <FormControl><Input placeholder="Yamaha" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model</FormLabel>
                    <FormControl><Input placeholder="MT-15" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
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
                    <FormLabel>Condition</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger><SelectValue placeholder="Select condition" /></SelectTrigger>
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
                    <FormLabel>Year</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kmRun"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>KM Run</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem className="col-span-full">
                    <FormLabel>Price (NPR)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-full space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <FormLabel>Vehicle Description</FormLabel>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm" 
                    className="gap-2 text-primary border-primary"
                    onClick={handleGenerateAI}
                    disabled={generating}
                  >
                    {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    Generate AI Description
                  </Button>
                </div>
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl><Textarea className="min-h-[200px]" {...field} /></FormControl>
                      <FormMessage />
                      <FormDescription>Craft a persuasive description highlighting features and maintenance history.</FormDescription>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-6 border-t">
              <Button type="submit" className="w-full bg-primary h-12 text-lg font-bold gap-2">
                <Save className="w-5 h-5" /> Save Vehicle to Inventory
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
