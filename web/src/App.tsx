import { useCallback, useState } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { AppHeader } from './components/AppHeader'
import { BreadcrumbNav } from './components/BreadcrumbNav'
import { LandscapeMap } from './components/LandscapeMap'
import { SearchBar } from './components/SearchBar'
import { DiagramView } from './components/DiagramView'
import { useNavigation } from './hooks/useNavigation'
import type { SearchResult } from './utils/search'
import type { LandscapeNode, NavEntry } from './types/landscape'

export default function App() {
  const [view, setView] = useState<'browse' | 'diagram'>('browse')
  const { path, currentNodes, navigate, goTo, jumpTo } = useNavigation()

  const title = path.length === 0
    ? 'AI Builder Landscape'
    : path[path.length - 1].label

  const handleSearchSelect = useCallback((result: SearchResult) => {
    const { node, path: resultPath } = result
    if (!node.children?.length && node.docUrl) {
      window.open(node.docUrl, '_blank', 'noopener,noreferrer')
    } else {
      jumpTo([...resultPath, { id: node.id, label: node.label }])
      setView('browse')
    }
  }, [jumpTo])

  const handleDiagramNode = useCallback((node: LandscapeNode, nodePath: NavEntry[]) => {
    if (!node.children?.length && node.docUrl) {
      window.open(node.docUrl, '_blank', 'noopener,noreferrer')
    } else {
      jumpTo([...nodePath, { id: node.id, label: node.label }])
      setView('browse')
    }
  }, [jumpTo])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader view={view} onViewChange={setView} />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, gap: 2, flexWrap: 'wrap' }}>
          {view === 'browse' && <BreadcrumbNav path={path} onNavigate={goTo} />}
          {view === 'diagram' && <Box />}
          <SearchBar onSelect={handleSearchSelect} />
        </Box>

        {view === 'browse' ? (
          <LandscapeMap nodes={currentNodes} onNavigate={navigate} title={title} />
        ) : (
          <DiagramView onSelectNode={handleDiagramNode} />
        )}
      </Container>
    </Box>
  )
}
