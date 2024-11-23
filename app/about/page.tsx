"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ClipboardList, User, Github } from 'lucide-react'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container max-w-7xl mx-auto py-8 px-1 md:px-2 xl:px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">About Eisenhower Todo</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-6 w-6" />
              The Project
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Eisenhower Todo Matrix project is designed to help students organize their tasks effectively using the famous Eisenhower Matrix, named after US President and WWII General Dwight D. Eisenhower.
            </p>
            <p className="mb-4">
              This application allows users to structure their tasks into four categories based on importance and urgency:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Important and Urgent</li>
              <li>Important but Not Urgent</li>
              <li>Not Important but Urgent</li>
              <li>Not Important and Not Urgent</li>
            </ul>
            <p className="mt-4">
              By categorizing tasks in this way, users can prioritize their work more effectively and improve their time management skills.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              The Author
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              The Eisenhower Todo project was created by Simon Peter Rothgang, a student from the University of Münster, Germany.
            </p>
            <p className="mb-4">
              Simon developed this application as part of his studies and to provide a practical tool for fellow students struggling with time management and task prioritization.
            </p>
            <p>
              The project has been made open-source to encourage collaboration, improve the design, and potentially expand its functionality.
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-8" />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Github className="h-6 w-6" />
            Contribute
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">
            We welcome contributions from the community! Whether you&apos;re a designer, developer, or just have great ideas, your input can help make Eisenhower Todo even better.
          </p>
          <p>
            Visit our GitHub repository to learn more about how you can contribute:
          </p>
          <Button variant="outline" size="sm" asChild className="mt-2">
              <Link 
                href="https://github.com/srothgan/NextJs-Eisenhower-ToDo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center space-x-2"
              >
                <Github className="h-4 w-4" />
                <span>Eisenhower Todo on GitHub</span>
              </Link>
            </Button>
        </CardContent>
      </Card>
    </div>
  )
}

