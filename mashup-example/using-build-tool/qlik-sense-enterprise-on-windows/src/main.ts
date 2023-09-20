import nuked from "./configure";
import "./style.css";

async function run() {
  const selectionsToolbarElement = document.getElementById("selections") as HTMLElement;
  const filterAlpha = document.getElementById("filter1") as HTMLElement;
  const filterAsciiAlpha = document.getElementById("filter2") as HTMLElement;
  const filterDim1 = document.getElementById("filter3") as HTMLElement;
  const filterDim2 = document.getElementById("filter4") as HTMLElement;

  const selections = await nuked.selections();
  selections.mount(selectionsToolbarElement);

  const fieldAlpha = await nuked.field("Alpha");
  fieldAlpha.mount(filterAlpha, { title: "Alpha" });

  const fieldAsciiAlpha = await nuked.field("AsciiAlpha");
  fieldAsciiAlpha.mount(filterAsciiAlpha, { title: "AsciiAlpha" });

  const fieldDim1 = await nuked.field("Dim1");
  fieldDim1.mount(filterDim1, { title: "Dim1" });

  const fieldDim2 = await nuked.field("Dim2");
  fieldDim2.mount(filterDim2, { title: "Dim2" });

  nuked.render({
    element: document.querySelector(".object") as HTMLElement,
    type: "table",
    fields: ["Alpha", "AsciiAlpha", "Dim1", "Dim2", "Dim3", "Expression1", "Expression2", "Num", "TransID"],
  });
}

run();
