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

  return (
    <div>
      {formSubmissions.map((formSubmission) => (
        <div className="border-b" key={formSubmission.id}>
          {formSubmission.shortTextInputResponses.map((response) => (
            <div key={response.id}>
              {response.title}: {response.value}
            </div>
          ))}
          {formSubmission.shortTextInputResponses.length === 0 ? (
            <div>Empty</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
