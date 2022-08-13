declare module 'styled-components' {
  export type StylisPlugin = (context: number, content: string) => string | void;

  export interface StyleSheetManagerProps {
    children?: React.ReactNode;
    disableCSSOMInjection?: boolean | undefined;
    disableVendorPrefixes?: boolean | undefined;
    stylisPlugins?: StylisPlugin[] | undefined;
    sheet?: ServerStyleSheet | undefined;
    target?: HTMLElement | ShadowRoot | undefined;
  }

  export class StyleSheetManager extends React.Component<StyleSheetManagerProps> {}
}
