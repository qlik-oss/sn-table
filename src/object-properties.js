/**
 * @typedef {object}
 * @entry
 */
const properties = {
  /**
   * Current version of this generic object definition
   * @type {string}
   */
  version: '1.0.0',
  /**
   * @typedef
   */
  qHyperCubeDef: {
    qDimensions: [],
    qMeasures: [],
    qMode: 'S',
    /** @type {boolean} */
    qSuppressZero: true,
    /** @type {boolean} */
    qSuppressMissing: true,
    /** @type {NxCalcCond} */
    qCalcCondition: undefined,
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
};

export default properties;
