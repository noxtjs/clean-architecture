import fs from 'fs'
import path from 'path'

import { transform, traverse } from '@babel/core'
import { Visitor, VisitNodeFunction } from '@babel/traverse'
import t from '@babel/types'

import { isStale, createModuleSourceGraph } from './detect-stale'

export interface ModuleSource {
  to: string
  from: string
  start?: { line: number; column: number }
  end?: { line: number; column: number }
}

const getImports = (name: string, code: string) => {
  const { ast } = transform(code, {
    ast: true,
    parserOpts: {
      plugins: ['typescript', 'optionalChaining'],
    },
  })!

  const moduleSources: ModuleSource[] = []
  const enterImportDeclaration: VisitNodeFunction<
    {},
    t.ImportDeclaration
  > = nodePath => {
    const node = nodePath.get('source').node

    let from: string
    if (node.value.startsWith('.')) {
      from = path.join(path.dirname(name), node.value)
    } else if (node.value.startsWith('/')) {
      from = node.value
    } else {
      return
    }

    moduleSources.push({
      to: name,
      from,
      start: node.loc?.start,
      end: node.loc?.end,
    })
  }

  const visitor: Visitor = {
    ImportDeclaration: {
      enter: enterImportDeclaration,
    },
  }

  traverse(ast!, visitor)
  return moduleSources
}

const getImportSources = async (files: string[]) => {
  const resolveExtension = (files: string[], name: string) => {
    if (files.includes(name)) {
      return name
    }
    const candidates = files.filter(file => file.startsWith(name))
    // FIXME: need sort
    return candidates[0]
  }

  return Promise.all(
    files.map(async file => {
      const code = await fs.promises.readFile(file, { encoding: 'utf-8' })
      return getImports(file, code).map(moduleSource => {
        moduleSource.from = resolveExtension(files, moduleSource.from)
        return moduleSource
      })
    }),
  )
}

const checkStaleDependencies = async () => {
  const imports = await getImportSources([
    'examples/non-staled2/a.ts',
    'examples/non-staled2/b.ts',
    'examples/non-staled2/c.ts',
  ])
  const graph = createModuleSourceGraph(imports.flat(2))
  const res = isStale(graph)
  console.log(res)
}

checkStaleDependencies()
