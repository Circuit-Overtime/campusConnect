import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import { Bookmark, Calendar, Clock, MapPin, Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/events/${event.id}`}>
            <Image
              src={event.image}
              alt={event.title}
              width={600}
              height={400}
              className="w-full h-48 object-cover"
              data-ai-hint="event cover"
            />
        </Link>
        <div className="absolute top-2 right-2">
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button size="icon" variant="secondary" className="rounded-full h-9 w-9 bg-background/70 backdrop-blur-sm">
                            <Bookmark className="h-4 w-4" />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Bookmark Event</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <div className="flex gap-2 mb-2">
          {event.tags.map((tag) => (
            <Badge key={tag} variant="secondary">{tag}</Badge>
          ))}
        </div>
        <CardTitle className="text-lg font-semibold mb-2 leading-tight">
          <Link href={`/events/${event.id}`} className="hover:text-primary transition-colors">
            {event.title}
          </Link>
        </CardTitle>
        <div className="text-sm text-muted-foreground space-y-1.5">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{event.location}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-primary/90 hover:bg-primary">
            <Link href={`/events/${event.id}`}>
                <Plus className="mr-2 h-4 w-4" /> Register
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
