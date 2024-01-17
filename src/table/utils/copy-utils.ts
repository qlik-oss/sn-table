const copyCellValue = async (evt: Event | React.KeyboardEvent) => {
  let target = evt.target as HTMLElement | null | undefined;

  if (!target?.classList.contains("sn-table-cell")) {
    target = target?.closest<HTMLElement>(".sn-table-cell");
  }
  const value = target?.querySelector(".sn-table-cell-text")?.textContent;

  try {
    value && (await navigator.clipboard.writeText(String(value)));
  } catch (error) {
    console.log(error);
  }
};

export default copyCellValue;
