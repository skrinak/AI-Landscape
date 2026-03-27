import { useCallback } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { AppHeader } from './components/AppHeader'
import { BreadcrumbNav } from './components/BreadcrumbNav'
import { LandscapeMap } from './components/LandscapeMap'
import { SearchBar } from './components/SearchBar'
import { useNavigation } from './hooks/useNavigation'
import type { SearchResult } from './utils/search'

export default function App() {
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
    }
  }, [jumpTo])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5, gap: 2, flexWrap: 'wrap' }}>
          <BreadcrumbNav path={path} onNavigate={goTo} />
          <SearchBar onSelect={handleSearchSelect} />
        </Box>
        <LandscapeMap
          nodes={currentNodes}
          onNavigate={navigate}
          title={title}
        />
      </Container>
    </Box>
  )
}
