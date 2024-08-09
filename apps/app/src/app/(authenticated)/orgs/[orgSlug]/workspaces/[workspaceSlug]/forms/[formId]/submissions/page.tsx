import { format } from "date-fns";
import { Badge } from "@mapform/ui/components/badge";
import { getFormData } from "./requests";

export default async function Submissions({
  params,
}: {
  params: { formId: string };
}) {
  const formWithData = await getFormData({ formId: params.formId });
  const columns = formWithData?.dataset?.columns || [];
  const rowsWithCellValues = (formWithData?.dataset?.rows ?? []).map((row) => {
    const rowCells = row.cellValues;

    return {
      ...row,
      cells: columns.map((column) => {
        const cell = rowCells.find((rowCell) => rowCell.columnId === column.id);

        return cell;
      }),
    };
  });

  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-stone-900">
            Submissions
          </h1>
          <p className="mt-2 text-sm text-stone-700">
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
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-900 sm:pl-0"
                    scope="col"
                  >
                    Submitted at
                  </th>
                  {columns.map((column) => (
                    <th
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-900 sm:pl-0"
                      key={column.id}
                      scope="col"
                    >
                      {column.name}{" "}
                      <Badge variant="secondary">{column.dataType}</Badge>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rowsWithCellValues.map((row) => (
                  <tr key={row.id}>
                    {row.formSubmission ? (
                      <>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500 sm:pl-0">
                          {format(
                            row.formSubmission.createdAt,
                            "LLLL do, yyyy"
                          )}
                        </td>
                        {row.cells.map((cell, index) => (
                          <td
                            className="whitespace-nowrap px-3 py-4 text-sm text-stone-500"
                            key={cell?.id}
                          >
                            {cell?.stringCell?.value ||
                              cell?.boolCell?.value?.toString() ||
                              cell?.pointCell?.value?.toString() ||
                              "-"}
                          </td>
                        ))}
                      </>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
