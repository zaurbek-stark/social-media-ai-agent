import "./globals.css";
import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/react";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Visualize AI",
  description: "Generate Visualize Value type illustrations for any ideas",
};

function Header() {
  return (
    <header
      style={{
        position: "absolute",
        display: "flex",
        justifyContent: "space-between",
        padding: 10,
        width: "100%",
      }}
    >
      <div className="block md:flex items-end gap-3">
        <span className="author">
          Built by{" "}
          <a href="https://twitter.com/ZaurbekStark" target="_blank">
            The Codebender
          </a>
        </span>
      </div>
      <div className="flex space-x-4 justify-center items-center">
        <SignedIn>
          <UserButton appearance={{ baseTheme: dark }} afterSignOutUrl="/" />
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            {/* <button className="text-white border border-white hover:text-white hover:bg-[#2d06ff4a] py-2 px-4 rounded-3xl transition duration-300 ease-in-out">Sign in</button> */}
            <button className="text-primary-foreground border border-white hover:bg-primary hover:border-primary py-2 px-4 rounded-3xl transition duration-300 ease-in-out">
              Sign in
            </button>
            {/* <Button variant="outline" className="rounded-full hover:bg-primary">
              Sign in
            </Button> */}
          </SignInButton>
          <SignUpButton mode="modal">
            {/* <button className="bg-white py-2 px-4 rounded-3xl transition duration-300 ease-in-out">
              Sign up
            </button> */}
            <button className="bg-white text-background py-2 px-4 rounded-3xl transition duration-300 ease-in-out hover:opacity-90">
              Sign up
            </button>
            {/* <Button variant="secondary" className="rounded-full">
              Sign up
            </Button> */}
          </SignUpButton>
        </SignedOut>
      </div>
    </header>
  );
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
      }}
    >
      <html lang="en">
        <body>
          <Header />
          {children}
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
