(function run() {
  function connect() {
    const schemaPromise = fetch("https://unpkg.com/enigma.js/schemas/3.2.json").then((response) => response.json());

    function openDoc(appId) {
      return schemaPromise.then((schema) =>
        window.enigma
          .create({
            schema,
            url: `ws://${window.location.hostname || "localhost"}:9076/app/${encodeURIComponent(appId)}`,
          })
          .open()
          .then((qix) => qix.openDoc(appId))
      );
    }

    return openDoc;
  }

  connect()("/apps/Executive_Dashboard.qvf").then((app) => {
    // configure stardust
    const nuked = window.stardust.embed(app, {
      context: {
        theme: "dark",
        keyboardNavigation: true,
      },
      types: [
        {
          name: "table",
          load: () => Promise.resolve(window["sn-table"]),
        },
      ],
    });

    nuked.selections().then((selections) => selections.mount(document.querySelector(".toolbar")));

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
        // direction: 'rtl',
      },
      properties: {
        components: [
          {
            key: "theme",
            content: {
              fontSize: 10,
              fontColor: {
                index: -1,
                color: "#276e27",
              },
              hoverEffect: true,
              hoverColor: {
                index: -1,
                color: "#7db8da",
              },
              hoverFontColor: {
                index: -1,
                color: "#4477aa",
              },
            },
            header: {
              fontSize: 20,
              fontColor: {
                index: -1,
                color: "#f8981d",
              },
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
        title: "it is title",
        showTitles: true,
        subtitle: "it is subtitle",
        footnote: "it is footnote",
      },
    });
  });
})();
