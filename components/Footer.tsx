"use client"

import Link from "next/link"
import { Github } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="bg-white shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.1)] py-6">
      <div className="container max-w-7xl mx-auto px-1 md:px-2 xl:px-4">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-600">
            Created by Simon Peter Rothgang
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">Hosted on Vercel</span>
            <Separator orientation="vertical" className="h-6" />
            <Button variant="outline" size="sm" asChild>
              <Link 
                href="https://github.com/srothgan/NextJs-Eisenhower-ToDo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>View on GitHub</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}

