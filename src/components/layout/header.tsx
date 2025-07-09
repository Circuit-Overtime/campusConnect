"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Briefcase,
  Home,
  Users,
  CalendarDays,
  FolderKanban,
  MessageSquare,
  Bookmark,
  Menu,
  Search,
  AlertCircle,
  LogOut,
  Newspaper
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { useAuth } from "../providers/auth-provider";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const navItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Clubs", href: "/clubs", icon: Users },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Blogs", href: "/blogs", icon: Newspaper },
  { label: "Resources", href: "/resources", icon: FolderKanban },
  { label: "Chat", href: "/chat", icon: MessageSquare },
  { label: "Bookmarks", href: "/bookmarks", icon: Bookmark },
  { label: "Issues", href: "/issues", icon: AlertCircle },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const NavLink = ({ item, isMobile }: { item: typeof navItems[0], isMobile?: boolean }) => {
    const isActive = pathname === item.href;
    return (
      <Link href={item.href}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          className={cn("w-full justify-start", isMobile ? "text-base" : "text-sm")}
        >
          <item.icon className="mr-2 h-4 w-4" />
          {item.label}
        </Button>
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold text-lg">CampusHub</span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium transition-colors hover:text-primary",
                    isActive ? "text-primary" : "text-muted-foreground"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="hidden md:flex flex-1 max-w-sm items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search events, clubs..." className="pl-9" />
            </div>
          </div>
          <ThemeToggle />
          
          {!loading && (
            <>
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.photoURL || undefined} alt={user.displayName || "User"} data-ai-hint="person face" />
                        <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/blog">
                        <Newspaper className="mr-2 h-4 w-4" />
                        My Blog
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button asChild>
                  <Link href="/login">Login</Link>
                </Button>
              )}
            </>
          )}

          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="grid gap-4 text-lg font-medium py-6">
                <Link href="/" className="flex items-center space-x-2 mb-4">
                    <Briefcase className="h-6 w-6 text-primary" />
                    <span className="inline-block font-bold text-lg">CampusHub</span>
                </Link>
                  {navItems.map((item) => (
                    <NavLink key={item.href} item={item} isMobile/>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
