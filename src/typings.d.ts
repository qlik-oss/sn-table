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

  // eslint-disable-next-line react/prefer-stateless-function
  export class StyleSheetManager extends React.Component<StyleSheetManagerProps> {}
}
