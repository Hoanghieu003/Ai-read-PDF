"use client";
import { SignIn } from "@clerk/nextjs";
import Logo from "@/app/assets/img/481271_simple_plain_black_robot_shadow_with_white_backrou_xl-1024-v1-0.png";
import { redirect, useSearchParams } from "next/navigation";

export default function Page() {
  // const searchParams = useSearchParams();
  // if (searchParams.get("redirect_url")?.includes("localhost")) {
  //   redirect(
  //     `/sign-in?redirect_url=http%3A%2F%2Faustralianaisolutions.au%2Fdashboard`
  //   );
  // }
  return (
    <div className="flex justify-center px-0 md:px-52 items-center py-24 h-[calc(100vh-10rem)]">
      {/* <img src={Logo.src} className="h-full rounded-xl"  /> */}
      {/* <SignIn redirectUrl={`http://australianaisolutions.au/dashboard`} /> */}
      <SignIn />
    </div>
  );
}
