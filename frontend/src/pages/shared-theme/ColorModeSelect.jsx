import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { styled, useColorScheme } from '@mui/material/styles'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[2],
}))

export default function ColorModeSelect({ sx }) {
  const { mode, setMode } = useColorScheme()

  return (
    <StyledToggleButtonGroup
      exclusive
      size="small"
      value={mode ?? 'system'}
      onChange={(_, value) => {
        if (value) {
          setMode(value)
        }
      }}
      sx={sx}
    >
      <ToggleButton value="light" aria-label="Light mode">
        <LightModeRoundedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="system" aria-label="System mode">
        <SettingsBrightnessRoundedIcon fontSize="small" />
      </ToggleButton>
      <ToggleButton value="dark" aria-label="Dark mode">
        <DarkModeRoundedIcon fontSize="small" />
      </ToggleButton>
    </StyledToggleButtonGroup>
  )
}
