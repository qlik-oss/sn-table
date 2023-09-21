import { stardust } from "@nebula.js/stardust";

export const chartBackgroundResolver = (theme: stardust.Theme) =>
  theme.getStyle("", "", "object.straightTableV2.backgroundColor");
export const objectBackgroundResolver = (theme: stardust.Theme) =>
  theme.getStyle("object", "straightTableV2", "backgroundColor");
