/**
 * @extends {qae.GenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * @extends {qae.HyperCubeDef}
   */
  qHyperCubeDef: {
    /** @type {Array<qae.NxDimension>} */
    qDimensions: [],
    /** @type {Array<qae.NxMeasure>} */
    qMeasures: [],
    qMode: 'S',
    /** @type {boolean} */
    qSuppressZero: false,
    /** @type {boolean} */
    qSuppressMissing: true,
    /** @type {Array} */
    qColumnOrder: [],
    /** @type {Array} */
    columnWidths: [],
  },
  /**
   * @type {boolean=}
   */
  showTitles: true,
  /**
   * @type {string=}
   */
  title: '',
  /**
   * @type {string=}
   */
  subtitle: '',
  /**
   * @type {string=}
   */
  footnote: '',
  /**
   * @type {object}
   */
  totals: {
    /** @type {boolean} */
    show: false,
  },
  components: [
    {
      key: 'theme',
      content: {
        fontSize: null,
        fontColor: {
          index: -1,
          color: null,
        },
        hoverEffect: false,
        hoverColor: {
          index: -1,
          color: null,
        },
        hoverFontColor: {
          index: -1,
          color: null,
        },
      },
      header: {
        fontSize: null,
        fontColor: {
          index: -1,
          color: null,
        },
      },
    },
  ],
  // style: {
  //   /**
  //    * @type {number}
  //    */
  //   fontSize: null,
  //   /**
  //    * @type {object}
  //    */
  //   fontColor: {
  //     index: -1,
  //     color: null,
  //   },
  //   /**
  //    * @type {boolean}
  //    */
  //   hoverEffect: false,
  //   /**
  //    * @type {object}
  //    */
  //   hoverColor: {
  //     index: -1,
  //     color: null,
  //   },
  //   /**
  //    * @type {object}
  //    */
  //   hoverFontColor: {
  //     index: -1,
  //     color: null,
  //   },
  //   /**
  //    * @type {object}
  //    */
  //   header: {
  //     /**
  //      * @type {number}
  //      */
  //     fontSize: null,
  //     /**
  //      * @type {object}
  //      */
  //     fontColor: {
  //       index: -1,
  //       color: null,
  //     },
  //   },
  // },
};

export default properties;
