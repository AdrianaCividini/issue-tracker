import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import { PrismaClient } from "../../generated/prisma";
import EditIssueButton from "./EditIssueButton";
import IssueDetails from "./issueDetails";
import DeleteIssueButton from "./DeleteIssueButton";
import { getServerSession } from "next-auth";
import AssigneeSelect from "./AssigneeSelect";
import authOptions from "@/app/api/auth/[...nextauth]/authOptions";

const prisma = new PrismaClient();
interface Props {
  params: Promise<{ id: string }>;
}
const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);
  const resolvedParams = await params;

  const issue = await prisma.issue.findUnique({
    where: {
      id: parseInt(resolvedParams.id),
    },
  });

  if (!issue) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} gap="5">
      <Box className="md:col-span-4">
        <IssueDetails issue={issue} />
      </Box>
      {session && (
        <Box>
          <Flex direction="column" gap="4">
            <AssigneeSelect issue={issue} />
            <EditIssueButton issueId={issue.id} />
            <DeleteIssueButton issueId={issue.id} />
          </Flex>
        </Box>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
