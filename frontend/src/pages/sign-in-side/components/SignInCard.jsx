import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import MuiCard from '@mui/material/Card'
import Divider from '@mui/material/Divider'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import { Link as RouterLink } from 'react-router-dom'
import { useAuth } from '../../../auth/AuthContext'
import { GoogleIcon, SitemarkIcon } from './CustomIcons'

const Card = styled(MuiCard)(({ theme }) => ({
  alignSelf: 'center',
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
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

export default function SignInCard() {
  const { signInWithGoogle } = useAuth()

  return (
    <Card variant="outlined">
      <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
        <SitemarkIcon />
      </Box>
      <Typography
        component="h1"
        variant="h4"
        sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
      >
        Sign in
      </Typography>
      <Typography sx={{ color: 'text.secondary' }}>
        Continue with your Google account to open the Smart Campus dashboard.
      </Typography>
      <Button
        fullWidth
        variant="contained"
        size="large"
        onClick={signInWithGoogle}
        startIcon={<GoogleIcon />}
      >
        Continue with Google
      </Button>
      <Divider>or</Divider>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Button component={RouterLink} to="/" fullWidth variant="outlined">
          Back to marketing page
        </Button>
        <Typography sx={{ textAlign: 'center' }}>
          Need a first-time account?{' '}
          <Link component={RouterLink} to="/signup" variant="body2">
            Create access with Google
          </Link>
        </Typography>
      </Box>
    </Card>
  )
}
