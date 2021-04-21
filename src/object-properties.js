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
  /** @type {Styling[]} */
  components: [],
};

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`.
 * @typedef {object} DimensionProperties
 * @extends NxDimension
 * @property {InlineDimensionDef} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`.
 * @typedef {object} MeasureProperties
 * @extends NxMeasure
 * @property {NxInlineMeasureDef} qDef
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
 * Column specific styling overrides general styling, that is defined in `components`
 * @typedef {object} AttributeExpressionProperties
 * @extends NxAttrExprDef - expression resolving into a valid color
 * @property {('cellForegroundColor'|'cellBackgroundColor')} id - spefifying what the color applies to
 */

/**
 * Holds text aligmnet for a specific column
 * @typedef {object} TextAlign
 * @extends NxInlineDimensionDef
 * @property {boolean} auto - If true, sets the alignment based on the type of column (left for dimension, right for measure)
 * @property {('left'|'center'|'right')} align - Is used (and mandatoty) if `auto` is false
 */

/**
 * General styling for all columns. Split up into header and content (body) styling
 * If any property is not set, the theme is used for that property. If nothing is set in the theme, default values specific for each property is used
 * @typedef {object} Styling
 * @property {string} key - This should be set to `theme`
 * @property {ContentStyling=} content
 * @property {HeaderStyling=} header
 */

/**
 * Holds properties for font size, font color and hover styling
 * @typedef {object} ContentStyling
 * @property {number=} fontSize - Defualts to `14` if nothing is set here or in theme
 * @property {PaletteColor=} fontColor - Defaults to `#404040` if nothing is set here or in theme
 * @property {boolean=} hoverEffect - Toggles hover effect
 * @property {PaletteColor=} hoverColor - Background hover color. Uses `#f4f4f4` if no hover colors are set, is transparent if only `hoverFontColor` is set
 * @property {PaletteColor=} hoverFontColor - When only `hoverColor` is set, this is adjusted to either `#f4f4f4` or `#ffffff` for optimal contrast
 */

/**
 * Holds properties for font size and color
 * @typedef {object} HeaderStyling
 * @property {number=} fontSize - Defualts to `14` if nothing is set here or in theme
 * @property {PaletteColor=} fontColor- Defualts to `#404040` if nothing is set here or in theme
 */

/**
 * Color information structure. Holds the actual color and index in palette.
 * @typedef {object} PaletteColor
 * @property {string} color - Color as hex string (mandatory if index: -1)
 * @property {number} index - Index in palette
 */

export default properties;
