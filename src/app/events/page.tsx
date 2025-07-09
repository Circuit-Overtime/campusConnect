import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react";
import EventCard from "@/components/event-card";
import type { Event } from "@/lib/types";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const events: Event[] = [
    { id: "1", title: "GDG Tech Talk: The Future of AI", date: "2024-10-26", time: "3:00 PM", location: "Auditorium A", image: "https://placehold.co/600x400.png", description: "...", tags: ["Tech", "AI"], organizer: "Google Developer Group" },
    { id: "2", title: "Campus Movie Night: Sci-Fi Special", date: "2024-10-28", time: "7:00 PM", location: "Central Lawn", image: "https://placehold.co/600x400.png", description: "...", tags: ["Social", "Movie"], organizer: "Student Life Committee" },
    { id: "3", title: "Career Fair 2024", date: "2024-11-02", time: "10:00 AM - 4:00 PM", location: "Grand Hall", image: "https://placehold.co/600x400.png", description: "...", tags: ["Career", "Networking"], organizer: "Career Services" },
    { id: "4", title: "Art Club Exhibition", date: "2024-11-05", time: "All Day", location: "Fine Arts Gallery", image: "https://placehold.co/600x400.png", description: "...", tags: ["Arts", "Exhibition"], organizer: "Art & Design Club" },
    { id: "5", title: "Volunteering Day", date: "2024-11-10", time: "9:00 AM", location: "Community Center", image: "https://placehold.co/600x400.png", description: "...", tags: ["Volunteering", "Community"], organizer: "Student Council" },
    { id: "6", title: "Debate Championship", date: "2024-11-12", time: "6:00 PM", location: "Lecture Hall C", image: "https://placehold.co/600x400.png", description: "...", tags: ["Academic", "Debate"], organizer: "Debate Society" },
];

export default function EventsPage() {
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

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
        </div>
    );
}
