import { format } from "date-fns";
import { Badge } from "@mapform/ui/components/badge";
import { Tabs } from "~/components/tabs";
import { getDataset } from "~/data/datasets/get-dataset";

export default async function Submissions({
  params,
}: {
  params: { wsSlug: string; tsSlug: string; dId: string };
}) {
  const datasetResponse = await getDataset({ datasetId: params.dId });
  const dataset = datasetResponse?.data;

  if (!dataset) {
    return null;
  }

  const columns = dataset.columns;
  const rowsWithCellValues = dataset.rows.map((row) => {
    const rowCells = row.cells;

    return {
      ...row,
      cells: columns.map((column) => {
        const cell = rowCells.find((rowCell) => rowCell.columnId === column.id);

        return cell;
      }),
    };
  });

  return (
    <Tabs
      nameSections={[
        {
          name: dataset.teamspace.name,
          href: `/${params.wsSlug}/${params.tsSlug}`,
        },
        { name: dataset.name },
      ]}
    >
      {rowsWithCellValues.length === 0 ? (
        <div className="flex-1">
          <div className="p-8 bg-stone-50 rounded text-stone-500 text-center">
            Empty
          </div>
        </div>
      ) : (
        <div className="w-full flow-root">
          <div className="overflow-x-auto">
            <div className="inline-block min-w-full align-middle">
              <table className="min-w-full divide-y divide-gray-300">
                <thead>
                  <tr>
                    <th
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-900"
                      scope="col"
                    >
                      Submitted at
                    </th>
                    {columns.map((column) => (
                      <th
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-stone-900"
                        key={column.id}
                        scope="col"
                      >
                        {column.name}{" "}
                        <Badge variant="secondary">{column.type}</Badge>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rowsWithCellValues.map((row) => (
                    <tr className="even:bg-stone-50" key={row.id}>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-stone-500">
                        {format(row.createdAt, "LLLL do, yyyy")}
                      </td>
                      {row.cells.map((cell) => (
                        <td
                          className="whitespace-nowrap px-3 py-4 text-sm text-stone-500"
                          key={cell?.id}
                        >
                          {cell?.stringCell?.value ||
                            cell?.booleanCell?.value?.toString() ||
                            cell?.pointCell?.value?.toString() ||
                            "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </Tabs>
  );
}
