import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Announcement } from "@/lib/types";
import { Megaphone } from "lucide-react";

interface AnnouncementCardProps {
  announcement: Announcement;
}

export default function AnnouncementCard({ announcement }: AnnouncementCardProps) {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0">
        <div className="bg-primary/10 p-2 rounded-full">
            <Megaphone className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
            <CardTitle className="text-base font-semibold">{announcement.title}</CardTitle>
            <CardDescription className="text-xs mt-1">
                From {announcement.club} • {announcement.timestamp}
            </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{announcement.content}</p>
      </CardContent>
    </Card>
  );
}
