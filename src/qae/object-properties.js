/**
 * @extends {GenericObjectProperties}
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
   * @extends {HyperCubeDef}
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
    /** @type {number[]} */
    qColumnOrder: [],
    columnWidths: [],
    qInitialDataFetch: [{ qWidth: 50, qHeight: 100 }],
  },
  /**
   * Show title for the visualization
   * @type {boolean=}
   */
  showTitles: true,
  /**
   * Show chart exploration option in context menu
   * @type {boolean=}
   */
  enableChartExploration: false,
  /**
   * Visualization title
   * @type {(string|StringExpression)=}
   */
  title: '',
  /**
   * Visualization subtitle
   * @type {(string|StringExpression)=}
   */
  subtitle: '',
  /**
   * Visualization footnote
   * @type {(string|StringExpression)=}
   */
  footnote: '',
  /**
   * totals settings
   * @type {object=}
   */
  totals: {
    /**
     * If set to true, the display of the totals row will be handled automatically, and the `position` prop will be ignored.
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
   * Use pagination or continuous scroll. If undefined, defaults to using pagination
   * @type {boolean=}
   */
  usePagination: false,
  /**
   * Holds general styling
   * @type {?Component[]}
   */
  components: [],
};

/**
 * Extends `NxDimension`, see Engine API: `NxDimension`
 * @typedef {object} DimensionProperties
 * @extends NxDimension
 * @property {InlineDimensionDef} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxMeasure`, see Engine API: `NxMeasure`
 * @typedef {object} MeasureProperties
 * @extends NxMeasure
 * @property {InlineMeasureDef} qDef
 * @property {AttributeExpressionProperties[]} qAttributeExpressions
 */

/**
 * Extends `NxInlineDimensionDef`, see Engine API: `NxInlineDimensionDef`.
 * @typedef {object} InlineDimensionDef
 * @extends NxInlineDimensionDef
 * @property {TextAlign=} textAlign
 * @property {ColumnWidth=} columnWidth
 */

/**
 * Extends `NxInlineMeasureDef`, see Engine API: `NxInlineMeasureDef`.
 * @typedef {object} InlineMeasureDef
 * @extends NxInlineMeasureDef
 * @property {TextAlign=} textAlign
 * @property {ColumnWidth=} columnWidth
 */

/**
 * Extends `NxAttrExprDef`, see Engine API: `NxAttrExprDef`.
 * Column specific styling overrides general styling, that is defined in `components`.
 * @typedef {object} AttributeExpressionProperties
 * @extends NxAttrExprDef - expression resolving into a valid color
 * @property {('cellForegroundColor'|'cellBackgroundColor')} id - specifying what the color applies to
 */

/**
 * Holds text alignment for a specific column.
 * @typedef {object} TextAlign
 * @extends NxInlineDimensionDef
 * @property {boolean} auto - If true, sets the alignment based on the type of column (left for dimension, right for measure)
 * @property {('left'|'center'|'right')} align - Is used (and mandatory) if `auto` is false
 */

/**
 * Column width info
 * @typedef {object} ColumnWidth
 * @property {('auto' | 'FitToContent' | 'pixels' | 'percentage')} type - Defines how the column width is set. `auto` calculates the width(s) so the total table width equals the chart width. `fitToContent` calculates a width based on the cells' content. `pixels` uses a specified pixel value. `percentage` sets the column width to specified percentage of the chart width
 * @property {number=} pixels - Is used (and mandatory) if type is `pixels`
 * @property {number=} percentage - Is used (and mandatory) if type is `percentage`
 */

/**
 * General styling for all columns.
 * Split up into header and content (body) styling.
 * If any property is not set, default values specific for each property is used.
 * @typedef {object} Component
 * @property {string} key - This should be set to `theme`
 * @property {ContentStyling=} content
 * @property {HeaderStyling=} header
 */

/**
 * Holds properties for font size, font color and hover styling.
 * @typedef {object} ContentStyling
 * @property {number=} fontSize - Defaults to `14`
 * @property {PaletteColor=} fontColor - Defaults to `#404040`
 * @property {boolean=} hoverEffect - Toggles hover effect
 * @property {PaletteColor=} hoverColor - Background hover color. Uses `#f4f4f4` if no hover colors are set, is transparent if only `hoverFontColor` is set
 * @property {PaletteColor=} hoverFontColor - When only `hoverColor` is set, this is adjusted to either `#f4f4f4` or `#ffffff` for optimal contrast
 * @property {string=} padding - Css setting for the cell padding, defaults to `4px 12px`
 */

/**
 * Holds properties for font size and color.
 * @typedef {object} HeaderStyling
 * @property {number=} fontSize - Defaults to `14`
 * @property {PaletteColor=} fontColor - Defaults to `#404040`
 */

/**
 * Color information structure. Holds the actual color and index in palette
 * @typedef {object} PaletteColor
 * @property {string} color - Color as hex string (mandatory if index: -1)
 * @property {number} index - Index in palette
 */

export default properties;
