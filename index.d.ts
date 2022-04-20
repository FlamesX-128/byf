declare module '@FlamesX-128/byf' {
  export interface Config {
    /** @type {string} - The main file. */
    entry: string,

    /**
     * If you want it to be imported in a different way.
     * - Must have a minimum and maximum of 2 containers.
     * - Basic structure: '/()('(.*)')/'
     * 
     * @type {string} - The main file.
     * @default /()('(.*)')/
     */
    importer?: RegExp,

    /** File creation options. */
    output?: {
      /**
       * @type {string | undefined} - File name.
       * @default 'bundle'
       */
      filename?: string,

      /**
       * Path where the file will be created.
       * This includes the console path.
       * 
       * @type {string | undefined}
       * @default console.cwd()
       */
      path?: string
    },

    /** Plugin options. */
    plugins?: {
      /**
       * Here you add the extensions that must go through this plugin.
       * @type {RegExp | undefined}
       */
      extention?: RegExp,

      /**
       * The plugin handler module or function.
       * @type {(string | ((doc: string) => string))[]}
       */
      use?: (string | ((doc: string) => string))[]
    }[]
  }

}