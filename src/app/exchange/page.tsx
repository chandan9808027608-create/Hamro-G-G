
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, ArrowRight } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2),
  phone: z.string().min(10),
  old_bike: z.string().min(2, "Please enter your current bike model"),
  old_year: z.string().min(4),
  interested_in: z.string().min(2, "What bike are you looking for?"),
});

export default function ExchangePage() {
  const { toast } = useToast();
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", phone: "", old_bike: "", old_year: "", interested_in: "" },
  });

  function onSubmit(values: any) {
    console.log(values);
    setSubmitted(true);
    toast({ title: "Exchange Inquiry Received" });
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <h1 className="text-4xl font-bold">Inquiry Sent</h1>
        <p className="text-xl">Our team will call you to discuss the exchange value.</p>
        <Button asChild><a href="/">Home</a></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4">
        <div className="bg-secondary/10 p-4 rounded-full w-fit mx-auto mb-4">
          <RefreshCw className="w-10 h-10 text-secondary" />
        </div>
        <h1 className="text-4xl font-bold font-headline">Instant Exchange Facility</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Upgrade your ride in minutes. Bring your old two-wheeler and get a transparent valuation for a newer model.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="space-y-2">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto text-xl font-bold">1</div>
          <p className="font-bold">Bring Your Bike</p>
          <p className="text-sm text-muted-foreground">Visit our showroom with your current vehicle.</p>
        </div>
        <div className="space-y-2">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto text-xl font-bold">2</div>
          <p className="font-bold">Expert Valuation</p>
          <p className="text-sm text-muted-foreground">Our team performs a quick inspection and gives you the best price.</p>
        </div>
        <div className="space-y-2">
          <div className="bg-primary text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto text-xl font-bold">3</div>
          <p className="font-bold">Drive Away</p>
          <p className="text-sm text-muted-foreground">Pay the difference and drive away with your new ride.</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-xl mx-auto border">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField control={form.control} name="phone" render={({ field }) => (
                <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <div className="grid grid-cols-2 gap-4">
                <FormField control={form.control} name="old_bike" render={({ field }) => (
                  <FormItem><FormLabel>Current Bike</FormLabel><FormControl><Input placeholder="e.g. Pulsar 150" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="old_year" render={({ field }) => (
                  <FormItem><FormLabel>Year</FormLabel><FormControl><Input placeholder="2018" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
              </div>
              <FormField control={form.control} name="interested_in" render={({ field }) => (
                <FormItem><FormLabel>Interested In</FormLabel><FormControl><Input placeholder="e.g. MT-15 or Scooter" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
            </div>
            <Button type="submit" className="w-full bg-secondary h-12 text-lg font-bold">Check Exchange Value</Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
