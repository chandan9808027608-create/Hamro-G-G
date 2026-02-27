import { Wrench, ShieldCheck, RefreshCw, FileText, BadgeCheck, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CONTACT_INFO } from '@/lib/constants';

export default function ServicesPage() {
  const services = [
    {
      title: "Second Hand Sales",
      description: "Wide range of thoroughly inspected bikes and scooters across all budgets.",
      icon: <BadgeCheck className="w-10 h-10 text-primary" />,
    },
    {
      title: "Exchange Facility",
      description: "Upgrade your old two-wheeler with a better model at the best market rates.",
      icon: <RefreshCw className="w-10 h-10 text-primary" />,
    },
    {
      title: "Servicing & Repair",
      description: "Full-service mechanical workshop with expert mechanics for all brands.",
      icon: <Wrench className="w-10 h-10 text-primary" />,
    },
    {
      title: "Insurance Renewal",
      description: "Get your vehicle insurance renewed instantly at our showroom.",
      icon: <ShieldCheck className="w-10 h-10 text-primary" />,
    },
    {
      title: "Ownership Transfer",
      description: "We handle all the paperwork for legal and smooth ownership transfer.",
      icon: <FileText className="w-10 h-10 text-primary" />,
    },
    {
      title: "Free Appraisal",
      description: "Not sure how much your bike is worth? Get a free professional valuation.",
      icon: <Phone className="w-10 h-10 text-primary" />,
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <h1 className="font-headline font-bold text-4xl">Our Services</h1>
        <p className="text-lg text-muted-foreground">More than just a showroom. We are your one-stop destination for all two-wheeler needs in Kathmandu.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
          <div key={index} className="bg-white p-8 rounded-2xl shadow-sm border hover:shadow-md transition-shadow flex flex-col items-center text-center space-y-4">
            <div className="bg-primary/5 p-4 rounded-full mb-2">
              {service.icon}
            </div>
            <h3 className="font-headline font-bold text-xl">{service.title}</h3>
            <p className="text-muted-foreground leading-relaxed">{service.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-primary p-12 rounded-3xl text-white text-center space-y-6">
        <h2 className="font-headline font-bold text-3xl">Need Urgent Servicing?</h2>
        <p className="text-white/80 max-w-xl mx-auto">Call us to book a service slot or visit our Boudha workshop directly.</p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button size="lg" className="bg-secondary text-white hover:bg-secondary/90 font-bold" asChild>
            <a href={`tel:${CONTACT_INFO.phone}`}>Call: {CONTACT_INFO.phone}</a>
          </Button>
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary" asChild>
            <Link href="/contact">Get Directions</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
