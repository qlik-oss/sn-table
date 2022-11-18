type Collection = { [key: string]: any };

function pad(str: string, p: number = 20, f: string = ' '): string {
  return str.padEnd(p, f);
}

function commandShiftArrowsMsg(step: Collection, cells: number[][], assertion: string): string {
  return `
  When the user presses "${step.description}"
  Then the page should be: "${step.page}"
  And  the status of the pagination buttons should be: ("true" = disabled)
    ${step.buttonsDisabled}

  The test is failed on:
  - Step: ${step.step},
  - Assertion: ${assertion}
  
  You can check the difference (Expected vs. Received) here:`;
}
export { commandShiftArrowsMsg };
