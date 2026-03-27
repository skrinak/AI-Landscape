import { useState, useCallback } from 'react'
import type { LandscapeNode, NavEntry } from '../types/landscape'
import { LANDSCAPE } from '../data/landscape'

interface NavigationState {
  path: NavEntry[]
  currentNodes: LandscapeNode[]
}

export function useNavigation(): NavigationState & {
  navigate: (node: LandscapeNode) => void
  goTo: (index: number) => void
} {
  const [path, setPath] = useState<NavEntry[]>([])

  const findNode = useCallback((id: string, nodes: LandscapeNode[]): LandscapeNode | null => {
    for (const n of nodes) {
      if (n.id === id) return n
      if (n.children) {
        const found = findNode(id, n.children)
        if (found) return found
      }
    }
    return null
  }, [])

  const currentNodes = useCallback((): LandscapeNode[] => {
    if (path.length === 0) return LANDSCAPE
    const parent = findNode(path[path.length - 1].id, LANDSCAPE)
    return parent?.children ?? []
  }, [path, findNode])

  const navigate = useCallback((node: LandscapeNode) => {
    if (!node.children?.length) return
    setPath(prev => [...prev, { id: node.id, label: node.label }])
  }, [])

  const goTo = useCallback((index: number) => {
    setPath(prev => index < 0 ? [] : prev.slice(0, index + 1))
  }, [])

  return { path, currentNodes: currentNodes(), navigate, goTo }
}
