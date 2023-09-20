import table from "@nebula.js/sn-table";
import { embed } from "@nebula.js/stardust";

const n = embed.createConfiguration({
  context: {
    theme: "light",
    language: "en-US",
    interactions: {
      active: false, // do not allow interactions
    },
  },
  types: [
    {
      name: "table",
      load: () => Promise.resolve(table),
    },
  ],
});

export default n;
