import { PrismaClient } from "@/app/generated/prisma";
import IssueForm from "../../_components/IssueForm";
import { notFound } from "next/navigation";

const prisma = new PrismaClient();
interface Props {
  params: { id: string };
}
const EditIssuePage = ({ params }: Props) => {
  const issue = prisma.issue.findUnique({
    where: {
      id: parseInt(params.id),
    },
  });

  if (!issue) notFound();

  return <IssueForm issue={issue} />;
};

export default EditIssuePage;
