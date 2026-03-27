import type { LandscapeNode, NavEntry } from '../types/landscape'
import { LANDSCAPE } from '../data/landscape'

export interface NodeWithPath {
  node: LandscapeNode
  path: NavEntry[]
}

function flatten(nodes: LandscapeNode[], path: NavEntry[], out: NodeWithPath[]) {
  for (const node of nodes) {
    out.push({ node, path })
    if (node.children) flatten(node.children, [...path, { id: node.id, label: node.label }], out)
  }
}

let _all: NodeWithPath[] | null = null
function all(): NodeWithPath[] {
  if (!_all) { _all = []; flatten(LANDSCAPE, [], _all) }
  return _all
}

export function matchDiagramNode(svgTexts: string[], iconFile: string | null): NodeWithPath | null {
  const nodes = all()
  const iconBase = iconFile?.replace(/[.]png$/i, '') ?? null

  // Narrow by icon first — unique match wins immediately
  const byIcon = iconBase ? nodes.filter(({ node }) => node.icon === iconBase) : nodes
  if (byIcon.length === 1) return byIcon[0]

  // Text matching against the narrowed set
  const combined = svgTexts.join(' ').toLowerCase().replace(/[()/·\n]/g, ' ')
  const words = [...new Set(combined.split(/\s+/).filter(w => w.length >= 4))]

  for (const { node, path } of byIcon) {
    const lbl = node.label.toLowerCase()
    if (words.some(w => lbl.includes(w))) return { node, path }
  }

  // Broader fallback across all nodes
  if (iconBase) {
    for (const { node, path } of nodes) {
      const lbl = node.label.toLowerCase()
      if (words.some(w => lbl.includes(w) && w.length >= 5)) return { node, path }
    }
  }

  return null
}
