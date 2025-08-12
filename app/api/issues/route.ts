import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "../../generated/prisma";
import { issueSchema } from "@/app/validationSchema";
import { getServerSession } from "next-auth";
import authOptions from "../auth/[...nextauth]/authOptions";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = issueSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json(validation.error.message, { status: 400 });
  }
  const newIssue = await prisma.issue.create({
    data: {
      title: body.title,
      description: body.description,
    },
  });
  return NextResponse.json(newIssue, { status: 201 });
}
