import { NextRequest, NextResponse } from "next/server";
import { getAuth, clerkClient } from '@clerk/nextjs/server';
import { User, UpdateUserParams, CreateUserParams } from "../../Model";

export async function GET() {
  try {
    const user = await clerkClient.users.getUserList({limit:500});
    return NextResponse.json(user);
  }
    catch (err: Error | any) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const { data: createUserParams } = await request.json() as { data: CreateUserParams};
    const user = await clerkClient.users.createUser(createUserParams);
    return NextResponse.json(user);
  } catch (err: Error | any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { data: updateUserParams, id } = await req.json() as { data: UpdateUserParams; id: string };

  try {
    const updatedUser = await clerkClient.users.updateUser(id, updateUserParams);

    return NextResponse.json({ updatedUser });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Error updating user" }, { status: 500 });
  }
}
export async function DELETE(request: NextRequest) {
    const { id } = await request.json() as { id: string };
  try {
    await clerkClient.users.deleteUser(id);
    return NextResponse.json({ message: 'Success' });
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Error deleting user' });
  }
}
