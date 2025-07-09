"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { database } from "@/lib/firebase";
import { ref, onValue, set, remove } from "firebase/database";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";

import type { Event, User } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Share2, Plus, UserX } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Attendee = Pick<User, 'id' | 'name' | 'avatar'>;

export default function EventDetailPage() {
    const params = useParams();
    const router = useRouter();
    const eventId = params.id as string;
    
    const { user } = useAuth();
    const { toast } = useToast();

    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<Attendee[]>([]);
    const [loading, setLoading] = useState(true);

    const isRegistered = user && event?.attendees && event.attendees[user.uid];

    useEffect(() => {
        if (!eventId) return;

        const eventRef = ref(database, `events/${eventId}`);
        const unsubscribe = onValue(eventRef, (snapshot) => {
            if (snapshot.exists()) {
                const eventData = snapshot.val() as Event;
                setEvent({ ...eventData, id: eventId });

                if (eventData.attendees) {
                    const attendeeIds = Object.keys(eventData.attendees);
                    const attendeePromises = attendeeIds.map(uid => {
                        return new Promise<Attendee | null>((resolve) => {
                            const userRef = ref(database, `users/${uid}`);
                            onValue(userRef, (userSnap) => {
                                if (userSnap.exists()) {
                                    resolve({ id: uid, ...userSnap.val() });
                                } else {
                                    resolve(null);
                                }
                            }, { onlyOnce: true });
                        });
                    });

                    Promise.all(attendeePromises).then(results => {
                        setAttendees(results.filter(a => a !== null) as Attendee[]);
                    });
                } else {
                    setAttendees([]);
                }
            } else {
                setEvent(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, [eventId]);

    const handleRegister = async () => {
        if (!user) {
          router.push(`/login?redirect=/events/${event?.id}`);
          return;
        }
        if (!event) return;
    
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

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardHeader className="p-0"><Skeleton className="h-64 w-full" /></CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <Skeleton className="h-6 w-full" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-12 w-full" />
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!event) {
        return <div className="text-center py-10">Event not found.</div>;
    }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <Image
            src={event.image}
            alt={event.title}
            width={1200}
            height={400}
            className="w-full h-auto object-cover max-h-80"
            data-ai-hint="tech conference"
          />
        </CardHeader>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {event.tags.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">{event.title}</h1>

          <div className="grid md:grid-cols-2 gap-x-8 gap-y-4 text-muted-foreground mb-6">
            <div className="flex items-center"><Calendar className="h-5 w-5 mr-3 text-primary" /> <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
            <div className="flex items-center"><Clock className="h-5 w-5 mr-3 text-primary" /> <span>{event.time}</span></div>
            <div className="flex items-center col-span-2"><MapPin className="h-5 w-5 mr-3 text-primary" /> <span>{event.location}</span></div>
          </div>
          
          <div className="prose dark:prose-invert max-w-none mb-8">
            <p>{event.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" className="flex-1" onClick={handleRegister} variant={isRegistered ? "secondary" : "default"}>
                {isRegistered ? <><UserX className="mr-2 h-5 w-5"/> Un-RSVP</> : <><Plus className="mr-2 h-5 w-5"/>Register Now</>}
            </Button>
            <Button size="lg" variant="outline" className="flex-1"><Share2 className="mr-2 h-5 w-5"/>Share Event</Button>
          </div>

          <hr className="my-8" />

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Organized by</h3>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="https://placehold.co/40x40.png" data-ai-hint="logo"/>
                  <AvatarFallback>GDG</AvatarFallback>
                </Avatar>
                <span className="font-medium">{event.organizer}</span>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-3">Attendees ({attendees.length}{event.capacity ? `/${event.capacity}` : ''})</h3>
              {attendees.length > 0 ? (
                <div className="flex items-center -space-x-2">
                    {attendees.slice(0, 10).map(a => (
                    <Avatar key={a.id}>
                        <AvatarImage src={a.avatar} data-ai-hint="person face"/>
                        <AvatarFallback>{a.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    ))}
                    {attendees.length > 10 &&
                        <Avatar>
                            <AvatarFallback>+{attendees.length - 10}</AvatarFallback>
                        </Avatar>
                    }
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Be the first to register!</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
