import Link from 'next/link';
import { Calendar, Gauge, CheckCircle2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Vehicle } from '@/types/vehicle';

interface VehicleCardProps {
  vehicle: Vehicle;
}

export function VehicleCard({ vehicle }: VehicleCardProps) {
  const isSold = vehicle.status === 'sold';
  
  return (
    <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-500 border-none bg-white rounded-3xl">
      <Link href={`/inventory/${vehicle.id}`} className="block relative">
        <div className="aspect-[4/3] overflow-hidden">
          <img 
            src={vehicle.image_urls[0]} 
            alt={vehicle.title} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {isSold && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center">
            <Badge variant="destructive" className="text-xl px-8 py-2 rounded-full font-bold">SOLD</Badge>
          </div>
        )}
        
        {!isSold && (
          <div className="absolute top-4 left-4">
            <Badge className="bg-white/90 backdrop-blur-md text-primary hover:bg-white border-none shadow-sm font-bold rounded-full px-4">
              {vehicle.condition}
            </Badge>
          </div>
        )}

        <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          <div className="bg-primary text-white p-3 rounded-full shadow-xl">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </Link>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-1">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-headline font-bold text-xl line-clamp-1 hover:text-primary transition-colors cursor-pointer">
              {vehicle.title}
            </h3>
          </div>
          <p className="text-2xl font-bold text-primary">NPR {vehicle.price.toLocaleString()}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 p-2 rounded-xl">
            <Calendar className="w-4 h-4 text-primary/60" />
            <span className="font-medium text-foreground">{vehicle.year}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-gray-50 p-2 rounded-xl">
            <Gauge className="w-4 h-4 text-primary/60" />
            <span className="font-medium text-foreground">{vehicle.km_run.toLocaleString()} KM</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-green-600 font-bold bg-green-50/50 p-2 rounded-lg border border-green-100/50">
          <CheckCircle2 className="w-4 h-4" />
          <span>INSPECTED & VERIFIED</span>
        </div>
      </CardContent>
    </Card>
  );
}