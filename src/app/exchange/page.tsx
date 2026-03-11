
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Camera, CheckCircle2, Loader2, Image as ImageIcon, Plus, X } from 'lucide-react';
import { useFirestore, addDocumentNonBlocking } from '@/firebase';
import { collection } from 'firebase/firestore';

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  old_bike: z.string().min(2, "Please enter your current bike model"),
  old_year: z.string().min(4, "Enter manufacturing year"),
  interested_in: z.string().min(2, "What bike are you looking for?"),
  image_url: z.string().url("Please enter a valid image URL").optional().or(z.literal("")),
});

export default function ExchangePage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const db = useFirestore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
      name: "", 
      phone: "", 
      old_bike: "", 
      old_year: "", 
      interested_in: "",
      image_url: ""
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (!db) return;
    setLoading(true);

    const inquiryData = {
      type: 'exchange',
      name: values.name,
      phone: values.phone,
      message: `Exchange Inquiry: ${values.old_bike} (${values.old_year}) for ${values.interested_in}. Photo provided: ${values.image_url || 'None'}`,
      created_at: new Date().toISOString(),
      status: 'new',
      // Store specific exchange details for admin
      sellExchangeVehicleBrand: values.old_bike.split(' ')[0] || values.old_bike,
      sellExchangeVehicleModel: values.old_bike,
      sellExchangeVehicleYear: parseInt(values.old_year) || 0,
    };

    const inquiriesRef = collection(db, 'inquiries');
    addDocumentNonBlocking(inquiriesRef, inquiryData);

    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      toast({ 
        title: "Exchange Request Sent", 
        description: "We'll review your bike details and call you with an offer." 
      });
    }, 800);
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-24 text-center space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle2 className="w-14 h-14 text-green-600" />
        </div>
        <div className="space-y-4">
          <h1 className="font-headline font-bold text-5xl text-foreground tracking-tight">Request Received!</h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Thank you. Our valuation expert will review your bike details and contact you shortly to discuss the best exchange price.
          </p>
        </div>
        <Button size="lg" className="h-14 px-10 text-lg font-bold rounded-2xl" asChild>
          <a href="/">Back to Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-16">
      <div className="text-center space-y-4">
        <div className="bg-secondary/10 p-4 rounded-full w-fit mx-auto mb-4">
          <RefreshCw className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold font-headline tracking-tight text-gradient">Instant Exchange Facility</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          Upgrade your ride in minutes. Provide your bike details and photos for a transparent, professional valuation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { step: "1", title: "Share Details", desc: "Fill the form with your current bike info and photos." },
          { step: "2", title: "Get Price", desc: "Our team provides an estimated exchange value online." },
          { step: "3", title: "Drive Away", desc: "Visit us, finalize the deal, and drive away with a new ride." }
        ].map((item, i) => (
          <div key={i} className="bg-white p-8 rounded-[2rem] border shadow-sm text-center space-y-4 hover:border-primary/20 transition-all group">
            <div className="bg-primary text-white w-12 h-12 rounded-2xl flex items-center justify-center mx-auto text-2xl font-black group-hover:rotate-6 transition-transform">
              {item.step}
            </div>
            <h3 className="font-bold text-xl">{item.title}</h3>
            <p className="text-muted-foreground">{item.desc}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] shadow-2xl max-w-4xl mx-auto border-4 border-gray-50 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl" />
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4">Personal Info</h3>
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="phone" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone Number</FormLabel>
                    <FormControl><Input placeholder="98XXXXXXXX" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="space-y-6">
                <h3 className="text-2xl font-bold font-headline border-l-4 border-primary pl-4">Vehicle Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <FormField control={form.control} name="old_bike" render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current Bike</FormLabel>
                      <FormControl><Input placeholder="e.g. Pulsar 150" className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                  <FormField control={form.control} name="old_year" render={({ field }) => (
                    <FormItem className="col-span-2 sm:col-span-1">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Year</FormLabel>
                      <FormControl><Input placeholder="2018" className="h-12 rounded-xl" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>
                <FormField control={form.control} name="interested_in" render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Interested In</FormLabel>
                    <FormControl><Input placeholder="e.g. Yamaha MT-15 or Scooter" className="h-12 rounded-xl" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <div className="col-span-full space-y-6 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold font-headline flex items-center gap-3">
                    <Camera className="w-6 h-6 text-primary" /> Vehicle Photos
                  </h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField control={form.control} name="image_url" render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Photo URL (Front/Side view)</FormLabel>
                      <FormControl>
                        <div className="flex gap-3">
                          <Input placeholder="https://images.unsplash.com/..." className="h-12 rounded-xl" {...field} />
                          <div className="w-12 h-12 bg-gray-50 border rounded-xl flex items-center justify-center shrink-0">
                            <ImageIcon className="text-muted-foreground w-6 h-6" />
                          </div>
                        </div>
                      </FormControl>
                      <FormDescription>Link to an image of your bike for evaluation.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )} />
                </div>

                {form.watch('image_url') && (
                  <div className="mt-4 animate-in fade-in slide-in-from-bottom-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Preview:</p>
                    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border-2 border-primary/10 shadow-lg">
                      <img 
                        src={form.watch('image_url')} 
                        alt="Vehicle Preview" 
                        className="w-full h-full object-cover"
                        onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Invalid+Image+URL')}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full h-16 bg-primary text-xl font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.01] transition-transform"
            >
              {loading ? <Loader2 className="animate-spin w-6 h-6" /> : "Request Exchange Valuation"}
            </Button>
            
            <p className="text-center text-[10px] text-muted-foreground mt-4 uppercase tracking-widest font-bold">
              Trusted by 10,000+ Riders in Kathmandu
            </p>
          </form>
        </Form>
      </div>
    </div>
  );
}
