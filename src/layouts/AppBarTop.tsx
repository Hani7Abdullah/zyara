import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Stack,
  // Badge,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link as MuiLink
} from '@mui/material';
import {
  // NotificationsOutlined as NotificationsIcon,
  Menu as MenuIcon,
  TranslateOutlined as LanguageIcon,
  PersonOutlineRounded as PersonIcon,

} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store/useAppStore';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import { useState } from 'react';
import ProfileModal from '../components/ProfileModal';
// import NotificationMenu from '../components/NotificationMenu';

interface AppBarTopProps {
  drawerWidth: number;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function AppBarTop({ drawerWidth, mobileOpen, setMobileOpen }: AppBarTopProps) {

  const { t, i18n } = useTranslation();
  const setLang = useAppStore((s) => s.setLanguage);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const [profileModalOpen, setProfileModalOpen] = useState(false);
  // const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);
  // const isNotificationOpen = Boolean(notificationAnchorEl);


  // const handleNotificationOpen = (event: React.MouseEvent<HTMLElement>) => {
  //   setNotificationAnchorEl(event.currentTarget);
  // };

  // const handleNotificationClose = () => {
  //   setNotificationAnchorEl(null);
  // };


  // Toggle language
  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
    localStorage.setItem('lang', newLang);
    setLang(newLang as 'en' | 'ar');
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { xs: `calc(100% - 48px)`, md: `calc(100% - ${drawerWidth}px - 48px)` },
          ml: { md: `${drawerWidth}px` },
          bgcolor: theme.palette.background.paper,
          borderRadius: 3,
          boxShadow: "0 1px 4px rgba(0, 0, 0, .2)",
          mr: 3,
          my: 2,
          zIndex: 1,
        }}
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(!mobileOpen)} edge="start">
                <MenuIcon />
              </IconButton>
            )}

            {!isMobile && (
              <Breadcrumbs aria-label="breadcrumb" separator="›" sx={{ color: 'text.primary' }}>
                <MuiLink
                  component={RouterLink}
                  underline="hover"
                  color="inherit"
                  to="/"
                  sx={{ fontWeight: 'bold' }}
                >
                  {t('dashboard')}
                </MuiLink>

                {pathnames.map((value, index) => {
                  const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                  const textKey = value.replace(/-/g, ' ');
                  const isLast = index === pathnames.length - 1;
                  return isLast ? (
                    <Typography key={to} color="text.primary" fontWeight="bold" noWrap>
                      {t(textKey)}
                    </Typography>
                  ) : (
                    <MuiLink
                      key={to}
                      component={RouterLink}
                      underline="hover"
                      color="inherit"
                      to={to}
                      noWrap
                    >
                      {t(textKey)}
                    </MuiLink>
                  );
                })}
              </Breadcrumbs>)}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">

            <IconButton onClick={toggleLang} size="medium">
              <LanguageIcon />
            </IconButton>

            {/* <IconButton size="medium" onClick={handleNotificationOpen}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton> */}

            <IconButton onClick={() => setProfileModalOpen(true)} size="medium">
              <PersonIcon />
            </IconButton>

          </Stack>
        </Toolbar>
      </AppBar>


      <ProfileModal
        open={profileModalOpen}
        onClose={() => setProfileModalOpen(false)}
      />

      {/* <NotificationMenu
        anchorEl={notificationAnchorEl}
        open={isNotificationOpen}
        onClose={handleNotificationClose}
      /> */}
    </>
  );
}
