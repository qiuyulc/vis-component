export function renderFormItems<T extends { colSpan: number }>(
  formItems: T[],
  col: number,
) {
  const rows: T[][] = [];
  let currentRow: T[] = [];
  let currentCol = 0;
  for (let i = 0; i < formItems.length; i++) {
    const item = formItems[i];
    const { colSpan } = item;

    if (currentCol + colSpan > col) {
      rows.push(currentRow);
      currentRow = [];
      currentCol = 0;
    }

    currentRow.push(item);
    currentCol += colSpan;
  }

  if (currentRow.length > 0) {
    rows.push(currentRow);
  }
  return rows;
}
