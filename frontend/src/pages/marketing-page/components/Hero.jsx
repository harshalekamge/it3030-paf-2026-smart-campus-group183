import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import heroCampusImage from '../../../assets/hero-campus.jpg';

const StyledBox = styled('div')(({ theme }) => ({
  alignSelf: 'center',
  width: '100%',
  height: 400,
  marginTop: theme.spacing(8),
  borderRadius: (theme.vars || theme).shape.borderRadius,
  outline: '6px solid',
  outlineColor: 'hsla(220, 25%, 80%, 0.2)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.grey[200],
  boxShadow: '0 0 12px 8px hsla(220, 25%, 80%, 0.2)',
  backgroundImage: `url(${heroCampusImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  [theme.breakpoints.up('sm')]: {
    marginTop: theme.spacing(10),
    height: 700,
  },
  ...theme.applyStyles('dark', {
    boxShadow: '0 0 24px 12px hsla(210, 100%, 25%, 0.2)',
    backgroundImage: `url(${heroCampusImage})`,
    outlineColor: 'hsla(220, 20%, 42%, 0.1)',
    borderColor: (theme.vars || theme).palette.grey[700],
  }),
}));

export default function Hero() {
  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '78%' } }}
        >
          <Typography
            variant="h1"
            sx={{
              textAlign: 'center',
              fontSize: 'clamp(2.8rem, 10vw, 4.4rem)',
              fontWeight: 800,
              letterSpacing: '-0.04em',
            }}
          >
            UniFlow Campus System
          </Typography>
          <Typography
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              width: { sm: '100%', md: '82%' },
              fontSize: 'clamp(1rem, 2.6vw, 1.3rem)',
            }}
          >
            Streamlining campus operations in one place.
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            useFlexGap
            sx={{
              pt: 2,
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Button
              variant="contained"
              color="primary"
              size="large"
              component={RouterLink}
              to="/dashboard/resources"
              sx={{ minWidth: 190 }}
            >
              Browse Resources
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/dashboard/resources"
              sx={{ minWidth: 190 }}
            >
              Book a Resource
            </Button>
            <Button
              variant="outlined"
              color="primary"
              size="large"
              component={RouterLink}
              to="/dashboard/maintenance-logs/new"
              sx={{ minWidth: 190 }}
            >
              Report Issue
            </Button>
          </Stack>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', color: 'text.secondary', pt: 0.5 }}
          >
            <NotificationsActiveRoundedIcon color="primary" sx={{ fontSize: 20 }} />
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Stay updated with real-time notifications
            </Typography>
          </Stack>
        </Stack>
        <StyledBox id="image" />
      </Container>
    </Box>
  );
}
