// File generated automatically by "@scriptappy/to-dts"; DO NOT EDIT.
/// <reference types="qlik-engineapi" />
export = Properties;

declare interface Properties extends EngineAPI.IGenericObjectProperties{
}

declare namespace Properties {
    type properties.version = string;

    /**
     * Extends HyperCubeDef, see Engine API: HyperCubeDef
     */
    interface HyperCubeProperties extends EngineAPI.IHyperCubeDef{
    }

    type properties.qHyperCubeDef.qDimensions = Properties.DimensionProperties[];

    type properties.qHyperCubeDef.qMeasures = Properties.MeasureProperties[];

    type properties.qHyperCubeDef.qMode = EngineAPI.INxHypercubeMode;

    type properties.qHyperCubeDef.qSuppressZero = boolean;

    type properties.qHyperCubeDef.qSuppressMissing = boolean;

    type properties.qHyperCubeDef.qColumnOrder = number[];

    type properties.qHyperCubeDef.columnWidths = number[];

    type properties.showTitles = boolean;

    type properties.title = string | EngineAPI.IStringExpression;

    type properties.subtitle = string | EngineAPI.IStringExpression;

    type properties.footnote = string | EngineAPI.IStringExpression;

    /**
     * totals settings
     */
    type Totals = object;

    type properties.totals.show = boolean;

    type properties.totals.position = "top" | "bottom" | "noTotals";

    type properties.totals.label = string;

    type properties.components = Properties.Styling[];

    /**
     * Extends `NxDimension`, see Engine API: `NxDimension`
     */
    interface DimensionProperties extends EngineAPI.INxDimension{
        qDef: Properties.NxInlineMeasureDef;
        qAttributeExpressions: Properties.AttributeExpressionProperties[];
    }

    /**
     * Extends `NxMeasure`, see Engine API: `NxMeasure`
     */
    interface MeasureProperties extends EngineAPI.INxMeasure{
        qDef: Properties.NxInlineMeasureDef;
        qAttributeExpressions: Properties.AttributeExpressionProperties[];
    }

    /**
     * Extends `NxInlineMeasureDef`, see Engine API: `NxInlineMeasureDef`.
     */
    interface NxInlineMeasureDef extends EngineAPI.INxInlineMeasureDef{
        textAlign?: Properties.TextAlign;
    }

    /**
     * Extends `NxAttrExprDef`, see Engine API: `NxAttrExprDef`.
     * Column specific styling overrides general styling, that is defined in `components`.
     */
    interface AttributeExpressionProperties extends EngineAPI.INxAttrExprDef{
        id: "cellForegroundColor" | "cellBackgroundColor";
    }

    /**
     * Holds text alignment for a specific column.
     */
    interface TextAlign extends EngineAPI.INxInlineDimensionDef{
        auto: boolean;
        align: boolean;
    }

    /**
     * General styling for all columns.
     * Split up into header and content (body) styling.
     * If any property is not set, default values specific for each property is used.
     */
    interface Styling {
        key: string;
        content?: Properties.ContentStyling;
        header?: Properties.HeaderStyling;
    }

    /**
     * Holds properties for font size, font color and hover styling.
     */
    interface ContentStyling {
        fontSize?: number;
        fontColor?: Properties.PaletteColor;
        hoverEffect?: boolean;
        hoverColor?: Properties.PaletteColor;
        hoverFontColor?: Properties.PaletteColor;
    }

    /**
     * Holds properties for font size and color.
     */
    interface HeaderStyling {
        fontSize?: number;
        fontColor?: Properties.PaletteColor;
    }

    /**
     * Color information structure. Holds the actual color and index in palette
     */
    interface PaletteColor {
        color: string;
        index: string;
    }

}

