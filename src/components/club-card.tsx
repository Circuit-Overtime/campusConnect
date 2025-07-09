import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Club } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

interface ClubCardProps {
  club: Club;
}

export default function ClubCard({ club }: ClubCardProps) {
  return (
    <Card className="flex flex-col text-center items-center transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <Image
          src={club.logo}
          alt={`${club.name} logo`}
          width={80}
          height={80}
          className="rounded-full mx-auto border-2 border-muted"
          data-ai-hint="logo"
        />
      </CardHeader>
      <CardContent className="flex-grow">
        <CardTitle>{club.name}</CardTitle>
        <CardDescription className="mt-2">{club.description}</CardDescription>
        <Badge variant="outline" className="mt-4">{club.category}</Badge>
      </CardContent>
      <CardFooter className="w-full">
        <Button asChild className="w-full" variant="outline">
          <Link href="#">View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
