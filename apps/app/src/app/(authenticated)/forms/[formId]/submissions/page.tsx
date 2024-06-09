import { type Step, prisma } from "@mapform/db";
import { type DocumentContent } from "@mapform/mapform/lib/block-note-schema";
import { ProgressBar } from "@mapform/ui/components/progress-bar";
import { format } from "date-fns";
import memoize from "lodash.memoize";

export default async function Submissions({
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
      form: {
        include: {
          steps: true,
        },
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  const getTotalFormInputs = memoize((steps: Step[]) => {
    return steps.reduce((total, step) => {
      const description = step.description as {
        content?: DocumentContent;
      } | null;

      if (!description?.content) {
        return total;
      }

      return (
        total +
        description.content.filter((block) => block.type === "short-text-input")
          .length
      );
    }, 0);
  });

  const getTotalSubmissionInputs = memoize(
    (formSubmission: (typeof formSubmissions)[number]) => {
      return formSubmission.shortTextInputResponses.length;
    }
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8 mt-12">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Submissions
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all form submissions.
          </p>
        </div>
        {/* <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button size="sm" variant="outline">
            Download CSV
          </Button>
        </div> */}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                    scope="col"
                  >
                    Created On
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Form Version
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Completion
                  </th>
                  <th
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    scope="col"
                  >
                    Results
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {formSubmissions.map((formSubmission) => {
                  const totalFormInputs = getTotalFormInputs(
                    formSubmission.form.steps
                  );

                  return (
                    <tr key={formSubmission.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:pl-0">
                        {format(formSubmission.createdAt, "LLLL do, yyyy")}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {formSubmission.form.version}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {totalFormInputs > 0 ? (
                          <ProgressBar
                            className="w-2/3"
                            value={
                              (getTotalSubmissionInputs(formSubmission) /
                                totalFormInputs) *
                              100
                            }
                          />
                        ) : (
                          "No inputs"
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        View
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
