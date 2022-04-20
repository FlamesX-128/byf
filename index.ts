#!/usr/bin/node

import { readFile, writeFile } from 'fs/promises'
import { join, resolve, sep } from 'path'

interface Config {
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


/**
 * Return a path without the file (index.js).
 * @param {...Array<string>} dirs - The directories to be joined and evaluated.
 * @returns {string}
 */
function current_directory(...dirs: string[]): string {
  const path = resolve(...dirs)

  const separator = path.lastIndexOf(sep)

  return (separator > -1)
    ? path.slice(0, separator + 1)
    : path
}


/**
 * Returns the file processed by the plugins.
 * @param {string} file - The file to evaluate.
 * @param {string} module - Module name.
 * @param {Config} config - The configuration file.
 * @returns {Promise<string>}
 */
async function render_file(file: string, module: string, config: Config): Promise<string> {
  if (!config.plugins || !config.plugins.length) return file

  for (const { extention, use } of config.plugins) {
    if (!extention || !use)
      continue

    if (!module.match(extention))
      continue

    return await (
      /**
       * The function responsible for passing the document through all plugins.
       * @param {string} doc - The document being processed by the plugins.
       * @param {number} i - Number of times the function has been executed.
       * @returns {Promsie<string>} - Returns the document processed by the plugins.
       */
      async function handler(doc: string, i: number): Promise<string> {
        if (i === config.plugins?.length) return doc

        return await handler(
          (typeof use[i] !== 'string')
            ? (use[i] as (doc: string) => string)(doc)
            : (await import(module))(doc),
          (i + 1)
        )
      }
    )(file, 0)

  }

  return file
}


/**
 * It is responsible for joining the files into one.
 * @param {string} file - The file to evaluate.
 * @param {string} dir - Current directory.
 * @param {Config} config - The configuration file.
 * @returns {Promise<string>}
 */
async function bundle_files(file: string, dir: string, config: Config): Promise<string> {
  const match = file.match(config.importer || /(import|require)\('(.*)'\)/)

  if (!match) return file

  const document = await render_file(
    await bundle_files(
      await readFile(resolve(dir, match[2]), {
        encoding: 'utf-8'
      }),
      current_directory(dir, match[2]),
      config
    ),
    match[2].slice(
      (match[2].lastIndexOf(sep) > -1)
        ? match[2].lastIndexOf(sep) + 1
        : 0
    ),
    config
  )

  return await bundle_files(
    file.replace(match[0], document), dir, config
  )
}

(
  /**
   * The main function.
   * @param {string} dir - Current directory-
   * @returns {Promise<void>}
   */
  async function main(dir: string): Promise<void> {
    const config: Config = await import(resolve(dir, 'byf.config.js'))

    if (!config.entry) return

    await writeFile(
      join(dir,
        config.output?.path || '',
        config.output?.filename || 'bundle'
      ),
      await bundle_files(
        await readFile(resolve(dir, config.entry), {
          encoding: 'utf-8'
        }),
        dir,
        config
      ),
      {
        encoding: 'utf-8'
      }
    )

  }
)(process.cwd())
