export default function shouldUpdateData(layout, tableData) {
  return !tableData || JSON.stringify(layout.qHyperCube.qSize) !== JSON.stringify(tableData.size);
}
