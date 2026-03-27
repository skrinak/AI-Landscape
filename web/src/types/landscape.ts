export type NodeType = 'category' | 'group' | 'leaf'

export interface LandscapeNode {
  id: string
  label: string
  type: NodeType
  icon: string
  shortDesc: string
  isAws?: boolean
  docUrl?: string
  children?: LandscapeNode[]
  color?: string
}

export interface NavEntry {
  id: string
  label: string
}
