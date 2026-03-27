import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import ToggleButton from '@mui/material/ToggleButton'
import GridViewIcon from '@mui/icons-material/GridView'
import AccountTreeIcon from '@mui/icons-material/AccountTree'

interface Props {
  view: 'browse' | 'diagram'
  onViewChange: (v: 'browse' | 'diagram') => void
}

export function AppHeader({ view, onViewChange }: Props) {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component="img"
          src={`${import.meta.env.BASE_URL}images/generic.png`}
          alt="AI Landscape"
          sx={{ width: 32, height: 32, objectFit: 'contain', filter: 'brightness(0) invert(1)', opacity: 0.85 }}
        />
        <Box>
          <Typography variant="h6" component="div" sx={{ color: '#FF9900', lineHeight: 1.1 }}>
            AI Landscape
          </Typography>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', lineHeight: 1 }}>
            AWS-biased builder's reference
          </Typography>
        </Box>
        <Box sx={{ ml: 'auto' }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={(_, v) => { if (v) onViewChange(v) }}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                color: 'rgba(255,255,255,0.6)',
                borderColor: 'rgba(255,255,255,0.2)',
                px: 1.5,
                py: 0.5,
              },
              '& .Mui-selected': {
                color: '#FF9900 !important',
                bgcolor: 'rgba(255,153,0,0.12) !important',
              },
            }}
          >
            <ToggleButton value="browse">
              <GridViewIcon fontSize="small" sx={{ mr: 0.75 }} />
              Browse
            </ToggleButton>
            <ToggleButton value="diagram">
              <AccountTreeIcon fontSize="small" sx={{ mr: 0.75 }} />
              Diagram
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
