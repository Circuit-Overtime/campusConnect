"use client";

import { useState, useEffect } from "react";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react";
import EventCard from "@/components/event-card";
import type { Event } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsPage() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const eventsRef = ref(database, 'events');
        const unsubscribe = onValue(eventsRef, (snapshot) => {
            const eventsData = snapshot.val();
            if (eventsData) {
                const eventsList = Object.values(eventsData) as Event[];
                setEvents(eventsList);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Campus Events</h1>
                <p className="mt-2 text-lg text-muted-foreground">Discover what's happening on campus. Never miss out.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search events..." className="pl-9 w-full" />
                </div>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full sm:w-auto justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            Filter by Date
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" />
                    </PopoverContent>
                </Popover>
                <Button variant="outline" className="w-full sm:w-auto">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter by Tag
                </Button>
            </div>

            {loading ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-96 w-full" />)}
                </div>
            ) : (
                 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            )}
        </div>
    );
}
