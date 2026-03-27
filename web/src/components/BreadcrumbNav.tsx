import Breadcrumbs from '@mui/material/Breadcrumbs'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import HomeIcon from '@mui/icons-material/Home'
import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import Box from '@mui/material/Box'
import type { NavEntry } from '../types/landscape'

interface Props {
  path: NavEntry[]
  onNavigate: (index: number) => void
}

export function BreadcrumbNav({ path, onNavigate }: Props) {
  if (path.length === 0) return null

  return (
    <Box sx={{ mb: 2.5 }}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link
          component="button"
          underline="hover"
          color="text.secondary"
          onClick={() => onNavigate(-1)}
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer', background: 'none', border: 'none' }}
        >
          <HomeIcon fontSize="small" />
          Home
        </Link>
        {path.map((entry, i) =>
          i < path.length - 1 ? (
            <Link
              key={entry.id}
              component="button"
              underline="hover"
              color="text.secondary"
              onClick={() => onNavigate(i)}
              sx={{ cursor: 'pointer', background: 'none', border: 'none' }}
            >
              {entry.label}
            </Link>
          ) : (
            <Typography key={entry.id} color="text.primary" fontWeight={600}>
              {entry.label}
            </Typography>
          )
        )}
      </Breadcrumbs>
    </Box>
  )
}
