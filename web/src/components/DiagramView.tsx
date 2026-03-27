import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong'
import type { LandscapeNode, NavEntry } from '../types/landscape'
import { matchDiagramNode } from '../utils/diagramLinks'

interface Props {
  onSelectNode: (node: LandscapeNode, path: NavEntry[]) => void
}

const BASE = import.meta.env.BASE_URL

function fixSvgPaths(raw: string): string {
  return raw
    .replace(/ width="\d+(\.\d+)?pt"/g, ' width="100%"')
    .replace(/ height="\d+(\.\d+)?pt"/g, '')
    .replace(/xlink:href="[^"]*\/images\/([^"]+\.png)"/g, `xlink:href="${BASE}images/$1"`)
    .replace(/(?<!xlink:)href="[^"]*\/images\/([^"]+\.png)"/g, `href="${BASE}images/$1"`)
}

export function DiagramView({ onSelectNode }: Props) {
  const [svgContent, setSvgContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/diagram.svg')
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.text()
      })
      .then(raw => { setSvgContent(fixSvgPaths(raw)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!svgContent || !containerRef.current) return
    const container = containerRef.current
    const groups = container.querySelectorAll<SVGGElement>('g.node')
    const cleanups: (() => void)[] = []

    groups.forEach(g => {
      const texts = [...g.querySelectorAll('text')].map(t => t.textContent ?? '')
      const imgEl = g.querySelector('image')
      const href = imgEl?.getAttribute('xlink:href') ?? imgEl?.getAttribute('href') ?? ''
      const iconFile = href.split('/').pop() ?? null
      const match = matchDiagramNode(texts, iconFile)
      if (!match) return

      g.style.cursor = 'pointer'
      const handler = () => onSelectNode(match.node, match.path)
      g.addEventListener('click', handler)
      cleanups.push(() => g.removeEventListener('click', handler))
    })

    return () => cleanups.forEach(fn => fn())
  }, [svgContent, onSelectNode])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (!svgContent) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography color="text.secondary">
          Diagram not found. Run <code>uv run python AI-Landscape.py</code> to generate it,
          then deploy the updated <code>Final/diagram.svg</code>.
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: 2, border: '1px solid', borderColor: 'divider', overflow: 'hidden', position: 'relative' }}>
      <TransformWrapper
        initialScale={0.6}
        minScale={0.15}
        maxScale={5}
        centerOnInit
        limitToBounds={false}
      >
        {({ zoomIn, zoomOut, resetTransform }) => (
          <>
            <Box sx={{ position: 'absolute', top: 12, right: 12, zIndex: 10, display: 'flex', flexDirection: 'column', gap: 0.5, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 2, p: 0.5 }}>
              <Tooltip title="Zoom in" placement="left">
                <IconButton size="small" onClick={() => zoomIn()}>
                  <AddIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Zoom out" placement="left">
                <IconButton size="small" onClick={() => zoomOut()}>
                  <RemoveIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Reset" placement="left">
                <IconButton size="small" onClick={() => resetTransform()}>
                  <CenterFocusStrongIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <TransformComponent
              wrapperStyle={{ width: '100%', height: '80vh', cursor: 'grab' }}
            >
              <div
                ref={containerRef}
                dangerouslySetInnerHTML={{ __html: svgContent }}
                style={{ userSelect: 'none', lineHeight: 0 }}
              />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </Box>
  )
}
