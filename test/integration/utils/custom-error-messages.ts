/* eslint-disable import/prefer-default-export */
import { Collection } from "../types";

function navigateWithArrowsMsg(step: Collection): string {
  return `
  The test is failed on:
  - Step: ${step.step},
  - Description: ${step.description}

  You can check the difference (Expected vs. Received) here:
  `;
}

export { navigateWithArrowsMsg };
