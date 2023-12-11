import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const dataFilePath = path.join("./app/api/data/data.json");

type DataProps = {
  name: string;
  prompt: string;
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
    const data = await request.json();
    const changedData = await writeDataFile(data);
    if (changedData) {
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

const writeDataFile = (data: { data: Array<DataProps> }) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(dataFilePath, JSON.stringify(data), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};
