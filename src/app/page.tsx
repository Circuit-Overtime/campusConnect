
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { database } from "@/lib/firebase";
import { ref, onValue, query, limitToFirst, get, update, orderByChild, startAt } from "firebase/database";
import EventCard from "@/components/event-card";
import AnnouncementCard from "@/components/announcement-card";
import type { Event, Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const announcements: Announcement[] = [
  {
    id: "1",
    title: "Library Hours Extended for Finals",
    content: "The main library will be open 24/7 from Nov 15th to Dec 5th. Good luck with your exams!",
    timestamp: "2 days ago",
    club: "Campus Administration",
  },
  {
    id: "2",
    title: "New Club Registration Open",
    content: "Want to start a new club? The registration portal is now open until the end of the month.",
    timestamp: "4 days ago",
    club: "Student Council",
  },
];

const dummyEvents: Event[] = [
    { id: "1", title: "GDG Tech Talk: The Future of AI", date: "2024-10-26", time: "3:00 PM", location: "Auditorium A", image: "https://placehold.co/600x400.png", description: "Join us for an exciting talk on the future of Artificial Intelligence with industry experts.", tags: ["Tech", "AI"], organizer: "Google Developer Group", capacity: 200, attendees: {} },
    { id: "2", title: "Campus Movie Night: Sci-Fi Special", date: "2024-10-28", time: "7:00 PM", location: "Central Lawn", image: "https://placehold.co/600x400.png", description: "Grab your blankets and enjoy a classic sci-fi movie under the stars.", tags: ["Social", "Movie"], organizer: "Student Life Committee", capacity: 500, attendees: {} },
    { id: "3", title: "Career Fair 2024", date: "2024-11-02", time: "10:00 AM - 4:00 PM", location: "Grand Hall", image: "https://placehold.co/600x400.png", description: "Connect with top companies and explore internship and job opportunities.", tags: ["Career", "Networking"], organizer: "Career Services", attendees: {} },
    { id: "4", title: "Art Club Exhibition", date: "2024-11-05", time: "All Day", location: "Fine Arts Gallery", image: "https://placehold.co/600x400.png", description: "...", tags: ["Arts", "Exhibition"], organizer: "Art & Design Club", attendees: {} },
    { id: "5", title: "Volunteering Day", date: "2024-11-10", time: "9:00 AM", location: "Community Center", image: "https://placehold.co/600x400.png", description: "...", tags: ["Volunteering", "Community"], organizer: "Student Council", attendees: {} },
    { id: "6", title: "Debate Championship", date: "2024-11-12", time: "6:00 PM", location: "Lecture Hall C", image: "https://placehold.co/600x400.png", description: "...", tags: ["Academic", "Debate"], organizer: "Debate Society", attendees: {} },
];

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventsRef = ref(database, 'events');

    const seedDataIfNeeded = async () => {
        const snapshot = await get(eventsRef);
        if (!snapshot.exists()) {
            console.log("No event data found. Seeding database...");
            const updates: Record<string, any> = {};
            dummyEvents.forEach(event => {
                const { id, ...eventData } = event;
                updates[`/events/${id}`] = eventData;
            });
            await update(ref(database), updates);
        }
    };

    seedDataIfNeeded().then(() => {
        const today = new Date().toISOString().split('T')[0];
        const eventsQuery = query(ref(database, 'events'), orderByChild('date'), startAt(today), limitToFirst(3));
        const unsubscribe = onValue(eventsQuery, (snapshot) => {
            const eventsData = snapshot.val();
            if (eventsData) {
                const eventsList = Object.entries(eventsData).map(([id, data]) => ({
                    id,
                    ...(data as Omit<Event, 'id'>)
                }));
                setEvents(eventsList);
            } else {
                setEvents([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    });

  }, []);

  return (
    <div className="space-y-12">
      <section className="text-center bg-card p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Welcome to Campus Connect</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your central place for events, clubs, and campus life. Stay connected.</p>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Button variant="link" asChild>
            <Link href="/events">View All</Link>
          </Button>
        </div>
        {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-[28rem] w-full" />)}
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
            </div>
        )}
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Latest Announcements</h2>
          <Button variant="link">View All</Button>
        </div>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </section>
    </div>
  );
}
