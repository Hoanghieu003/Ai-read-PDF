import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from '@clerk/nextjs';

export async function GET() {
  try {
    const user = await clerkClient.users.getUserList();
    return NextResponse.json(user);
  }
    catch (err: Error | any) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
  