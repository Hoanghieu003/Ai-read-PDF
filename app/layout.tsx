import {
  ClerkProvider,
  clerkClient,
  SignedIn,
  UserButton,
  ClerkLoading,
} from "@clerk/nextjs";
import "./globals.css";
import { Inter } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import {} from "@clerk/nextjs";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Construct AI",
  description: "Construct AI build your chat bot with pdf.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head />
      <body
        className={`${inter.className} min-h-screen flex flex-col bg-[#222327] `}
      >
        <ClerkProvider
          appearance={{
            variables: { colorPrimary: "#006198" },
          }}
        >
          <div className="header flex items-center justify-between h-16 gap-4 px-4 border-b border-black border-solid sm:px-8 border-opacity-20 text-2xl text-white font-semibold">
            <Link
              href="/"
              className="flex items-center h-20 gap-2 sm:gap-4 ai-icon"
              style={{
                fontFamily: "'Google Sans', 'Helvetica Neue', sans-serif",
                fontSize: 20,
                fontWeight: 600,
              }}
            >
              {"Construct AI"}
            </Link>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <Toaster
              position="top-center"
              reverseOrder={false}
              toastOptions={{
                style: {
                  background: "#212020",
                  color: "#fff",
                  borderColor: "#333",
                  borderWidth: "1px",
                },
              }}
            />
          </div>
          <main className="grow">{children}</main>
          <footer className=" footer flex items-center h-20 gap-1 px-8 font-medium md:px-20">
            <div className="text-lg text-white font-semibold">
              {"Construct AI"}
              <span className="text-sm text-white"> © 2023</span>
            </div>
          </footer>
        </ClerkProvider>
      </body>
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/components/prism-core.min.js" />
      <Script src="https://cdn.jsdelivr.net/npm/prismjs@1/plugins/autoloader/prism-autoloader.min.js" />
    </html>
  );
}
