const copyCellValue = async (cellElement: HTMLElement) => {
  const value = cellElement.querySelector(".sn-table-cell-text")?.textContent;

  try {
    value && (await navigator.clipboard.writeText(String(value)));
  } catch (error) {
    console.log(error);
  }
};

export default copyCellValue;
