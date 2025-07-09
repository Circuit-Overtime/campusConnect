import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function IssuesPage() {
    return (
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center">
                <h1 className="text-4xl font-bold tracking-tight">Report an Issue</h1>
                <p className="mt-2 text-lg text-muted-foreground">Having a problem? Let us know and we'll look into it.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Submit a Report</CardTitle>
                    <CardDescription>Please provide as much detail as possible.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="email">Your Email</Label>
                        <Input id="email" type="email" placeholder="you@university.edu" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Issue Category</Label>
                        <Select>
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
                        <Input id="subject" placeholder="e.g., Event page not loading" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" placeholder="Describe the issue in detail..." rows={6} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="attachment">Attach a screenshot (optional)</Label>
                        <Input id="attachment" type="file" />
                    </div>
                    <Button type="submit" className="w-full">Submit Report</Button>
                </CardContent>
            </Card>
        </div>
    );
}
