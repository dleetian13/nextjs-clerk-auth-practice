'use client';
import { useAuth, useUser } from "@clerk/nextjs";

export default function Page() {
  const { isLoaded, isSignedIn, userId, sessionId, getToken } = useAuth();

  const fetchExternalData = async () => {
    // Use `getToken()` to get the current user's session token
    const token = await getToken();

    // Use 'token' to fetch data from an external API
    const response = await fetch('https://randomuser.me/api/', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.json();
  }

  if (!isLoaded) return <div>Loading...</div>

  if (!isSignedIn) return <div>Sign in to view this page</div>

  return (
    <div>Hello {userId}! Your current active session is {sessionId}.</div>
  )
}
