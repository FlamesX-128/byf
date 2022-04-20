# **Byf (bundle your files)**
bundle your files.

## **Installation**
use [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) package manager to install byf.

```bash
# Using npm

$ npm install -g @FlamesX-128/byf
```

```bash
# Using yarn

$ yarn global add @FlamesX-128/byf
```

## **Usage**
In order to use the package, use the 'bys' command.

```
$ byf
```

### **Configuration file**
Byf should have a config file called 'byf.config.js' with the following:

```ts
interface Config {
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
```
## **Example**

```js
// byf.config.js

module.exports = {
  entry: 'main.js',
  output: {
    filename: 'bundle.js'
  }
}
```

```js
// index.js
import('hello.js')

```

```js
// hello.js

(function () {
  console.log('Hello world')
})()

```

```js
// Output: bundle.js

(function () {
  console.log('Hello world')
})()

```


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
