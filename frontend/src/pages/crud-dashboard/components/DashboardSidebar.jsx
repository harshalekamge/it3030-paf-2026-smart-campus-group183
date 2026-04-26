import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Toolbar from '@mui/material/Toolbar';

import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import CategoryIcon from '@mui/icons-material/Category';
import ChairAltIcon from '@mui/icons-material/ChairAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BuildIcon from '@mui/icons-material/Build';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../auth/AuthContext';
import DashboardSidebarContext from '../context/DashboardSidebarContext';
import { DRAWER_WIDTH, MINI_DRAWER_WIDTH } from '../constants';
import DashboardSidebarPageItem from './DashboardSidebarPageItem';
import DashboardSidebarHeaderItem from './DashboardSidebarHeaderItem';
import {
  getDrawerSxTransitionMixin,
  getDrawerWidthTransitionMixin,
} from '../mixins';

function DashboardSidebar({
  expanded = true,
  setExpanded,
  disableCollapsibleSidebar = false,
  container,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isAdmin, logout, user } = useAuth();

  const { pathname } = useLocation();

  const [expandedItemIds, setExpandedItemIds] = React.useState([]);
  const [profileMenuAnchor, setProfileMenuAnchor] = React.useState(null);

  const isOverSmViewport = useMediaQuery(theme.breakpoints.up('sm'));
  const isOverMdViewport = useMediaQuery(theme.breakpoints.up('md'));

  const [isFullyExpanded, setIsFullyExpanded] = React.useState(expanded);
  const [isFullyCollapsed, setIsFullyCollapsed] = React.useState(!expanded);

  React.useEffect(() => {
    if (expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyExpanded(true);
      }, theme.transitions.duration.enteringScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyExpanded(false);

    return () => {};
  }, [expanded, theme.transitions.duration.enteringScreen]);

  React.useEffect(() => {
    if (!expanded) {
      const drawerWidthTransitionTimeout = setTimeout(() => {
        setIsFullyCollapsed(true);
      }, theme.transitions.duration.leavingScreen);

      return () => clearTimeout(drawerWidthTransitionTimeout);
    }

    setIsFullyCollapsed(false);

    return () => {};
  }, [expanded, theme.transitions.duration.leavingScreen]);

  const mini = !disableCollapsibleSidebar && !expanded;

  const handleSetSidebarExpanded = React.useCallback(
    (newExpanded) => () => {
      setExpanded(newExpanded);
    },
    [setExpanded],
  );

  const handlePageItemClick = React.useCallback(
    (itemId, hasNestedNavigation) => {
      if (hasNestedNavigation && !mini) {
        setExpandedItemIds((previousValue) =>
          previousValue.includes(itemId)
            ? previousValue.filter(
                (previousValueItemId) => previousValueItemId !== itemId,
              )
            : [...previousValue, itemId],
        );
      } else if (!isOverSmViewport && !hasNestedNavigation) {
        setExpanded(false);
      }
    },
    [mini, setExpanded, isOverSmViewport],
  );

  const hasDrawerTransitions =
    isOverSmViewport && (!disableCollapsibleSidebar || isOverMdViewport);

  const userDisplayName = React.useMemo(() => {
    if (!user) {
      return 'Guest user';
    }

    return (
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(' ') ||
      user.email ||
      'Campus user'
    );
  }, [user]);

  const userRoleLabel = React.useMemo(() => {
    if (!user?.role) {
      return 'Signed in';
    }

    return String(user.role).replace(/_/g, ' ');
  }, [user]);

  const handleLogout = React.useCallback(async () => {
    setProfileMenuAnchor(null);
    await logout();
    navigate('/signin');
  }, [logout, navigate]);

  const handleOpenProfileMenu = React.useCallback((event) => {
    setProfileMenuAnchor(event.currentTarget);
  }, []);

  const handleCloseProfileMenu = React.useCallback(() => {
    setProfileMenuAnchor(null);
  }, []);

  const getDrawerContent = React.useCallback(
    (viewport) => (
      <React.Fragment>
        <Toolbar />
        <Box
          component="nav"
          aria-label={`${viewport.charAt(0).toUpperCase()}${viewport.slice(1)}`}
          sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'auto',
            scrollbarGutter: mini ? 'stable' : 'auto',
            overflowX: 'hidden',
            pt: !mini ? 0 : 2,
            ...(hasDrawerTransitions
              ? getDrawerSxTransitionMixin(isFullyExpanded, 'padding')
              : {}),
          }}
        >
          <List
            dense
            sx={{
              padding: mini ? 0 : 0.5,
              width: mini ? MINI_DRAWER_WIDTH : 'auto',
            }}
          >
            <DashboardSidebarHeaderItem>Main items</DashboardSidebarHeaderItem>
            <DashboardSidebarPageItem
              id="resources"
              title="Resources"
              icon={<MeetingRoomIcon />}
              href="/dashboard/resources"
              selected={!!matchPath('/dashboard/resources/*', pathname)}
            />
            <DashboardSidebarPageItem
              id="resource-types"
              title="Resource Types"
              icon={<CategoryIcon />}
              href="/dashboard/resource-types"
              selected={!!matchPath('/dashboard/resource-types/*', pathname)}
            />
            <DashboardSidebarPageItem
              id="amenities"
              title="Amenities"
              icon={<ChairAltIcon />}
              href="/dashboard/amenities"
              selected={!!matchPath('/dashboard/amenities/*', pathname)}
            />
            <DashboardSidebarPageItem
              id="availability-windows"
              title="Availability Windows"
              icon={<AccessTimeIcon />}
              href="/dashboard/availability-windows"
              selected={!!matchPath('/dashboard/availability-windows/*', pathname)}
            />
            <DashboardSidebarPageItem
              id="resource-media"
              title="Resource Media"
              icon={<PermMediaIcon />}
              href="/dashboard/resource-media"
              selected={!!matchPath('/dashboard/resource-media/*', pathname)}
            />
            <DashboardSidebarPageItem
              id="maintenance-logs"
              title="Maintenance Logs"
              icon={<BuildIcon />}
              href="/dashboard/maintenance-logs"
              selected={!!matchPath('/dashboard/maintenance-logs/*', pathname)}
            />
            {isAdmin ? (
              <React.Fragment>
                <DashboardSidebarHeaderItem>Admin only</DashboardSidebarHeaderItem>
                <DashboardSidebarPageItem
                  id="users"
                  title="User Management"
                  icon={<AdminPanelSettingsIcon />}
                  href="/dashboard/users"
                  selected={!!matchPath('/dashboard/users/*', pathname)}
                />
              </React.Fragment>
            ) : null}
          </List>
          <Box
            sx={{
              px: mini ? 0.75 : 1.25,
              pb: 1.25,
              pt: 1,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: mini ? 0 : 1.25,
                justifyContent: mini ? 'center' : 'flex-start',
                px: mini ? 0.5 : 1,
                py: 1,
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2.5,
                backgroundColor: 'background.paper',
                boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06)',
              }}
            >
              <Tooltip title="Profile options" placement={mini ? 'right' : 'top'}>
                <IconButton
                  onClick={handleOpenProfileMenu}
                  aria-label="Open profile menu"
                  sx={{
                    p: 0,
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: '50%',
                    flexShrink: 0,
                  }}
                >
                  <Avatar
                    src={user?.profilePictureUrl ?? undefined}
                    alt={userDisplayName}
                    sx={{
                      width: mini ? 36 : 42,
                      height: mini ? 36 : 42,
                      bgcolor: 'primary.main',
                      flexShrink: 0,
                    }}
                  >
                    {userDisplayName.charAt(0).toUpperCase()}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={profileMenuAnchor}
                open={Boolean(profileMenuAnchor)}
                onClose={handleCloseProfileMenu}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                sx={{
                  '& .MuiPaper-root': {
                    minWidth: 140,
                  },
                }}
              >
                <MenuItem onClick={handleLogout}>
                  <LogoutRoundedIcon fontSize="small" sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
              {!mini ? (
                <Box sx={{ minWidth: 0, flex: 1 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      fontWeight: 700,
                      lineHeight: 1.2,
                    }}
                    noWrap
                  >
                    {userDisplayName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      lineHeight: 1.25,
                      mt: 0.25,
                      fontSize: '0.8rem',
                      whiteSpace: 'normal',
                      overflowWrap: 'anywhere',
                      wordBreak: 'break-word',
                    }}
                  >
                    {user?.email ?? 'No email available'}
                  </Typography>
                  <Chip
                    label={userRoleLabel}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ mt: 1, textTransform: 'capitalize' }}
                  />
                </Box>
              ) : null}
            </Box>
          </Box>
        </Box>
      </React.Fragment>
    ),
    [
      mini,
      hasDrawerTransitions,
      isFullyExpanded,
      expandedItemIds,
      pathname,
      isAdmin,
      handleLogout,
      handleCloseProfileMenu,
      handleOpenProfileMenu,
      user,
      userDisplayName,
      userRoleLabel,
      profileMenuAnchor,
    ],
  );

  const getDrawerSharedSx = React.useCallback(
    (isTemporary) => {
      const drawerWidth = mini ? MINI_DRAWER_WIDTH : DRAWER_WIDTH;

      return {
        displayPrint: 'none',
        width: drawerWidth,
        flexShrink: 0,
        ...getDrawerWidthTransitionMixin(expanded),
        ...(isTemporary ? { position: 'absolute' } : {}),
        [`& .MuiDrawer-paper`]: {
          position: 'absolute',
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundImage: 'none',
          ...getDrawerWidthTransitionMixin(expanded),
        },
      };
    },
    [expanded, mini],
  );

  const sidebarContextValue = React.useMemo(() => {
    return {
      onPageItemClick: handlePageItemClick,
      mini,
      fullyExpanded: isFullyExpanded,
      fullyCollapsed: isFullyCollapsed,
      hasDrawerTransitions,
    };
  }, [
    handlePageItemClick,
    mini,
    isFullyExpanded,
    isFullyCollapsed,
    hasDrawerTransitions,
  ]);

  return (
    <DashboardSidebarContext.Provider value={sidebarContextValue}>
      <Drawer
        container={container}
        variant="temporary"
        open={expanded}
        onClose={handleSetSidebarExpanded(false)}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: {
            xs: 'block',
            sm: disableCollapsibleSidebar ? 'block' : 'none',
            md: 'none',
          },
          ...getDrawerSharedSx(true),
        }}
      >
        {getDrawerContent('phone')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: {
            xs: 'none',
            sm: disableCollapsibleSidebar ? 'none' : 'block',
            md: 'none',
          },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent('tablet')}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          ...getDrawerSharedSx(false),
        }}
      >
        {getDrawerContent('desktop')}
      </Drawer>
    </DashboardSidebarContext.Provider>
  );
}

DashboardSidebar.propTypes = {
  container: (props, propName) => {
    if (props[propName] == null) {
      return null;
    }
    if (typeof props[propName] !== 'object' || props[propName].nodeType !== 1) {
      return new Error(`Expected prop '${propName}' to be of type Element`);
    }
    return null;
  },
  disableCollapsibleSidebar: PropTypes.bool,
  expanded: PropTypes.bool,
  setExpanded: PropTypes.func.isRequired,
};

export default DashboardSidebar;
