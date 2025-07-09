import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User } from "@/lib/types";
import { Mail, GraduationCap } from "lucide-react";

const user: User = {
    id: '1',
    name: 'Alex Doe',
    email: 'alex.doe@university.edu',
    avatar: 'https://placehold.co/128x128.png',
    major: 'Computer Science',
    year: 3,
    bio: 'Aspiring full-stack developer, passionate about AI and building cool projects. Member of the GDG club and photography enthusiast.'
};

export default function ProfilePage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">My Profile</h1>
                <p className="mt-2 text-lg text-muted-foreground">View and edit your personal information.</p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                        <Avatar className="h-24 w-24 border-4 border-primary">
                            <AvatarImage src={user.avatar} data-ai-hint="person face" />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl">{user.name}</CardTitle>
                            <div className="text-muted-foreground mt-2 space-y-1">
                                <div className="flex items-center gap-2 justify-center sm:justify-start"><Mail className="h-4 w-4" />{user.email}</div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start"><GraduationCap className="h-4 w-4" />{user.major} - Year {user.year}</div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" defaultValue={user.bio} rows={4} placeholder="Tell us a little about yourself" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={user.email} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="major">Major</Label>
                            <Input id="major" defaultValue={user.major} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" type="number" defaultValue={user.year} />
                        </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline">Discard Changes</Button>
                        <Button>Save Changes</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
