import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { Link as RouterLink } from 'react-router-dom';
import { useColorScheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';

const navigationItems = [
  { label: 'Features', href: '#features' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Highlights', href: '#highlights' },
  { label: 'FAQ', href: '#faq' },
];

const StyledToolbar = styled(Toolbar, {
  shouldForwardProp: (prop) => prop !== 'darkSurface',
})(({ theme, darkSurface }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: darkSurface
    ? 'hsla(220, 20%, 80%, 0.16)'
    : (theme.vars || theme).palette.divider,
  backgroundColor: darkSurface
    ? 'rgba(15, 23, 34, 0.82)'
    : theme.vars
      ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
      : alpha(theme.palette.background.default, 0.4),
  boxShadow: darkSurface
    ? '0 16px 40px rgba(8, 15, 28, 0.28)'
    : (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppAppBar() {
  const [open, setOpen] = React.useState(false);
  const [isOverHighlights, setIsOverHighlights] = React.useState(false);
  const appBarRef = React.useRef(null);
  const { mode, systemMode } = useColorScheme();

  const resolvedMode = mode === 'system' ? systemMode : mode;
  const useDarkSurface = resolvedMode !== 'dark' && isOverHighlights;

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  React.useEffect(() => {
    const updateOverlap = () => {
      const appBar = appBarRef.current;
      const overlapTargets = ['highlights']
        .map((id) => document.getElementById(id))
        .filter(Boolean);

      if (!appBar || overlapTargets.length === 0) {
        setIsOverHighlights(false);
        return;
      }

      const appBarRect = appBar.getBoundingClientRect();
      const overlaps = overlapTargets.some((section) => {
        const sectionRect = section.getBoundingClientRect();

        return sectionRect.top < appBarRect.bottom && sectionRect.bottom > appBarRect.top;
      });

      setIsOverHighlights(overlaps);
    };

    updateOverlap();
    window.addEventListener('scroll', updateOverlap, { passive: true });
    window.addEventListener('resize', updateOverlap);

    return () => {
      window.removeEventListener('scroll', updateOverlap);
      window.removeEventListener('resize', updateOverlap);
    };
  }, []);

  return (
    <AppBar
      ref={appBarRef}
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
        mt: 'calc(var(--template-frame-height, 0px) + 28px)',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters darkSurface={useDarkSurface}>
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Box
              component="a"
              href="http://localhost:5173/"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                flexShrink: 0,
                textDecoration: 'none',
                color: useDarkSurface ? 'common.white' : 'inherit',
              }}
            >
              <Sitemark iconOnly />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                  color: useDarkSurface ? 'common.white' : 'primary.main',
                }}
              >
                UniFlow
              </Typography>
            </Box>
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
                alignItems: 'center',
                gap: 0.5,
                pl: 3,
              }}
            >
              {navigationItems.map((item) => (
                <Button
                  key={item.href}
                  variant="text"
                  color="info"
                  size="small"
                  component="a"
                  href={item.href}
                  sx={{
                    minWidth: 0,
                    px: 1.5,
                    py: 0.75,
                    lineHeight: 1,
                    fontWeight: 700,
                    letterSpacing: '-0.01em',
                    color: useDarkSurface ? 'grey.100' : undefined,
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              gap: 1,
              alignItems: 'center',
            }}
          >
            <Button
              color="primary"
              variant="outlined"
              size="small"
              component={RouterLink}
              to="/dashboard"
              sx={
                useDarkSurface
                  ? {
                      color: 'common.white',
                      borderColor: 'hsla(220, 20%, 80%, 0.28)',
                    }
                  : undefined
              }
            >
              Dashboard
            </Button>
            <Button
              color="primary"
              variant="text"
              size="small"
              component={RouterLink}
              to="/signin"
              sx={useDarkSurface ? { color: 'grey.100' } : undefined}
            >
              Sign in
            </Button>
            <Button
              color="primary"
              variant="contained"
              size="small"
              component={RouterLink}
              to="/signup"
            >
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              slotProps={{
                paper: {
                  sx: {
                    top: 'var(--template-frame-height, 0px)',
                  },
                },
              }}
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                  }}
                >
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {navigationItems.map((item) => (
                  <MenuItem
                    key={item.href}
                    component="a"
                    href={item.href}
                    onClick={toggleDrawer(false)}
                  >
                    {item.label}
                  </MenuItem>
                ))}
                <Divider sx={{ my: 3 }} />
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    component={RouterLink}
                    to="/dashboard"
                  >
                    Dashboard
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    component={RouterLink}
                    to="/signup"
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    component={RouterLink}
                    to="/signin"
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
