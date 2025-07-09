
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { push, ref, set, serverTimestamp } from "firebase/database";
import type { Event } from "@/lib/types";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";

export default function CreateEventPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [date, setDate] = useState<Date | undefined>();
    const [time, setTime] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState("");
    const [tags, setTags] = useState("");
    const [capacity, setCapacity] = useState<number | undefined>();

    const [isSubmitting, setIsSubmitting] = useState(false);

    if (!authLoading && !user) {
        router.push("/login?redirect=/events/create");
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            toast({ title: "Not Authenticated", description: "You must be logged in to create an event.", variant: "destructive" });
            return;
        }

        if (!title || !date || !time || !location || !description) {
            toast({ title: "Missing Fields", description: "Please fill out all required fields.", variant: "destructive" });
            return;
        }

        setIsSubmitting(true);

        try {
            const eventsRef = ref(database, 'events');
            const newEventRef = push(eventsRef);
            const newEventId = newEventRef.key;

            if (!newEventId) throw new Error("Could not generate event ID.");

            const newEventData: Omit<Event, 'id'> = {
                title,
                description,
                date: format(date, "yyyy-MM-dd"),
                time,
                location,
                image: image || "https://placehold.co/600x400.png",
                tags: tags.split(',').map(tag => tag.trim()).filter(Boolean),
                capacity: capacity || 0,
                organizer: user.displayName || "CampusHub User",
                organizerId: user.uid,
                attendees: {
                    [user.uid]: true
                },
            };
            
            await set(ref(database, `events/${newEventId}`), { ...newEventData, id: newEventId });

            toast({ title: "Event Created!", description: "Your event has been successfully published." });
            router.push(`/events/${newEventId}`);

        } catch (error: any) {
            toast({ title: "Error Creating Event", description: error.message, variant: "destructive" });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Create a New Event</h1>
                <p className="mt-2 text-lg text-muted-foreground">Fill in the details below to get your event started.</p>
            </div>
            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                        <CardDescription>Provide the necessary information for your event.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Annual Tech Conference" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Tell attendees about your event..." rows={5} required />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="time">Time</Label>
                                <Input id="time" value={time} onChange={(e) => setTime(e.target.value)} placeholder="e.g., 7:00 PM" required />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="location">Location</Label>
                            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Grand Auditorium" required />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="image">Image URL</Label>
                                <Input id="image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/image.png" />
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="capacity">Capacity (Optional)</Label>
                                <Input id="capacity" type="number" value={capacity || ''} onChange={(e) => setCapacity(parseInt(e.target.value, 10))} placeholder="e.g., 100" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="tags">Tags</Label>
                            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Tech, AI, Networking (comma-separated)" />
                        </div>
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? "Creating Event..." : "Create Event"}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
