"use client";
import { useRouter } from "next/navigation";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  const router = useRouter()
  router.push("/dashboard")
  return (
    <div>
    <UserButton afterSignOutUrl="/dashboard"/>
    </div>
  );
}
