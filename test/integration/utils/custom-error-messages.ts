type Collection = { [key: string]: any };

function pad(str: string, p: number = 20, f: string = ' '): string {
  return str.padEnd(p, f);
}

function navigateWithArrowsMsg(step: Collection): string {
  return `
  The test is failed on:
  - Step: ${step.step},
  - Description: ${step.description}

  You can check the difference (Expected vs. Received) here:
  `;
}

export { navigateWithArrowsMsg };
