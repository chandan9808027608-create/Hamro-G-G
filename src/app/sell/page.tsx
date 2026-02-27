
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Bike, CheckCircle2 } from 'lucide-react';

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

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setSubmitted(true);
    toast({
      title: "Inquiry Submitted",
      description: "We've received your bike details. Our team will contact you soon.",
    });
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-12 h-12 text-green-600" />
        </div>
        <h1 className="font-headline font-bold text-4xl">Thank You!</h1>
        <p className="text-xl text-muted-foreground">Your inquiry has been successfully submitted. One of our valuation experts will call you shortly.</p>
        <Button size="lg" asChild>
          <a href="/">Return Home</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="bg-secondary/10 p-3 rounded-xl w-fit">
            <Bike className="w-8 h-8 text-secondary" />
          </div>
          <h1 className="font-headline font-bold text-4xl">Sell Your Two-Wheeler</h1>
          <p className="text-lg text-muted-foreground">Get the best market price for your bike or scooter. Fill out the form and we'll get back to you with a valuation.</p>
          
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-primary rounded-full p-1"><CheckCircle2 className="w-4 h-4 text-white" /></div>
              <div>
                <p className="font-bold">Instant Cash</p>
                <p className="text-sm text-muted-foreground">Fast payment upon ownership transfer.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-primary rounded-full p-1"><CheckCircle2 className="w-4 h-4 text-white" /></div>
              <div>
                <p className="font-bold">Hassle-Free Documentation</p>
                <p className="text-sm text-muted-foreground">We handle all the paperwork for you.</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-1 bg-primary rounded-full p-1"><CheckCircle2 className="w-4 h-4 text-white" /></div>
              <div>
                <p className="font-bold">Best Valuation</p>
                <p className="text-sm text-muted-foreground">Transparent pricing based on market condition.</p>
              </div>
            </li>
          </ul>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl border">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Full Name</FormLabel>
                      <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl><Input placeholder="98XXXXXXXX" {...field} /></FormControl>
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
                      <FormControl><Input placeholder="Honda, TVS, etc." {...field} /></FormControl>
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
                      <FormControl><Input placeholder="Dio, Pulsar, etc." {...field} /></FormControl>
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
                      <FormControl><Input placeholder="2020" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="km_run"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>KM Run</FormLabel>
                      <FormControl><Input placeholder="15000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="expected_price"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Expected Price (NPR)</FormLabel>
                      <FormControl><Input placeholder="150000" {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Additional Details</FormLabel>
                      <FormControl><Textarea placeholder="Any extra info about condition or modifications..." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90 text-lg font-bold h-12">Submit Inquiry</Button>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
