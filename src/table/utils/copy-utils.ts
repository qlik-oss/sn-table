const copyCellValue = async (evt: any) => {
  const target = evt.target as HTMLElement;

  const value = target.children[0]?.firstChild
    ? target.children[0].firstChild.textContent
    : target.firstChild?.textContent;
  try {
    value && (await navigator.clipboard.writeText(String(value)));
  } catch (error) {
    console.log(error);
  }
};

export default copyCellValue;
