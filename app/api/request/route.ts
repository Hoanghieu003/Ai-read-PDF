import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs";

const dataFilePath = path.join("./app/api/request/data.json");

type DataProps = {
  userId: string;
  requestCount: number;
};

export async function GET() {
  try {
    const data = (await readDataFile()) as { data: DataProps[] };
    return NextResponse.json(data.data);
  } catch (err: Error | any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest, response: NextResponse) {
  try {
    const user = await currentUser();
    const data = (await readDataFile()) as { data: DataProps[] };
    const updatedData = await writeDataFile(user!.id, data);
    if (updatedData) {
      return NextResponse.json(data.data);
    } else {
      return NextResponse.json({ message: "Failed to save!" }, { status: 500 });
    }
  } catch (err: Error | any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

const readDataFile = () => {
  return new Promise((resolve, reject) => {
    fs.readFile(dataFilePath, "utf-8", (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data) as { data: DataProps[] });
      }
    });
  });
};

const writeDataFile = async (id: string, data: { data: Array<DataProps> }) => {
  let updatedData = false;
  for (let i = 0; i < data.data.length; i++) {
    if (data.data[i].userId === id) {
      data.data[i].requestCount++;
      updatedData = true;
      break;
    }
  }
  if (!updatedData) {
    data.data.push({ userId: id, requestCount: 1 });
  }

  await fs.promises.writeFile(dataFilePath, JSON.stringify(data), "utf-8");

  return data;
};
