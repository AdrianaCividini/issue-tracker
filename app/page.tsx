import { Flex, Grid } from "@radix-ui/themes";
import { prisma } from "./api/lib/prisma";
import IssueChart from "./IssueChart";
import IssueSummary from "./IssueSummary";
import LatestIssues from "./issues/LatestIssues";

export default async function Home() {
  const statuses = ["OPEN", "IN_PROGRESS", "CLOSED"] as const;

  const counts = await Promise.all(
    statuses.map((status) => prisma.issue.count({ where: { status } }))
  );

  const [open, inProgress, closed] = counts;

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Flex direction="column" gap="5">
        <IssueSummary open={open} inProgress={inProgress} closed={closed} />
        <IssueChart open={open} inProgress={inProgress} closed={closed} />
        <LatestIssues />
      </Flex>
    </Grid>
  );
}
