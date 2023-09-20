import embed from "./configure";
import connect from "./connect";
import "./style.css";

(async () => {
  const app = await connect();
  const nuked = embed(app);

  nuked.selections().then((selections) => selections.mount(document.getElementById("selections")));

  // create a session object
  nuked.render({
    element: document.querySelector(".object"),
    type: "table",
    fields: ["Sales Quantity", "=Sum([Sales Quantity])"],
  });

  // create another session object
  nuked.render({
    element: document.querySelectorAll(".object")[1],
    type: "table",
    fields: ["Sales Price", "=Sum([Sales Quantity]*[Sales Price])"],
    options: {
      direction: "rtl",
    },
    properties: {
      components: [
        {
          content: {
            fontSize: 40,
          },
        },
      ],
      qHyperCubeDef: {
        qMeasures: [
          {
            qDef: {
              qDef: "=Sum([Sales Quantity])",
              textAlign: {
                auto: false,
                align: "left",
              },
            },
            qAttributeExpressions: [
              {
                qExpression: `=if(Sum([Sales Quantity]) < 100000, '#ff0000', '#00ff00')`,
                qAttribute: true,
                id: "cellBackgroundColor",
              },
              {
                qExpression: `=if(Sum([Sales Quantity]) < 100000, '#3bbc4a', '#8b3bbc')`,
                qAttribute: true,
                id: "cellForegroundColor",
              },
            ],
          },
        ],
      },
      footnote: "it is footnote",
    },
  });
})();
