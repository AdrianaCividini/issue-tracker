import { PrismaClient, Status } from "@/app/generated/prisma";
import IssueActions from "./IssueActions";
import IssueTable, {
  columnNames,
  IssueQuery,
} from "@/app/components/IssueTable";
import Pagination from "@/app/components/Pagination";
import { Flex } from "@radix-ui/themes";
import { Metadata } from "next";

const prisma = new PrismaClient();

interface Props {
  searchParams: IssueQuery;
}
const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);

  const status =
    searchParams.status && statuses.includes(searchParams.status)
      ? searchParams.status
      : undefined;

  const where = { status };

  const orderBy =
    searchParams.orderBy && columnNames.includes(searchParams.orderBy)
      ? { [searchParams.orderBy]: "asc" as const }
      : undefined;

  const page = Number(searchParams.page) || 1;
  const pageSize = 10;

  const [issues, issueCount] = await Promise.all([
    prisma.issue.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.issue.count({
      where,
    }),
  ]);

  return (
    <Flex direction="column" gap="3">
      <IssueActions />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Issue Tracker - Issue List",
  description: "View all project issues.",
};

export default IssuesPage;
