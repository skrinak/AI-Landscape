import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import { AppHeader } from './components/AppHeader'
import { BreadcrumbNav } from './components/BreadcrumbNav'
import { LandscapeMap } from './components/LandscapeMap'
import { useNavigation } from './hooks/useNavigation'

export default function App() {
  const { path, currentNodes, navigate, goTo } = useNavigation()

  const title = path.length === 0
    ? 'AI Builder Landscape'
    : path[path.length - 1].label

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppHeader />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <BreadcrumbNav path={path} onNavigate={goTo} />
        <LandscapeMap
          nodes={currentNodes}
          onNavigate={navigate}
          title={title}
        />
      </Container>
    </Box>
  )
}
