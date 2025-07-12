
import { database } from "@/lib/firebase";
import { ref, get } from "firebase/database";
import type { User, BlogPost } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";

interface BlogPostWithId extends BlogPost {
    id: string;
}

interface UserBlogPageProps {
    params: {
        username: string;
    }
}

async function getUserAndPosts(username: string): Promise<{ author: User, posts: BlogPostWithId[] } | null> {
    if (!username) {
        return null;
    }

    try {
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);

        if (!usersSnapshot.exists()) {
            return null;
        }

        const usersData = usersSnapshot.val();
        let author: User | null = null;
        let userId: string | null = null;

        // Find the user with the matching username
        for (const id in usersData) {
            if (usersData[id].username?.toLowerCase() === username.toLowerCase()) {
                userId = id;
                author = { id, ...usersData[id] };
                break;
            }
        }
        
        if (!author || !userId) {
            return null; // User not found
        }

        const postsRef = ref(database, `blogs/${userId}`);
        const postSnapshot = await get(postsRef);
        const postsData = postSnapshot.val();

        let posts: BlogPostWithId[] = [];
        if (postsData) {
            posts = Object.entries(postsData).map(([id, post]) => ({
                id,
                ...(post as BlogPost),
            })).sort((a, b) => b.timestamp - a.timestamp);
        }

        return { author, posts };

    } catch (error) {
        console.error("Failed to load blog data:", error);
        return null;
    }
}


export default async function UserBlogPage({ params }: UserBlogPageProps) {
    const { username } = params;
    const data = await getUserAndPosts(username);

    if (!data) {
        return notFound();
    }

    const { author, posts } = data;
    
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
                                    <p>{post.content}</p>
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
