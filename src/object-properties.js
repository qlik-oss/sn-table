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
  /** @type {Styling[]=} */
  components: [],
};

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`.
 * @typedef {object} DimensionProperties
 * @extends NxDimension
 * @property {QDefExtended=} qDef
 */

/**
 * Extends `NxInlineDimensionDef`, see Engine API: `NxInlineDimensionDef`.
 * @typedef {object} QDefExtended
 * @extends NxInlineDimensionDef
 * @property {TextAlign=} textAlign
 */

/**
 * @typedef {object} TextAlign
 * @extends NxInlineDimensionDef
 * @property {boolean} auto
 * @property {('left'|'center'|'right')=} align
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`.
 * @typedef {object} MeasureProperties
 * @extends NxMeasure
 * @property {qDef} coloring
 * @property {MeasureAxis} measureAxis
 * @property {ConditionalColoring} conditionalColoring
 */

/**
 * @typedef {object} Styling
 * @property {string} key
 * @property {ContentStyling=} content
 * @property {HeaderStyling=} header
 */

/**
 * @typedef {object} ContentStyling
 * @property {number=} fontSize
 * @property {PaletteColor=} fontColor
 * @property {boolean=} hoverEffect
 * @property {PaletteColor=} hoverColor
 * @property {PaletteColor=} hoverFontColor
 */

/**
 * @typedef {object} HeaderStyling
 * @property {number=} fontSize
 * @property {PaletteColor=} fontColor
 */

/**
 * @typedef {object} PaletteColor
 * @property {number} index
 * @property {string} color
 */

export default properties;
