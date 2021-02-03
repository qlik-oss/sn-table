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
};

export default properties;
