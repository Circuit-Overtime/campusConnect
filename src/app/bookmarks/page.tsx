import EventCard from "@/components/event-card";
import type { Event } from "@/lib/types";
import { BookmarkX } from "lucide-react";

const bookmarkedEvents: Event[] = [
    { id: "1", title: "GDG Tech Talk: The Future of AI", date: "2024-10-26", time: "3:00 PM", location: "Auditorium A", image: "https://placehold.co/600x400.png", description: "...", tags: ["Tech", "AI"], organizer: "Google Developer Group" },
    { id: "3", title: "Career Fair 2024", date: "2024-11-02", time: "10:00 AM - 4:00 PM", location: "Grand Hall", image: "https://placehold.co/600x400.png", description: "...", tags: ["Career", "Networking"], organizer: "Career Services" },
];

export default function BookmarksPage() {
    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Bookmarked Events</h1>
                <p className="mt-2 text-lg text-muted-foreground">Your saved events, all in one place.</p>
            </div>
            
            {bookmarkedEvents.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {bookmarkedEvents.map((event) => (
                        <EventCard key={event.id} event={event} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-card rounded-xl">
                    <BookmarkX className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Bookmarked Events</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        You haven't bookmarked any events yet.
                    </p>
                </div>
            )}
        </div>
    );
}
