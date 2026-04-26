import * as React from 'react'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded'
import IconButton from '@mui/material/IconButton'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import { useColorScheme } from '@mui/material/styles'

function getModeIcon(mode) {
  if (mode === 'dark') {
    return <DarkModeRoundedIcon fontSize="small" />
  }

  if (mode === 'light') {
    return <LightModeRoundedIcon fontSize="small" />
  }

  return <SettingsBrightnessRoundedIcon fontSize="small" />
}

export default function ColorModeIconDropdown({ size = 'small' }) {
  const { mode, setMode } = useColorScheme()
  const [anchorEl, setAnchorEl] = React.useState(null)

  const open = Boolean(anchorEl)

  return (
    <React.Fragment>
      <Tooltip title="Change color mode" enterDelay={1000}>
        <IconButton
          size={size}
          aria-label="Change color mode"
          onClick={(event) => setAnchorEl(event.currentTarget)}
        >
          {getModeIcon(mode)}
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {[
          ['light', 'Light'],
          ['system', 'System'],
          ['dark', 'Dark'],
        ].map(([value, label]) => (
          <MenuItem
            key={value}
            selected={(mode ?? 'system') === value}
            onClick={() => {
              setMode(value)
              setAnchorEl(null)
            }}
          >
            {getModeIcon(value)}
            <Typography sx={{ ml: 1 }}>{label}</Typography>
          </MenuItem>
        ))}
      </Menu>
    </React.Fragment>
  )
}
