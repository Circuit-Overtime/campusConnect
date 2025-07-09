import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { FileSearch } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 min-h-[calc(100vh-20rem)]">
      <FileSearch className="mx-auto h-24 w-24 text-primary" />
      <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground sm:text-6xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-lg text-muted-foreground max-w-md">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go back to Homepage</Link>
      </Button>
    </div>
  );
}
