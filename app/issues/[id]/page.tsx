import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { PrismaClient } from "../../generated/prisma";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./issueDetails";

const prisma = new PrismaClient();
interface Props {
  params: { id: string };
}
const IssueDetailPage = async ({ params }: Props) => {
  const issue = await prisma.issue.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", md: "2" }} gap="5">
      <Box>
        <IssueDetails issue={issue} />
      </Box>
      <Box>
        <EditIssueButton issueId={issue.id} />
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
