
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
  { id: "1", name: "Google Developer Group", description: "For students passionate about Google tech.", logo: "https://res.cloudinary.com/startup-grind/image/upload/c_fill,w_500,h_500,g_center/c_fill,dpr_2.0,f_auto,g_center,q_auto:good/v1/gcs/platform-data-goog/events/blob_0IdhSDO", category: "Tech" },
  { id: "2", name: "Art & Design Club", description: "Explore your creative side with us.", logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFCwu1urCfLymGqAdtCxihNkTutFOeKUMQMA&s", category: "Arts" },
  { id: "3", name: "Debate Society", description: "Hone your public speaking and critical thinking.", logo: "https://img.freepik.com/free-vector/politicians-talking-having-debates-front-audience-flat-vector-illustration-cartoon-male-public-speakers-standing-rostrum-arguing_74855-8533.jpg?semt=ais_hybrid&w=740", category: "Academic" },
  { id: "4", name: "E-Sports Team", description: "Competitive gaming and community.", logo: "https://static.vecteezy.com/system/resources/previews/046/599/420/non_2x/esports-logo-simple-wolf-style-colourful-on-transparent-background-free-png.png", category: "Sports" },
  { id: "5", name: "Photography Club", description: "Capture moments and learn new skills.", logo: "https://i.pinimg.com/474x/c2/7f/6f/c27f6f036f594fad85a6e9b92d1130c6.jpg", category: "Arts" },
  { id: "6", name: "AI Innovators", description: "Working on the cutting edge of AI.", logo: "https://www.crn.com/news/components-peripherals/2025/media_18184e26634080b1df2521708d6a7eb7fb685ad7b.jpg?width=750&format=jpg&optimize=medium", category: "Tech" },
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
