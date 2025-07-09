"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Briefcase } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, database } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";

export default function SignupPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!fullName || !email || !password || !username) {
            toast({ title: "Error", description: "Please fill in all fields.", variant: "destructive" });
            return;
        }
        setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            await updateProfile(user, { displayName: fullName });

            await set(ref(database, 'users/' + user.uid), {
                email: user.email,
                name: fullName,
                username: username.toLowerCase(),
                major: '',
                year: 1,
                bio: '',
                avatar: `https://placehold.co/128x128.png?text=${fullName.charAt(0)}`
            });

            toast({ title: "Success", description: "Account created successfully!" });
            router.push("/profile");

        } catch (error: any) {
            console.error("Signup error:", error);
            toast({ title: "Signup Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center py-12">
            <Card className="mx-auto max-w-sm">
                <CardHeader className="text-center">
                    <Briefcase className="mx-auto h-8 w-8 text-primary" />
                    <CardTitle className="text-2xl mt-2">Create an Account</CardTitle>
                    <CardDescription>Enter your information to create an account on CampusHub</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSignup} className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="full-name">Full Name</Label>
                            <Input id="full-name" placeholder="John Doe" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
                        </div>
                         <div className="grid gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="johndoe" required value={username} onChange={(e) => setUsername(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Creating Account...' : 'Create an account'}
                        </Button>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href="/login" className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
