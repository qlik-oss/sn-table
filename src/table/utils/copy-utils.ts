const copyCellValue = async (evt: React.MouseEvent | React.KeyboardEvent) => {
  let target = evt.target as HTMLElement;

  if (!target.classList.contains("sn-table-cell")) {
    target = target.closest(".sn-table-cell") as HTMLElement;
  }
  const value = target.querySelector(".sn-table-cell-text")?.textContent;

  try {
    value && (await navigator.clipboard.writeText(String(value)));
  } catch (error) {
    console.log(error);
  }
};

export default copyCellValue;
