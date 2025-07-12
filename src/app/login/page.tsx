
"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

function LoginPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { toast } = useToast();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailPassLoading, setEmailPassLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailPassLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: "Login Successful", description: "Welcome back!" });
            const redirectUrl = searchParams.get('redirect');
            router.push(redirectUrl || "/profile");
        } catch (error: any) {
            toast({ title: "Login Failed", description: error.message, variant: "destructive" });
        } finally {
            setEmailPassLoading(false);
        }
    };

    const isLoading = emailPassLoading;

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="text-center">
                    <Briefcase className="mx-auto h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl mt-2">Login to Campus Connect</CardTitle>
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

export default function LoginPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <LoginPageContent />
        </Suspense>
    );
}
