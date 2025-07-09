import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, Users, Share2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const event = {
  id: "1",
  title: "GDG Tech Talk: The Future of AI",
  date: "2024-10-26",
  time: "3:00 PM - 5:00 PM",
  location: "Main Auditorium, Building A",
  image: "https://placehold.co/1200x400.png",
  description: "Join the Google Developer Group for an insightful journey into the future of Artificial Intelligence. This session will feature guest speakers from leading tech companies who will discuss the latest trends, breakthroughs, and ethical considerations in AI. An interactive Q&A session will follow the presentations. This is a must-attend event for anyone interested in technology, computer science, and the future of innovation.",
  tags: ["Tech", "AI", "Networking", "Workshop"],
  organizer: "Google Developer Group",
  capacity: 200,
  attendees: [
    { name: "Alice", image: "https://placehold.co/40x40.png" },
    { name: "Bob", image: "https://placehold.co/40x40.png" },
    { name: "Charlie", image: "https://placehold.co/40x40.png" },
    { name: "Diana", image: "https://placehold.co/40x40.png" },
  ],
};

export default function EventDetailPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <Image
            src={event.image}
            alt={event.title}
            width={1200}
            height={400}
            className="w-full h-auto object-cover"
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
            <Button size="lg" className="flex-1"><Plus className="mr-2 h-5 w-5"/>Register Now</Button>
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
              <h3 className="text-xl font-semibold mb-3">Attendees ({event.attendees.length}/{event.capacity})</h3>
              <div className="flex items-center -space-x-2">
                {event.attendees.map(a => (
                  <Avatar key={a.name}>
                    <AvatarImage src={a.image} data-ai-hint="person face"/>
                    <AvatarFallback>{a.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ))}
                 {event.capacity - event.attendees.length > 0 &&
                    <Avatar>
                        <AvatarFallback>+{event.capacity - event.attendees.length}</AvatarFallback>
                    </Avatar>
                 }
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
