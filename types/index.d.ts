// File generated automatically by "@scriptappy/to-dts"; DO NOT EDIT.
/// <reference types="qlik-engineapi" />
declare namespace snTable:properties {
    type AttributeExpressionProperties = NxAttrExprDef & {
        id: "cellForegroundColor" | "cellBackgroundColor";
    };

    type ContentStyling = {
        fontSize?: number;
        fontColor?: snTable:properties.PaletteColor;
        hoverEffect?: boolean;
        hoverColor?: snTable:properties.PaletteColor;
        hoverFontColor?: snTable:properties.PaletteColor;
    };

    type DimensionProperties = NxDimension & {
        qDef: snTable:properties.InlineDimensionDef;
        qAttributeExpressions: snTable:properties.AttributeExpressionProperties[];
    };

    type HeaderStyling = {
        fontSize?: number;
        fontColor?: snTable:properties.PaletteColor;
    };

    type InlineDimensionDef = NxInlineDimensionDef & {
        textAlign?: snTable:properties.TextAlign;
    };

    type InlineMeasureDef = NxInlineMeasureDef & {
        textAlign?: snTable:properties.TextAlign;
    };

    type MeasureProperties = NxMeasure & {
        qDef: NxInlineMeasureDef;
        qAttributeExpressions: snTable:properties.AttributeExpressionProperties[];
    };

    type PaletteColor = {
        color: string;
        index: number;
    };

    type Styling = {
        key: string;
        content?: snTable:properties.ContentStyling;
        header?: snTable:properties.HeaderStyling;
    };

    type TextAlign = NxInlineDimensionDef & {
        auto: boolean;
        align: "left" | "center" | "right";
    };

}

