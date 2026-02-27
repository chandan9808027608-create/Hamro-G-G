
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Bike, CheckCircle2, Camera, Upload, X, Image as ImageIcon } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  brand: z.string().min(1, { message: "Brand is required." }),
  model: z.string().min(1, { message: "Model is required." }),
  year: z.string().min(4, { message: "Year is required." }),
  km_run: z.string().min(1, { message: "Mileage is required." }),
  expected_price: z.string().min(1, { message: "Please specify your expected price." }),
  message: z.string().optional(),
});

export default function SellPage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [previews, setPreviews] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      brand: "",
      model: "",
      year: "",
      km_run: "",
      expected_price: "",
      message: "",
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPreviews: string[] = [];
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviews(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log({ ...values, images: previews });
    setSubmitted(true);
    toast({
      title: "Inquiry Submitted",
      description: "We've received your bike details and photos. Our team will contact you soon.",
    });
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="font-headline font-bold text-4xl">Inquiry Sent!</h1>
        <p className="text-xl text-muted-foreground">Thank you for sharing your bike details. One of our experts will review the photos and call you with an estimated price shortly.</p>
        <Button size="lg" asChild className="rounded-full px-10">
          <a href="/">Return Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Content */}
        <div className="lg:col-span-5 space-y-8">
          <div className="space-y-6">
            <div className="bg-primary/10 p-4 rounded-3xl w-fit">
              <Camera className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-headline font-bold text-5xl leading-tight">Sell Your Bike <br /><span className="text-primary">Online</span></h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Skip the showroom visits. Send us 3-4 clear photos of your bike, and we'll give you a professional price evaluation within 30 minutes.
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm">
              <div className="bg-green-100 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <p className="font-bold">Instant Online Valuation</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm">
              <div className="bg-green-100 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <p className="font-bold">Free Doorstep Inspection</p>
            </div>
            <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border shadow-sm">
              <div className="bg-green-100 p-2 rounded-full"><CheckCircle2 className="w-5 h-5 text-green-600" /></div>
              <p className="font-bold">Immediate Payment</p>
            </div>
          </div>

          <div className="bg-secondary p-8 rounded-[2.5rem] text-white space-y-4 shadow-xl">
            <p className="font-bold text-xl">Photography Tips</p>
            <ul className="space-y-2 text-sm text-white/70">
              <li>• Take photos in daylight</li>
              <li>• Capture both side profiles</li>
              <li>• Include a clear photo of the odometer</li>
              <li>• Show any visible scratches or dents</li>
            </ul>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:col-span-7">
          <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-gray-100">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold font-headline">Vehicle Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                          <FormControl><Input placeholder="Your Name" className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                          <FormControl><Input placeholder="98XXXXXXXX" className="h-12 rounded-xl" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="e.g. Honda" className="h-12 rounded-xl" {...field} /></FormControl>
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
                          <FormControl><Input placeholder="e.g. Dio BS6" className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="year"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Model Year</FormLabel>
                          <FormControl><Input placeholder="2022" className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="km_run"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total KM Run</FormLabel>
                          <FormControl><Input placeholder="12000" className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expected_price"
                      render={({ field }) => (
                        <FormItem className="col-span-full">
                          <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Expected Price (NPR)</FormLabel>
                          <FormControl><Input placeholder="e.g. 185000" className="h-12 rounded-xl" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Photo Upload Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold font-headline">Upload Photos</h3>
                    <span className="text-xs text-muted-foreground italic">Required for online evaluation</span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {previews.map((src, index) => (
                      <div key={index} className="relative aspect-square rounded-2xl overflow-hidden group border shadow-sm">
                        <img src={src} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                    
                    {previews.length < 6 && (
                      <label className="aspect-square flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-2xl hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                        <Upload className="w-6 h-6 text-muted-foreground" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Add Photo</span>
                        <input 
                          type="file" 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                          onChange={handleImageChange}
                        />
                      </label>
                    )}
                  </div>
                  {previews.length === 0 && (
                    <div className="p-10 border-2 border-dashed border-gray-100 rounded-[2rem] flex flex-col items-center text-center space-y-2 bg-gray-50/50">
                      <ImageIcon className="w-10 h-10 text-gray-300" />
                      <p className="text-sm text-muted-foreground">Upload at least 3 photos for an accurate price evaluation.</p>
                    </div>
                  )}
                </div>

                <div className="pt-4">
                  <Button type="submit" className="w-full h-14 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                    Request Online Price Evaluation
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">
                    Safe • Secure • No Obligation
                  </p>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
