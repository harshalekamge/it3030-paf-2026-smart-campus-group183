import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CssBaseline from '@mui/material/CssBaseline'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import MuiCard from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../auth/AuthContext'
import AppTheme from '../shared-theme/AppTheme'
import ColorModeSelect from '../shared-theme/ColorModeSelect'
import { GoogleIcon, SitemarkIcon } from './components/CustomIcons'

const Card = styled(MuiCard)(({ theme }) => ({
  alignSelf: 'center',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  margin: 'auto',
  padding: theme.spacing(4),
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    width: '450px',
  },
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}))

const SignUpContainer = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    content: '""',
    display: 'block',
    inset: 0,
    position: 'absolute',
    zIndex: -1,
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}))

export default function SignUp(props) {
  const { signInWithGoogle } = useAuth()

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <ColorModeSelect sx={{ position: 'fixed', top: '1rem', right: '1rem' }} />
      <SignUpContainer direction="column" sx={{ justifyContent: 'space-between' }}>
        <Card variant="outlined">
          <SitemarkIcon />
          <Typography
            component="h1"
            variant="h4"
            sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
          >
            Join with Google
          </Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Your Smart Campus profile is created the first time you continue with
            Google. No separate password form is needed in this frontend.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              onClick={signInWithGoogle}
              startIcon={<GoogleIcon />}
            >
              Continue with Google
            </Button>
            <Button component={RouterLink} to="/signin" fullWidth variant="outlined">
              Already have access? Sign in
            </Button>
          </Box>
          <Typography sx={{ textAlign: 'center' }}>
            Want to explore first?{' '}
            <Link component={RouterLink} to="/" variant="body2">
              Return to the marketing page
            </Link>
          </Typography>
        </Card>
      </SignUpContainer>
    </AppTheme>
  )
}
