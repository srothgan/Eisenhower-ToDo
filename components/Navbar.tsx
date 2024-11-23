"use client"

import { useState } from "react"
import Link from "next/link"
import { useSession, signOut } from "next-auth/react"
import { Menu, X, ChevronDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

const navLinks = [
  { name: 'Matrix', url: '/', key: "1" },
  { name: 'Personal Page', url: '/personal', key: "2" },
  { name: 'About', url: '/about', key: "3" },
]

export function Navbar() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-1 md:px-2 xl:px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-xl font-bold text-gray-800">Eisenhower ToDo</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.url}
                className="text-gray-600 hover:text-gray-900 rounded-md text-sm font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
            {session ? (
              <Button
                variant="destructive"
                onClick={() => signOut()}
              >
                Logout
              </Button>
            ):(
              <Link href="/signin" className="text-gray-600 hover:text-gray-900 rounded-md text-sm font-medium transition-colors">
                Login
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Eisenhower ToDo</SheetTitle>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.key}
                      href={link.url}
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.name}
                    </Link>
                  ))}
                  {session ? (
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setIsOpen(false)
                        signOut()
                      }}
                    >
                      Logout
                    </Button>
                  ):(
                  <Link 
                    href="/signin" 
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                    onClick={() => setIsOpen(false)}
                    >
                    Login
                  </Link>
                )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}

