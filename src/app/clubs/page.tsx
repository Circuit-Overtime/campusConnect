import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal } from "lucide-react";
import type { Club } from "@/lib/types";
import ClubCard from "@/components/club-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const clubs: Club[] = [
  { id: "1", name: "Google Developer Group", description: "For students passionate about Google tech.", logo: "https://placehold.co/100x100.png", category: "Tech" },
  { id: "2", name: "Art & Design Club", description: "Explore your creative side with us.", logo: "https://placehold.co/100x100.png", category: "Arts" },
  { id: "3", name: "Debate Society", description: "Hone your public speaking and critical thinking.", logo: "https://placehold.co/100x100.png", category: "Academic" },
  { id: "4", name: "E-Sports Team", description: "Competitive gaming and community.", logo: "https://placehold.co/100x100.png", category: "Sports" },
  { id: "5", name: "Photography Club", description: "Capture moments and learn new skills.", logo: "https://placehold.co/100x100.png", category: "Arts" },
  { id: "6", name: "AI Innovators", description: "Working on the cutting edge of AI.", logo: "https://placehold.co/100x100.png", category: "Tech" },
];

const categories = ["Tech", "Arts", "Academic", "Sports", "Social", "Volunteering"];

export default function ClubsPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Club Directory</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find your community. Explore clubs and student organizations.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or keyword..." className="pl-9 w-full" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter by Category
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Club Categories</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {categories.map((category) => (
                <DropdownMenuCheckboxItem key={category}>{category}</DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}
