"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { signInWithEmailAndPassword, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { auth, database } from "@/lib/firebase";
import { ref, set, get } from "firebase/database";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@/lib/types";

export default function LoginPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailPassLoading, setEmailPassLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [isCheckingRedirect, setIsCheckingRedirect] = useState(true);

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);
                if (result) {
                    toast({ title: "Login Successful", description: "Welcome!" });
                    const user = result.user;

                    // Check if user exists in the database, if not, create a profile.
                    const userRef = ref(database, 'users/' + user.uid);
                    const snapshot = await get(userRef);
                    if (!snapshot.exists()) {
                         const initialProfile: Omit<User, 'id'> = {
                            name: user.displayName || 'New User',
                            email: user.email || '',
                            avatar: user.photoURL || `https://placehold.co/128x128.png?text=${user.displayName?.charAt(0) || 'U'}`,
                            username: user.email?.split('@')[0] || `user${user.uid.substring(0,5)}`,
                            major: '',
                            year: 1,
                            bio: ''
                        };
                        await set(userRef, initialProfile);
                    }
                    router.push("/profile");
                }
            } catch (error: any) {
                toast({ title: "Google Login Failed", description: error.message, variant: "destructive" });
            } finally {
                setIsCheckingRedirect(false);
            }
        };

        handleRedirectResult();
    }, [router, toast]);


    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailPassLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Login Successful", description: "Welcome back!" });
            router.push("/profile");
        } catch (error: any) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } finally {
            setEmailPassLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setGoogleLoading(true);
        const provider = new GoogleAuthProvider();
        provider.setCustomParameters({ prompt: 'select_account' });
        try {
            await signInWithRedirect(auth, provider);
        } catch(error: any) {
            toast({ title: "Google Login Failed", description: error.message, variant: "destructive" });
            setGoogleLoading(false);
        }
    }

    const isLoading = emailPassLoading || googleLoading || isCheckingRedirect;

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="text-center">
                    <Briefcase className="mx-auto h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl mt-2">Login to CampusHub</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading}/>
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">Password</Label>
                                <Link href="#" className="ml-auto inline-block text-sm underline">
                                    Forgot your password?
                                </Link>
                            </div>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading}/>
                        </div>
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {emailPassLoading ? "Logging in..." : "Login"}
                        </Button>
                    </form>
                    <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin} disabled={isLoading}>
                        {isCheckingRedirect ? "Checking login status..." : googleLoading ? "Redirecting..." : "Login with Google"}
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        Don&apos;t have an account?{" "}
                        <Link href="/signup" className="underline">
                            Sign up
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
