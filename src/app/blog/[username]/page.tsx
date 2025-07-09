"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { database } from "@/lib/firebase";
import { ref, query, orderByChild, equalTo, get, onValue, type Unsubscribe } from "firebase/database";
import type { User, BlogPost } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FileQuestion } from "lucide-react";

interface BlogPostWithId extends BlogPost {
    id: string;
}

export default function UserBlogPage() {
    const params = useParams();
    const username = params.username as string;

    const [author, setAuthor] = useState<User | null>(null);
    const [posts, setPosts] = useState<BlogPostWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!username) {
            setError("No username provided in the URL.");
            setLoading(false);
            return;
        }

        let unsubscribe: Unsubscribe | null = null;

        const findUserAndPosts = async () => {
            try {
                const usersRef = ref(database, 'users');
                const userQuery = query(usersRef, orderByChild('username'), equalTo(username));
                const snapshot = await get(userQuery);

                if (snapshot.exists()) {
                    const usersData = snapshot.val();
                    const userId = Object.keys(usersData)[0];
                    const userData = usersData[userId];
                    const userProfile: User = { id: userId, ...userData };
                    setAuthor(userProfile);

                    const postsRef = ref(database, `blogs/${userId}`);
                    unsubscribe = onValue(postsRef, (postSnapshot) => {
                        const postsData = postSnapshot.val();
                        if (postsData) {
                            const postsList = Object.entries(postsData).map(([id, post]) => ({
                                id,
                                ...(post as BlogPost),
                            })).sort((a, b) => b.timestamp - a.timestamp);
                            setPosts(postsList);
                        } else {
                            setPosts([]);
                        }
                        setLoading(false);
                    }, (err) => {
                        setError("Could not load blog posts. They may not be public.");
                        setLoading(false);
                    });

                } else {
                    setError("User not found.");
                    setLoading(false);
                }
            } catch (err: any) {
                setError("Failed to load blog. The user's profile or blog may not be public.");
                setLoading(false);
            }
        };

        findUserAndPosts();

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [username]);

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto space-y-12">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-24 w-24 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-48" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
                <div className="space-y-8">
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-40 w-full" />
                </div>
            </div>
        );
    }
    
    if (error || !author) {
        return (
            <div className="text-center py-20">
                <FileQuestion className="mx-auto h-12 w-12 text-muted-foreground" />
                <h2 className="mt-4 text-2xl font-bold">Blog Not Found</h2>
                <p className="mt-2 text-muted-foreground">{error || "The blog you are looking for does not exist."}</p>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-12">
            <header className="flex flex-col sm:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-4 border-primary">
                    <AvatarImage src={author.avatar} data-ai-hint="person face" />
                    <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className="text-4xl font-bold tracking-tight">{author.name}'s Blog</h1>
                    <p className="mt-2 text-lg text-muted-foreground">{author.bio}</p>
                </div>
            </header>

            <main className="space-y-8">
                {posts.length > 0 ? (
                    posts.map(post => (
                        <Card key={post.id}>
                            <CardHeader>
                                <CardTitle>{post.title}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                    Posted on {new Date(post.timestamp).toLocaleDateString()}
                                </p>
                            </CardHeader>
                            <CardContent>
                                <div className="prose dark:prose-invert max-w-none">
                                    {post.content.split('\\n').map((paragraph, index) => (
                                        <p key={index}>{paragraph}</p>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                     <div className="text-center py-20 bg-card rounded-xl">
                        <h3 className="text-lg font-semibold">No Posts Yet</h3>
                        <p className="mt-1 text-sm text-muted-foreground">
                            This author hasn't published any posts.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
}
