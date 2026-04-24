import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import SettingsBrightnessRoundedIcon from '@mui/icons-material/SettingsBrightnessRounded'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import { styled, useColorScheme } from '@mui/material/styles'

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.paperChannel} / 0.88)`
    : theme.palette.background.paper,
  backdropFilter: 'blur(12px)',
  border: `1px solid ${(theme.vars ?? theme).palette.divider}`,
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[4],
  padding: theme.spacing(0.5),
  '& .MuiToggleButtonGroup-grouped': {
    border: 0,
    borderRadius: theme.shape.borderRadius * 1.5,
    color: (theme.vars ?? theme).palette.text.secondary,
    paddingInline: theme.spacing(1.25),
    '&:hover': {
      backgroundColor: (theme.vars ?? theme).palette.action.hover,
      color: (theme.vars ?? theme).palette.text.primary,
    },
  },
  '& .MuiToggleButtonGroup-grouped.Mui-selected': {
    backgroundColor: (theme.vars ?? theme).palette.primary.main,
    boxShadow: theme.shadows[1],
    color: (theme.vars ?? theme).palette.primary.contrastText,
  },
  '& .MuiToggleButtonGroup-grouped.Mui-selected:hover': {
    backgroundColor: (theme.vars ?? theme).palette.primary.dark,
  },
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
