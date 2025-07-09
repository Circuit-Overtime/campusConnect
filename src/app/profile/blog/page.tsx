"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { database } from "@/lib/firebase";
import { ref, push, set, onValue, remove, serverTimestamp } from "firebase/database";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import type { BlogPost, User } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPostWithId extends BlogPost {
    id: string;
}

export default function BlogManagementPage() {
    const { user, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [posts, setPosts] = useState<BlogPostWithId[]>([]);
    const [profile, setProfile] = useState<User | null>(null);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (!user) return;

        const userRef = ref(database, `users/${user.uid}`);
        const unsubscribeUser = onValue(userRef, (snapshot) => {
            if (snapshot.exists()) {
                setProfile({ id: user.uid, ...snapshot.val() });
            }
        });

        const postsRef = ref(database, `blogs/${user.uid}`);
        const unsubscribePosts = onValue(postsRef, (snapshot) => {
            const data = snapshot.val();
            const postsList = data 
                ? Object.entries(data)
                    .map(([id, post]) => ({ id, ...(post as BlogPost) }))
                    .sort((a, b) => b.timestamp - a.timestamp) 
                : [];
            setPosts(postsList);
            setLoading(false);
        });

        return () => {
            unsubscribeUser();
            unsubscribePosts();
        };
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content || !user) {
            toast({ title: "Error", description: "Title and content cannot be empty.", variant: "destructive" });
            return;
        }
        setIsSaving(true);

        const newPostRef = push(ref(database, `blogs/${user.uid}`));
        const newPost: Omit<BlogPost, 'id'> = {
            title,
            content,
            timestamp: serverTimestamp() as any,
            authorId: user.uid,
            authorName: profile?.name || user.displayName || "Anonymous",
        };

        try {
            await set(newPostRef, newPost);
            toast({ title: "Success!", description: "Your new post has been published." });
            setTitle("");
            setContent("");
        } catch (error: any) => {
            toast({ title: "Failed to post", description: error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (postId: string) => {
        if (!user || !confirm("Are you sure you want to delete this post?")) return;

        try {
            await remove(ref(database, `blogs/${user.uid}/${postId}`));
            toast({ title: "Post deleted", description: "Your post has been removed." });
        } catch (error: any) {
            toast({ title: "Error", description: `Could not delete post: ${error.message}`, variant: "destructive" });
        }
    };
    
    if (authLoading || loading) {
        return (
             <div className="max-w-4xl mx-auto space-y-8">
                <Skeleton className="h-10 w-1/2" />
                <Card>
                    <CardHeader><Skeleton className="h-8 w-1/4" /></CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </CardContent>
                    <CardFooter><Skeleton className="h-10 w-24" /></CardFooter>
                </Card>
                 <Skeleton className="h-8 w-1/3" />
                <div className="space-y-4"><Skeleton className="h-20 w-full" /><Skeleton className="h-20 w-full" /></div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold tracking-tight">Manage Your Blog</h1>
                {profile?.username && (
                    <Button asChild variant="outline">
                        <Link href={`/blog/${profile.username}`}>View Public Blog</Link>
                    </Button>
                )}
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Create New Post</CardTitle>
                        <CardDescription>Write and publish a new article for your blog.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="post-title">Title</Label>
                            <Input id="post-title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your post title" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="post-content">Content</Label>
                            <Textarea id="post-content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your thoughts..." rows={8} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={isSaving}>{isSaving ? "Publishing..." : "Publish Post"}</Button>
                    </CardFooter>
                </form>
            </Card>

            <section>
                <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
                <div className="space-y-4">
                    {posts.length > 0 ? (
                        posts.map(post => (
                            <Card key={post.id} className="flex items-center justify-between p-4">
                                <div>
                                    <h3 className="font-semibold">{post.title}</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Published on {new Date(post.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                                <Button variant="destructive" size="icon" onClick={() => handleDelete(post.id)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </Card>
                        ))
                    ) : (
                        <p className="text-muted-foreground">You haven't written any posts yet.</p>
                    )}
                </div>
            </section>
        </div>
    );
}
