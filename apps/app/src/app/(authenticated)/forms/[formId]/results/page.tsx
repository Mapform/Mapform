import { prisma } from "@mapform/db";

export default async function Results({
  params,
}: {
  params: { formId: string };
}) {
  const formSubmissions = await prisma.formSubmission.findMany({
    where: {
      formId: params.formId,
    },
  });

  console.log(formSubmissions);

  return <div>Results</div>;
}
