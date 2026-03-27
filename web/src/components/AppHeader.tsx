import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'

export function AppHeader() {
  return (
    <AppBar position="static" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        <Box
          component="img"
          src="/images/generic.png"
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
      </Toolbar>
    </AppBar>
  )
}
