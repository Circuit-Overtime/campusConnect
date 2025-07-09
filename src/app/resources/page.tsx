import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, Download, FileText, Video, Presentation } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const resources: Resource[] = [
  { id: "1", title: "Intro to Machine Learning Slides", type: "Slides", tags: ["AI", "CS101"], link: "#", course: "CS 101", uploaded: "2024-10-20" },
  { id: "2", "title": "Calculus II Midterm Review", "type": "PDF", tags: ["Math", "Exam Prep"], "link": "#", "course": "MATH 203", "uploaded": "2024-10-18" },
  { id: "3", "title": "Guest Lecture: The Art of Storytelling", "type": "Video", "tags": ["Writing", "Guest Speaker"], "link": "#", "course": "ENG 150", "uploaded": "2024-10-15" },
  { id: "4", "title": "Organic Chemistry Lab Manual", "type": "PDF", "tags": ["Chemistry", "Lab"], "link": "#", "course": "CHEM 301", "uploaded": "2024-10-12" },
  { id: "5", "title": "History of Ancient Civilizations: Notes", "type": "Slides", "tags": ["History", "Lecture"], "link": "#", "course": "HIST 210", "uploaded": "2024-10-10" },
];

const tags = ["AI", "Math", "Writing", "Chemistry", "History", "Exam Prep", "Lab"];

const ResourceIcon = ({ type }: { type: Resource['type'] }) => {
    switch (type) {
        case 'PDF': return <FileText className="h-5 w-5 text-destructive" />;
        case 'Video': return <Video className="h-5 w-5 text-blue-500" />;
        case 'Slides': return <Presentation className="h-5 w-5 text-yellow-500" />;
    }
}

export default function ResourcesPage() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight">Resource Library</h1>
        <p className="mt-2 text-lg text-muted-foreground">Find notes, recordings, and slides from your sessions.</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by title, course, or tag..." className="pl-9 w-full" />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              Filter by Tag
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Resource Tags</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {tags.map((tag) => (
                <DropdownMenuCheckboxItem key={tag}>{tag}</DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Type</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resources.map((resource) => (
              <TableRow key={resource.id}>
                <TableCell><ResourceIcon type={resource.type} /></TableCell>
                <TableCell className="font-medium">{resource.title}</TableCell>
                <TableCell>{resource.course}</TableCell>
                <TableCell className="space-x-1">
                  {resource.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                </TableCell>
                <TableCell>{new Date(resource.uploaded).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
