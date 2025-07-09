"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { database } from "@/lib/firebase";
import { push, ref, serverTimestamp } from "firebase/database";
import { useAuth } from "@/components/providers/auth-provider";

export default function IssuesPage() {
    const { toast } = useToast();
    const { user } = useAuth();
    const [category, setCategory] = useState("");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!category || !subject || !description) {
            toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
            return;
        }
        setLoading(true);

        const report = {
            userId: user?.uid || "anonymous",
            userEmail: user?.email || "anonymous",
            category,
            subject,
            description,
            status: "new",
            timestamp: serverTimestamp(),
        };

        try {
            await push(ref(database, 'issues'), report);
            toast({ title: "Success!", description: "Your report has been submitted. Thank you!" });
            // Reset form
            setCategory("");
            setSubject("");
            setDescription("");
        } catch (error: any) {
            toast({ title: "Submission Failed", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Report an Issue</h1>
                <p className="mt-2 text-lg text-muted-foreground">Having a problem? Let us know and we'll look into it.</p>
            </div>

            <Card>
                <form onSubmit={handleSubmit}>
                    <CardHeader>
                        <CardTitle>Submit a Report</CardTitle>
                        <CardDescription>Please provide as much detail as possible.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="category">Issue Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="bug">Bug Report</SelectItem>
                                    <SelectItem value="feature">Feature Request</SelectItem>
                                    <SelectItem value="content">Content Issue</SelectItem>
                                    <SelectItem value="account">Account Problem</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="subject">Subject</Label>
                            <Input id="subject" placeholder="e.g., Event page not loading" value={subject} onChange={e => setSubject(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea id="description" placeholder="Describe the issue in detail..." rows={6} value={description} onChange={e => setDescription(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="attachment">Attach a screenshot (optional)</Label>
                            <Input id="attachment" type="file" />
                        </div>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? "Submitting..." : "Submit Report"}
                        </Button>
                    </CardContent>
                </form>
            </Card>
        </div>
    );
}
