import { prisma } from "@mapform/db";
import { Button } from "@mapform/ui/components/button";
import { format } from "date-fns";

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
    },
  });

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
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Button size="sm" variant="outline">
            Download CSV
          </Button>
        </div>
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
                    Updated on
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
                {formSubmissions.map((formSubmission) => (
                  <tr key={formSubmission.id}>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 sm:pl-0">
                      {format(formSubmission.createdAt, "LLLL do, yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {format(formSubmission.updatedAt, "LLLL do, yyyy")}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      Bar shart
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      View
                    </td>
                  </tr>
                ))}
                {/* {people.map((person) => (
                  <tr key={person.email}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {person.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.title}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.email}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {person.role}
                    </td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <a
                        className="text-indigo-600 hover:text-indigo-900"
                        href="#"
                      >
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
