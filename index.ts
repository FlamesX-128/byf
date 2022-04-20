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

function current_directory(...dirs: string[]): string {
  const path = resolve(...dirs)

  const separator = path.lastIndexOf(sep)

  return (separator > -1)
    ? path.slice(0, separator + 1)
    : path
}

async function render_file(file: string, module: string, config: Config): Promise<string> {
  if (!config.plugins || !config.plugins.length) return file

  for (const { extention, use } of config.plugins) {
    if (!extention || !use)
      continue

    if (!module.match(extention))
      continue

    return await (async function handler(i: number, toReturn: string): Promise<string> {
      if (i === config.plugins?.length) return toReturn

      return await handler(
        (i + 1), (typeof use[i] !== 'string')
          ? (use[i] as (doc: string) => string)(toReturn)
          : (await import(module))(toReturn)
      )
    })(0, file)

  }

  return file
}

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
    match[2].slice(match[2].lastIndexOf(sep) + 1),
    config
  )

  return await bundle_files(
    file.replace(match[0], document), dir, config
  )
}

(async function main(dir: string): Promise<void> {
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

})(process.cwd())
