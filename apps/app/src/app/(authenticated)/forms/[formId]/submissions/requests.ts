import { prisma } from "@mapform/db";

export async function getFormData({ formId }: { formId: string }) {
  const form = await prisma.form.findUnique({
    where: {
      id: formId,
    },
    include: {
      dataset: {
        include: {
          columns: true,
          rows: {
            include: {
              formSubmission: true,
              cellValues: {
                include: {
                  boolCell: true,
                  pointCell: true,
                  stringCell: true,
                },
              },
            },
          },
        },
      },
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion -- It is necessary
  const pointCellsWithLocation = (await prisma.$queryRaw`
    SELECT "PointCell".id, ST_X("PointCell".value) AS longitude, ST_Y("PointCell".value) AS latitude
    FROM "PointCell"
    JOIN "CellValue" ON "PointCell"."cellvalueid" = "CellValue".id
    JOIN "Row" ON "CellValue"."rowId" = "Row".id
    JOIN "Dataset" ON "Row"."datasetId" = "Dataset".id
    JOIN "Form" ON "Dataset".id = "Form"."datasetId"
    WHERE "Form".id = ${formId};
  `) as { id: string; longitude: string; latitude: string }[];

  // Combine the pointCell data with the form data
  const combined = form?.dataset?.rows.map((row) => {
    const formSubmission = row.formSubmission;
    const cellValues = row.cellValues.map((cellValue) => {
      const pointCell = pointCellsWithLocation.find(
        (pc) => pc.id === cellValue.pointCell?.id
      );

      return {
        ...cellValue,
        pointCell: pointCell
          ? {
              ...cellValue.pointCell,
              value: `${pointCell.longitude},${pointCell.latitude}`,
            }
          : cellValue.pointCell,
      };
    });

    return {
      ...row,
      formSubmission,
      cellValues,
    };
  });

  return {
    ...form,
    dataset: {
      ...form?.dataset,
      rows: combined,
    },
  };
}
