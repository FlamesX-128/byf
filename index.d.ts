declare module '@FlamesX-128/byf' {
  export interface Config {
    entry?: string,
    importer?: RegExp,
    output?: {
      filename?: string,
      path?: string
    },
    plugins?: {
      extention?: RegExp,
      use?: (string | ((doc: string) => string))[]
    }[]
  }

}