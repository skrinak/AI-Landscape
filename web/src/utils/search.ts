import type { LandscapeNode, NavEntry } from '../types/landscape'
import { LANDSCAPE } from '../data/landscape'

export interface SearchResult {
  node: LandscapeNode
  path: NavEntry[]
}

function flatten(nodes: LandscapeNode[], parentPath: NavEntry[], out: SearchResult[]) {
  for (const node of nodes) {
    out.push({ node, path: parentPath })
    if (node.children?.length) {
      flatten(node.children, [...parentPath, { id: node.id, label: node.label }], out)
    }
  }
}

let _index: SearchResult[] | null = null

function getIndex(): SearchResult[] {
  if (!_index) {
    _index = []
    flatten(LANDSCAPE, [], _index)
  }
  return _index
}

export function search(query: string): SearchResult[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  return getIndex()
    .filter(({ node }) =>
      node.label.toLowerCase().includes(q) ||
      node.shortDesc.toLowerCase().includes(q)
    )
    .slice(0, 10)
}
