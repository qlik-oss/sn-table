declare module "styled-components" {
  export type StylisPlugin = (context: number, content: string) => string | void;

  export interface StyleSheetManagerProps {
    children?: React.ReactNode;
    disableCSSOMInjection?: boolean;
    disableVendorPrefixes?: boolean;
    stylisPlugins?: StylisPlugin[];
    sheet?: ServerStyleSheet;
    target?: HTMLElement | ShadowRoot;
  }

  // eslint-disable-next-line react/prefer-stateless-function
  export class StyleSheetManager extends React.Component<StyleSheetManagerProps> {}
}
