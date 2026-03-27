import { useState } from 'react'
import Card from '@mui/material/Card'
import CardActionArea from '@mui/material/CardActionArea'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import type { LandscapeNode } from '../types/landscape'

interface Props {
  node: LandscapeNode
  onNavigate: (node: LandscapeNode) => void
  size?: 'large' | 'medium' | 'small'
}

export function NodeCard({ node, onNavigate, size = 'medium' }: Props) {
  const [elevated, setElevated] = useState(false)
  const isLeaf = !node.children?.length
  const iconSize = size === 'large' ? 64 : size === 'medium' ? 48 : 40

  const handleClick = () => {
    if (isLeaf && node.docUrl) {
      window.open(node.docUrl, '_blank', 'noopener,noreferrer')
    } else if (!isLeaf) {
      onNavigate(node)
    }
  }

  const handleImgError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.src = node.isAws ? '/images/aws.png' : '/images/generic.png'
  }

  return (
    <Card
      elevation={elevated ? 6 : 2}
      sx={{
        height: '100%',
        border: node.isAws ? '2px solid' : '1px solid',
        borderColor: node.isAws ? 'primary.main' : 'divider',
        transform: elevated ? 'translateY(-3px)' : 'none',
      }}
      onMouseEnter={() => setElevated(true)}
      onMouseLeave={() => setElevated(false)}
    >
      <CardActionArea
        onClick={handleClick}
        sx={{ height: '100%', display: 'flex', alignItems: 'flex-start' }}
      >
        <CardContent sx={{ width: '100%', p: size === 'large' ? 3 : 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
            <Box
              sx={{
                width: iconSize,
                height: iconSize,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Box
                component="img"
                src={`/images/${node.icon}.png`}
                alt={node.label}
                onError={handleImgError}
                sx={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </Box>

            <Box sx={{ textAlign: 'center', width: '100%' }}>
              <Typography
                variant={size === 'large' ? 'h6' : 'subtitle2'}
                component="div"
                sx={{ mb: 0.5, lineHeight: 1.25 }}
              >
                {node.label}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: 'block', lineHeight: 1.4 }}
              >
                {node.shortDesc}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', justifyContent: 'center', mt: 'auto' }}>
              {node.isAws && (
                <Chip
                  label="AWS Native"
                  size="small"
                  sx={{ bgcolor: '#FF9900', color: '#000', fontWeight: 700 }}
                />
              )}
              {isLeaf ? (
                <Chip
                  icon={<OpenInNewIcon sx={{ fontSize: '0.85rem !important' }} />}
                  label="Docs"
                  size="small"
                  variant="outlined"
                  color="primary"
                />
              ) : (
                <Chip
                  icon={<ChevronRightIcon sx={{ fontSize: '0.85rem !important' }} />}
                  label={`${node.children!.length} options`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}
