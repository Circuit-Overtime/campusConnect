"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { database } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";
import type { User } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Newspaper } from "lucide-react";

export default function BlogsListPage() {
    const [authors, setAuthors] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const usersRef = ref(database, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const usersData = snapshot.val();
            if (usersData) {
                const usersList = Object.entries(usersData).map(([id, user]) => ({
                    id,
                    ...(user as Omit<User, 'id'>),
                })).filter(user => user.username); // Only list users with a username
                setAuthors(usersList);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="space-y-8">
                <div className="text-center">
                    <Skeleton className="h-10 w-1/3 mx-auto" />
                    <Skeleton className="h-6 w-1/2 mx-auto mt-2" />
                </div>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {[...Array(8)].map((_, i) => (
                         <Card key={i}>
                            <CardHeader className="items-center">
                                 <Skeleton className="h-20 w-20 rounded-full" />
                            </CardHeader>
                            <CardContent className="text-center">
                                <Skeleton className="h-6 w-3/4 mx-auto" />
                                <Skeleton className="h-4 w-1/2 mx-auto mt-2" />
                            </CardContent>
                         </Card>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Community Blogs</h1>
                <p className="mt-2 text-lg text-muted-foreground">Discover stories and insights from our community members.</p>
            </div>
            
            {authors.length > 0 ? (
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {authors.map((author) => (
                        <Link key={author.id} href={`/blog/${author.username}`} className="block">
                            <Card className="text-center items-center transition-all hover:shadow-lg hover:-translate-y-1 h-full">
                                <CardHeader className="items-center">
                                    <Avatar className="h-20 w-20 border-2 border-primary">
                                        <AvatarImage src={author.avatar} data-ai-hint="person face" />
                                        <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                </CardHeader>
                                <CardContent>
                                    <CardTitle className="text-lg">{author.name}</CardTitle>
                                    <p className="text-sm text-muted-foreground">@{author.username}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            ) : (
                 <div className="text-center py-20 bg-card rounded-xl">
                    <Newspaper className="mx-auto h-12 w-12 text-muted-foreground" />
                    <h3 className="mt-4 text-lg font-semibold">No Blogs Found</h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        It looks like no one has started a blog yet.
                    </p>
                </div>
            )}
        </div>
    );
}
