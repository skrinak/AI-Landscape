import { useState, useMemo } from 'react'
import Autocomplete from '@mui/material/Autocomplete'
import TextField from '@mui/material/TextField'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import InputAdornment from '@mui/material/InputAdornment'
import { search, type SearchResult } from '../utils/search'

interface Props {
  onSelect: (result: SearchResult) => void
}

export function SearchBar({ onSelect }: Props) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => search(query), [query])

  return (
    <Autocomplete
      freeSolo
      options={results}
      filterOptions={x => x}
      inputValue={query}
      onInputChange={(_, value) => setQuery(value)}
      onChange={(_, value) => {
        if (value && typeof value !== 'string') {
          onSelect(value)
          setQuery('')
        }
      }}
      getOptionLabel={(o) => (typeof o === 'string' ? o : o.node.label)}
      isOptionEqualToValue={(a, b) => a.node.id === b.node.id}
      noOptionsText="No matches"
      renderOption={(props, option) => {
        const { key, ...rest } = props as typeof props & { key: string }
        const breadcrumb = option.path.map(p => p.label).join(' › ')
        return (
          <Box component="li" key={key} {...rest} sx={{ gap: 1.5 }}>
            <Box
              component="img"
              src={`${import.meta.env.BASE_URL}images/${option.node.icon}.png`}
              alt=""
              sx={{ width: 20, height: 20, objectFit: 'contain', flexShrink: 0 }}
            />
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="body2" fontWeight={600} noWrap>
                {option.node.label}
              </Typography>
              {breadcrumb && (
                <Typography variant="caption" color="text.secondary" noWrap display="block">
                  {breadcrumb}
                </Typography>
              )}
            </Box>
          </Box>
        )
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="Search tools, services, frameworks…"
          size="small"
          InputProps={{
            ...params.InputProps,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
        />
      )}
      sx={{ width: '100%', maxWidth: 520 }}
    />
  )
}
