"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export function MainNav() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;
  console.log("session", session);
  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Team", path: "/team" },
    { name: "Mentors", path: "/mentors" },
    { name: "Blog", path: "/blog" },
    { name: "FAQ", path: "/faq" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-primary">
              ARicious
            </Link>

            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(item.path) ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {status === "authenticated" ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user.image} />
                      <AvatarFallback>
                        {/* {session.user.name?.charAt(0)} */}
                        <User className="w-8 h-8" />
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      {session.user?.name && (
                        <p className="font-medium">{session.user.name}</p>
                      )}
                      {session.user?.email && (
                        <p className="w-[200px] truncate text-sm text-gray-600">
                          {session.user.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href={
                        session.user?.role === "mentor"
                          ? "/dashboard/mentor"
                          : "/dashboard/mentee"
                      }
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    {session.user?.role === "mentor" && (
                      <Link href="/profile/mentor">Profile</Link>
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => {
                      event.preventDefault();
                      signOut({ callbackUrl: "/" });
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`block px-3 py-2 rounded-md text-base font-medium ${
                  isActive(item.path)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            {status === "authenticated" ? (
              <>
                <Link
                  href={
                    session.user?.role === "mentor"
                      ? "/dashboard/mentor"
                      : "/dashboard/mentee"
                  }
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                {session.user?.role === "mentor" && (
                  <Link
                    href="/profile/mentor"
                    className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                )}
                <button
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => {
                    setIsMenuOpen(false);
                    signOut({ callbackUrl: "/" });
                  }}
                >
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="block px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
