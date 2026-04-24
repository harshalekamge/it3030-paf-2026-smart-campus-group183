import { ThemeProvider, extendTheme } from '@mui/material/styles'
import { useMemo } from 'react'
import { brand, gray } from './themePrimitives'

function getTheme(themeComponents = {}) {
  return extendTheme({
    colorSchemes: {
      light: {
        palette: {
          background: {
            default: '#f7f9fc',
            paper: '#ffffff',
          },
          primary: {
            light: brand[300],
            main: brand[500],
            dark: brand[700],
            contrastText: '#ffffff',
          },
          secondary: {
            light: '#80cbc4',
            main: '#00796b',
            dark: '#004d40',
            contrastText: '#ffffff',
          },
          text: {
            primary: gray[900],
            secondary: gray[600],
          },
        },
      },
      dark: {
        palette: {
          background: {
            default: '#0f1722',
            paper: '#111927',
          },
          primary: {
            light: brand[300],
            main: brand[400],
            dark: brand[700],
            contrastText: '#08111f',
          },
          secondary: {
            light: '#80cbc4',
            main: '#4db6ac',
            dark: '#00796b',
            contrastText: '#08111f',
          },
        },
      },
    },
    cssVarPrefix: 'smart-campus',
    components: themeComponents,
    shape: {
      borderRadius: 12,
    },
    typography: {
      fontFamily: '"Public Sans", "Inter", "Segoe UI", sans-serif',
      h1: {
        fontWeight: 700,
      },
      h2: {
        fontWeight: 700,
      },
      h3: {
        fontWeight: 700,
      },
      h4: {
        fontWeight: 700,
      },
    },
  })
}

export default function AppTheme({ children, themeComponents }) {
  const theme = useMemo(() => getTheme(themeComponents), [themeComponents])

  return (
    <ThemeProvider
      theme={theme}
      defaultMode="system"
      disableTransitionOnChange
      noSsr
    >
      {children}
    </ThemeProvider>
  )
}
