'use client';
import { useUser } from "@clerk/nextjs"

export default function Page() {
  const { isSignedIn, user, isLoaded } = useUser()

  if (!isLoaded) return <div>Loading...</div>

  if (!isSignedIn) return <div>Sign in to view this page</div>

  return (
    <div>Hello {user.firstName} {user.lastName} - {user.emailAddresses[0].emailAddress}) </div>
  )
}
