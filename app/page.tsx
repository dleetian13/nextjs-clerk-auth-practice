import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const isAuthenticated = await auth(); // equivalent to useAuth()
  const user = await currentUser(); // equivalent to useUser()
  const email = user?.emailAddresses[0].emailAddress;

  console.log(`auth()`)
  console.log(isAuthenticated)
  console.log(`currentUser()`)
  console.log(user)
  console.log(email)

  return (
    <div>Check inspect element for information</div>
  );
}
