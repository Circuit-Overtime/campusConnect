"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { User as AppUser } from "@/lib/types";
import { Mail, GraduationCap } from "lucide-react";
import { useAuth } from "@/components/providers/auth-provider";
import { database } from "@/lib/firebase";
import { ref, onValue, update } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    
    const [profile, setProfile] = useState<AppUser | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (authLoading) return;
        if (!user) {
            router.push("/login");
            return;
        }

        const userRef = ref(database, `users/${user.uid}`);
        const unsubscribe = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setProfile({ id: user.uid, ...snapshot.val() });
            }
            setLoading(false);
        });

        return () => unsubscribe();

    }, [user, authLoading, router]);

    const handleSaveChanges = async () => {
        if (!profile || !user) return;
        setIsSaving(true);
        try {
            const userRef = ref(database, `users/${user.uid}`);
            await update(userRef, {
                name: profile.name,
                email: profile.email,
                username: profile.username,
                major: profile.major,
                year: Number(profile.year), // ensure year is a number
                bio: profile.bio
            });
            toast({ title: "Success", description: "Profile updated successfully!" });
        } catch (error: any) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleDiscardChanges = () => {
         // Re-fetch data or reset state to original
         if (authLoading) return;
         if (!user) {
             router.push("/login");
             return;
         }
 
         const userRef = ref(database, `users/${user.uid}`);
         onValue(userRef, (snapshot) => {
             if (snapshot.exists()) {
                 setProfile({ id: user.uid, ...snapshot.val() });
             }
             setLoading(false);
         }, { onlyOnce: true });
    }

    if (loading || authLoading) {
        return (
            <div className="max-w-4xl mx-auto space-y-8">
                <Card>
                    <CardHeader>
                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <Skeleton className="h-24 w-24 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-64" />
                                <Skeleton className="h-4 w-56" />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <Skeleton className="h-24 w-full" />
                        <div className="grid md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                         <div className="grid md:grid-cols-2 gap-4">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    if (!profile) return null; // Should be redirected, but as a fallback

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
                            <AvatarImage src={profile.avatar} data-ai-hint="person face" />
                            <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle className="text-3xl">{profile.name}</CardTitle>
                            <CardDescription>@{profile.username}</CardDescription>
                            <div className="text-muted-foreground mt-2 space-y-1">
                                <div className="flex items-center gap-2 justify-center sm:justify-start"><Mail className="h-4 w-4" />{profile.email}</div>
                                <div className="flex items-center gap-2 justify-center sm:justify-start"><GraduationCap className="h-4 w-4" />{profile.major || 'Not specified'} - Year {profile.year}</div>
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea id="bio" value={profile.bio} onChange={e => setProfile({...profile, bio: e.target.value})} rows={4} placeholder="Tell us a little about yourself" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" value={profile.username || ''} onChange={e => setProfile({...profile, username: e.target.value?.toLowerCase()})} />
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="major">Major</Label>
                            <Input id="major" value={profile.major} onChange={e => setProfile({...profile, major: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Input id="year" type="number" value={profile.year} onChange={e => setProfile({...profile, year: parseInt(e.target.value) || 1 })} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} />
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" onClick={handleDiscardChanges}>Discard Changes</Button>
                        <Button onClick={handleSaveChanges} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Changes'}</Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
