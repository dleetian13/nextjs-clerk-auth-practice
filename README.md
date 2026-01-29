# Other facts

- `.env.local`. Loaded first, highest priority
- `.env.development, .env.test, .env.production`. Depending on NODE_ENV
- `.env`. Base default values

# Part 1 - Initial Setup
First, install the clerk dependencies using `pnpm add @clerk/nextjs`.

Second, edit your environment variables.

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```
```
```

Third, create a `proxy.ts` at the root (middleware for checking routes).

```typescript
// proxy.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
```


Fourth, wrap your application with `<ClerkProvider>` component to provide active session and user context to Clerk's hook and other components.

- `<SignedIn>`. Children of this component can be seen while signed in.
- `<SignedOut>`. Children of this component can only be seen while signed out.
- `<UserButton>`. Shows the user's avatar, shows management options when clicked.
- `<SignInButton>`. Unstyled component that links to the sign-in page.

```typescript
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-end items-center p-4 gap-4 h-16">
            <SignedOut>
              <SignInButton />
              <SignUpButton>
                <button className="bg-[#6c47ff] text-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </header>
          {children}
        </body>
      </html>
    </ClerkProvider>
```

# Part 2 - Routing

By default, `clerkMiddleware()` makes all routes public.

First, create a sign-in component on a dedicated page using NextJS optional catch-all-route.

```typescript
export default function Page() {
  return <SignIn/>
}
```

Second, to make the sign-in route public, modify proxy.ts to create a route matcher. If it's not a private route, don't `auth.protect()`.

```typescript
const isPublicRoute = createRouteMatcher(['/sign-in(.*)']);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})

export const config = {//...}
```

Lastly, update your environment variables:

- Set the CLERK_SIGN_IN_URL environment variable to tell Clerk where the <SignIn /> component is being hosted. When a user tries to access a protected page but is not authenticated, Clerk will redirect them to this URL.
- Set CLERK_SIGN_IN_FALLBACK_REDIRECT_URL as a fallback URL incase users visit the /sign-in route directly.
- Set CLERK_SIGN_UP_FALLBACK_REDIRECT_URL as a fallback URL incase users select the 'Don't have an account? Sign up' link at the bottom of the component. After a user signs up, Clerk usually wants to send them back to a specific page. If that page isn’t provided, this fallback is used.

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

```


This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
