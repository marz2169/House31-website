"use client"

import * as React from "react"
import Link from "next/link"
import { Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navigationLinks = [
  { name: "Videos", href: "/videos" },
  { name: "News", href: "/news" },
  { name: "Trending", href: "/trending" },
  { name: "About", href: "/about" },
]

export function Header() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Button variant="ghost" className="p-2 h-auto">
              {/* Placeholder logo - replace with actual image */}
              <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">H31</span>
              </div>
            </Button>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navigationLinks.map((link) => (
            <Link key={link.name} href={link.href}>
              <Button variant="ghost" className="font-medium">
                {link.name}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Right: Theme Toggle and Mobile Menu */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle>Navigation</SheetTitle>
                <SheetDescription>
                  Navigate to different sections of House31
                </SheetDescription>
              </SheetHeader>
              <nav className="flex flex-col space-y-2 mt-6">
                {navigationLinks.map((link) => (
                  <Link key={link.name} href={link.href} onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start font-medium">
                      {link.name}
                    </Button>
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
