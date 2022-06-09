export interface Translator {
  get: (str: string, args?: string[]) => string;
}
