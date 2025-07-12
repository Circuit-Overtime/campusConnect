import EventCard from "@/components/event-card";
import type { Event } from "@/lib/types";
import { BookmarkX } from "lucide-react";

const bookmarkedEvents: Event[] = [
    { id: "1", title: "GDG Tech Talk: The Future of AI", date: "2024-10-26", time: "3:00 PM", location: "Auditorium A", image: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_500,h_500,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/blob_0IdhSDO", description: "...", tags: ["Tech", "AI"], organizer: "Google Developer Group", attendees: {} },
    { id: "3", title: "Career Fair 2025", date: "2024-11-02", time: "10:00 AM - 4:00 PM", location: "Room 1109", image: "https://json.commudle.com/rails/active_storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBejZmQVE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--742f9134bff63b07b9b49ee40fd05873e7c8e68a/GDGCK%20Commudle%20Dec%20Meet.png", description: "...", tags: ["Career", "Networking"], organizer: "Career Services", attendees: {} },
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
