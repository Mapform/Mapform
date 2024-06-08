import { prisma } from "@mapform/db";

export default async function Results({
  params,
}: {
  params: { formId: string };
}) {
  const formSubmissions = await prisma.formSubmission.findMany({
    where: {
      form: {
        draftForm: {
          id: params.formId,
        },
      },
    },
    include: {
      shortTextInputResponses: true,
    },
  });

  console.log(111111, formSubmissions);

  return <div>Results</div>;
}
