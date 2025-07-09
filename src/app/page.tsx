import EventCard from "@/components/event-card";
import AnnouncementCard from "@/components/announcement-card";
import type { Event, Announcement } from "@/lib/types";
import { Button } from "@/components/ui/button";

const events: Event[] = [
  {
    id: "1",
    title: "GDG Tech Talk: The Future of AI",
    date: "2024-10-26",
    time: "3:00 PM",
    location: "Auditorium A",
    image: "https://placehold.co/600x400.png",
    description: "Join us for an exciting talk on the future of Artificial Intelligence with industry experts.",
    tags: ["Tech", "AI"],
    organizer: "Google Developer Group",
  },
  {
    id: "2",
    title: "Campus Movie Night: Sci-Fi Special",
    date: "2024-10-28",
    time: "7:00 PM",
    location: "Central Lawn",
    image: "https://placehold.co/600x400.png",
    description: "Grab your blankets and enjoy a classic sci-fi movie under the stars.",
    tags: ["Social", "Movie"],
    organizer: "Student Life Committee",
  },
  {
    id: "3",
    title: "Career Fair 2024",
    date: "2024-11-02",
    time: "10:00 AM - 4:00 PM",
    location: "Grand Hall",
    image: "https://placehold.co/600x400.png",
    description: "Connect with top companies and explore internship and job opportunities.",
    tags: ["Career", "Networking"],
    organizer: "Career Services",
  },
];

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

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center bg-card p-8 rounded-xl shadow-md">
        <h1 className="text-4xl font-bold text-primary tracking-tight">Welcome to CampusHub</h1>
        <p className="mt-2 text-lg text-muted-foreground">Your central place for events, clubs, and campus life. Stay connected.</p>
      </section>

      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold">Upcoming Events</h2>
          <Button variant="link">View All</Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
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
