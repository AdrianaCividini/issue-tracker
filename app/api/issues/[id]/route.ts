import { PrismaClient } from "@/app/generated/prisma";
import { patchIssueSchema } from "@/app/validationSchema";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

// or in new Next.js versions:
// import type { RouteHandlerContext } from "next/server";

import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

const prisma = new PrismaClient();

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const issueId = Number(params.id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const body = await request.json();
  const validation = patchIssueSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(validation.error.issues, { status: 400 });
  }

  const { assignedToUserId, title, description } = body;
  if (assignedToUserId) {
    const user = await prisma.user.findUnique({
      where: {
        id: assignedToUserId,
      },
    });
    if (!user) {
      return NextResponse.json({ error: "Invalid user" }, { status: 404 });
    }
  }

  const issue = await prisma.issue.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!issue) {
    return NextResponse.json({ error: "Issue not found" }, { status: 404 });
  }

  const updateIssue = await prisma.issue.update({
    where: { id: issueId },
    data: {
      title,
      description,
      assignedToUserId,
    },
  });
  return NextResponse.json(updateIssue);
}
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({}, { status: 401 });

  const issueId = Number(params.id);
  if (isNaN(issueId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  const issue = await prisma.issue.findUnique({
    where: {
      id: issueId,
    },
  });
  if (!issue)
    return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

  await prisma.issue.delete({
    where: {
      id: issueId,
    },
  });
  return NextResponse.json({});
}
