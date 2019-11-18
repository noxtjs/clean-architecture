import { ModuleSource } from './check-import'

type ModuleSourceGraph = { [props: string]: Set<string> }

export const createModuleSourceGraph = (
  moduleSources: ModuleSource[],
): ModuleSourceGraph => {
  const graph: ModuleSourceGraph = {}

  for (const moduleSource of moduleSources) {
    if (!(moduleSource.from in graph)) {
      graph[moduleSource.from] = new Set()
    }
    graph[moduleSource.from].add(moduleSource.to)
  }
  return graph
}

type GraphColorState = '?' | 'stopped'

export const isStale = (graph: ModuleSourceGraph) => {
  const memo: { [pattern: string]: GraphColorState } = {}
  const checkStale = (key: string): boolean => {
    for (const next of graph[key]) {
      const pattern = `${key}-${next}`
      switch (memo[pattern]) {
        case '?': {
          return true
        }
        case 'stopped': {
          continue
        }
      }
      if (next in graph) {
        memo[pattern] = '?'
        const res = checkStale(next)
        if (res) {
          return true
        }
      }
      memo[pattern] = 'stopped'
      continue
    }
    return false
  }

  for (const key of Object.keys(graph)) {
    if (checkStale(key)) {
      return true
    }
  }
  return false
}
