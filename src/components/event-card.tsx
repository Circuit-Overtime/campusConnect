"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, set, remove } from "firebase/database";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Event } from "@/lib/types";
import { Bookmark, Calendar, Clock, MapPin, Plus, UserX } from "lucide-react";
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
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const isRegistered = user && event.attendees && event.attendees[user.uid];

  const handleRegister = async () => {
    if (!user) {
      router.push(`/login?redirect=/events/${event.id}`);
      return;
    }

    const eventAttendeeRef = ref(database, `events/${event.id}/attendees/${user.uid}`);
    
    try {
      if (isRegistered) {
        await remove(eventAttendeeRef);
        toast({ title: "Un-RSVP'd", description: `You are no longer registered for ${event.title}.` });
      } else {
        await set(eventAttendeeRef, true);
        toast({ title: "Registered!", description: `You have successfully registered for ${event.title}.` });
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/events/${event.id}`}>
            <Image
              src={event.image || "https://placehold.co/600x400.png"}
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
        <div className="flex flex-wrap gap-2 mb-2">
          {event.tags && event.tags.map((tag) => (
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
            <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
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
        <Button onClick={handleRegister} className="w-full" variant={isRegistered ? "secondary" : "default"}>
          {isRegistered ? <><UserX className="mr-2 h-4 w-4" /> Un-RSVP</> : <><Plus className="mr-2 h-4 w-4" /> Register</>}
        </Button>
      </CardFooter>
    </Card>
  );
}
