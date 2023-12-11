"use client";
import { SignedIn, useAuth } from "@clerk/nextjs";
import UploadPdf from "./UploadPdf";
import AdminPortal from "@/app/dashboard/[[...dashboard]]/Admin/AdminPortal";

export default function DashboardPage() {
  const { userId } = useAuth();
  return userId && userId !== "user_2WqEKmmUXPfQdmvHr24D7mFtzzj" ? (
    <SignedIn>
      <UploadPdf />
    </SignedIn>
  ) : (
    <SignedIn>
      <AdminPortal />
    </SignedIn>
  );
}
