/**
 * @interface Properties
 * @extends {EngineAPI.IGenericObjectProperties}
 * @entry
 */
const properties = {
  /**
   * Current version of this generic object definition
   * @type {string}
   * @default
   */
  version: JSON.stringify(process.env.PACKAGE_VERSION),
  /**
   * Extends HyperCubeDef, see Engine API: HyperCubeDef
   * @interface HyperCubeProperties
   * @extends {EngineAPI.IHyperCubeDef}
   */
  qHyperCubeDef: {
    /**
     * The maximum amount of dimensions is 1000
     * @type {DimensionProperties[]}
     */
    qDimensions: [],
    /**
     * The maximum amount of measures is 1000
     * @type {MeasureProperties[]}
     */
    qMeasures: [],
    /** @type {EngineAPI.INxHypercubeMode} */
    qMode: 'S',
    /** @type {boolean} */
    qSuppressZero: false,
    /** @type {boolean} */
    qSuppressMissing: true,
    /** @type {number[]} */
    qColumnOrder: [],
    /** @type {number[]} */
    columnWidths: [],
  },
  /**
   * Show title for the visualization
   * @type {boolean=}
   */
  showTitles: true,
  /**
   * Visualization title
   * @type {(string|EngineAPI.IStringExpression)=}
   */
  title: '',
  /**
   * Visualization subtitle
   * @type {(string|EngineAPI.IStringExpression)=}
   */
  subtitle: '',
  /**
   * Visualization footnote
   * @type {(string|EngineAPI.IStringExpression)=}
   */
  footnote: '',
  /**
   * totals settings
   * @typedef {object} Totals
   */
  totals: {
    /**
     * Determines if the way totals row is showing is handle automatically, if `true` the `position` prop will be ignored
     * @type {boolean=}
     */
    show: true,
    /**
     * The position of the totals row, hiding it if set to `noTotals`
     * @type {('top'|'bottom'|'noTotals')=}
     */
    position: 'noTotals',
    /**
     * The label of the totals row, shown in the leftmost column
     * @type {string=}
     */
    label: 'Totals',
  },
  /**
   * Holds general styling
   * @type {?Styling[]}
   */
  components: [],
};

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`
 * @interface DimensionProperties
 * @extends EngineAPI.INxDimension
 * @property {NxInlineMeasureDef} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`
 * @interface MeasureProperties
 * @extends EngineAPI.INxMeasure
 * @property {NxInlineMeasureDef} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxInlineMeasureDef`, see Engine API: `NxInlineMeasureDef`.
 * @interface NxInlineMeasureDef
 * @extends EngineAPI.INxInlineMeasureDef
 * @property {TextAlign=} textAlign
 */

/**
 * Extends `NxAttrExprDef`, see Engine API: `NxAttrExprDef`.
 * Column specific styling overrides general styling, that is defined in `components`.
 * @interface AttributeExpressionProperties
 * @extends EngineAPI.INxAttrExprDef - expression resolving into a valid color
 * @property {('cellForegroundColor'|'cellBackgroundColor')} id - specifying what the color applies to
 */

/**
 * Holds text alignment for a specific column.
 * @interface TextAlign
 * @extends EngineAPI.INxInlineDimensionDef
 * @property {boolean} auto - If true, sets the alignment based on the type of column (left for dimension, right for measure)
 * @property {('left'|'center'|'right')} align - Is used (and mandatory) if `auto` is false
 */

/**
 * General styling for all columns.
 * Split up into header and content (body) styling.
 * If any property is not set, default values specific for each property is used.
 * @interface Styling
 * @property {string} key - This should be set to `theme`
 * @property {ContentStyling=} content
 * @property {HeaderStyling=} header
 */

/**
 * Holds properties for font size, font color and hover styling.
 * @interface ContentStyling
 * @property {number=} fontSize - Defaults to `14`
 * @property {PaletteColor=} fontColor - Defaults to `#404040`
 * @property {boolean=} hoverEffect - Toggles hover effect
 * @property {PaletteColor=} hoverColor - Background hover color. Uses `#f4f4f4` if no hover colors are set, is transparent if only `hoverFontColor` is set
 * @property {PaletteColor=} hoverFontColor - When only `hoverColor` is set, this is adjusted to either `#f4f4f4` or `#ffffff` for optimal contrast
 */

/**
 * Holds properties for font size and color.
 * @interface HeaderStyling
 * @property {number=} fontSize - Defaults to `14`
 * @property {PaletteColor=} fontColor - Defaults to `#404040`
 */

/**
 * Color information structure. Holds the actual color and index in palette
 * @interface PaletteColor
 * @property {string} color - Color as hex string (mandatory if index: -1)
 * @property {number} index - Index in palette
 */

export default properties;
