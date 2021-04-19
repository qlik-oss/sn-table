/**
 * @extends {qae.GenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * @extends {qae.HyperCubeDef}
   */
  qHyperCubeDef: {
    /** @type {DimensionProperties[]} */
    qDimensions: [],
    /** @type {MeasureProperties[]} */
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
 * @property {InlineDimensionDef=} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`.
 * @typedef {object} MeasureProperties
 * @extends NxMeasure
 * @property {NxInlineMeasureDef=} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxInlineDimensionDef`, see Engine API: `NxInlineDimensionDef`.
 * @typedef {object} InlineDimensionDef
 * @extends NxInlineDimensionDef
 * @property {TextAlign=} textAlign
 */

/**
 * Extends `NxInlineMeasureDef`, see Engine API: `NxInlineMeasureDef`.
 * @typedef {object} InlineMeasureDef
 * @extends NxInlineMeasureDef
 * @property {TextAlign=} textAlign
 */

/**
 * Extends `NxAttrExprDef`, see Engine API: `NxAttrExprDef`.
 * @typedef {object} AttributeExpressionProperties
 * @extends NxAttrExprDef
 * @property {('cellForegroundColor'|'cellBackgroundColor')} id
 */

/**
 * @typedef {object} TextAlign
 * @extends NxInlineDimensionDef
 * @property {boolean} auto
 * @property {('left'|'center'|'right')=} align
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
