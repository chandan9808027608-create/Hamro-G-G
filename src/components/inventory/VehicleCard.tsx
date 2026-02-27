
import Link from 'next/link';
import { Calendar, Gauge, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';
import { CONTACT_INFO } from '@/lib/constants';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const isSold = vehicle.status === 'sold';
  
  return (
    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-none bg-white">
      <Link href={`/inventory/${vehicle.id}`} className="block relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={vehicle.image_urls[0]} 
            alt={vehicle.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
        
        {isSold && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive" className="text-xl px-6 py-2">SOLD</Badge>
          </div>
        )}
        
        {!isSold && (
          <div className="absolute top-2 left-2">
            <Badge className="bg-secondary text-white border-none">{vehicle.condition}</Badge>
          </div>
        )}
      </Link>

      <CardContent className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="font-headline font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
            {vehicle.title}
          </h3>
          <p className="text-primary font-bold text-lg">NPR {vehicle.price.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-secondary" />
            <span>{vehicle.year} Model</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-secondary" />
            <span>{vehicle.km_run.toLocaleString()} KM</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium pt-1">
          <CheckCircle2 className="w-4 h-4" />
          <span>G&G Quality Inspected</span>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Link 
          href={`/inventory/${vehicle.id}`}
          className="w-full text-center py-2 bg-primary text-white rounded-md font-medium hover:bg-primary/90 transition-colors text-sm"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
}
