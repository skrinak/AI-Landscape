import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { NodeCard } from './NodeCard'
import type { LandscapeNode } from '../types/landscape'

interface Props {
  nodes: LandscapeNode[]
  onNavigate: (node: LandscapeNode) => void
  title?: string
}

export function LandscapeMap({ nodes, onNavigate, title }: Props) {
  const isTopLevel = nodes.every(n => n.type === 'category')
  const size = isTopLevel ? 'large' : nodes.length > 12 ? 'small' : 'medium'
  const colSize = isTopLevel ? 2 : nodes.length > 12 ? 2 : 3

  return (
    <Box>
      {title && (
        <Typography variant="h5" fontWeight={700} sx={{ mb: 3, color: 'text.primary' }}>
          {title}
        </Typography>
      )}
      <Grid container spacing={2}>
        {nodes.map(node => (
          <Grid item xs={6} sm={4} md={colSize} key={node.id}>
            <NodeCard node={node} onNavigate={onNavigate} size={size} />
          </Grid>
        ))}
      </Grid>
    </Box>
  )
}
