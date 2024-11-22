"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { User } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function PersonalPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive" className="mb-4 bg-red-200 text-red-600">
          <AlertTitle className="text-lg font-bold">Not logged in!!!</AlertTitle>
          <AlertDescription className="text-base font-semibold">
            Please <Link href="/signin" className="font-bold underline">sign in</Link> to view your personal information.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const userInfo = [
    { label: "Name", value: session.user?.name },
    { label: "E-Mail", value: session.user?.email },
    { label: "Organization", value: session.user?.organization },
    { label: "Role", value: session.user?.role },
  ]

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
            <User className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            {userInfo.map((item) => (
              <div key={item.label} className="border-t border-gray-100 pt-4">
                <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                <dd className="mt-1 text-sm text-gray-900">{item.value || "Not provided"}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>
    </div>
  )
}

