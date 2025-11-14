import { useState } from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  useTheme,
  CardMedia,
  Stack,
} from '@mui/material';
import { Logout } from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useTranslation } from 'react-i18next';
import { useFilteredSidebarMenu } from '../constants/sidebarMenu';
import LogoutConfirmation from '../components/LogoutConfirmation';
import { handleApiSuccess } from '../api/apiSuccessHandler';


const drawerWidth = 250;

export default function Sidebar() {
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const theme = useTheme();
  const menu = useFilteredSidebarMenu();
  
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  const confirmLogout = () => {
    const success = logout();
    if(success) {
      handleApiSuccess(t("success-logout"));
      navigate('/login');
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxShadow: 2,
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          bgcolor: theme.palette.background.paper,
          zIndex: 2
        },
      }}
    >
      {/* Top logo + menu */}
      <Box>
        <Stack direction="row" justifyContent="center" alignItems="center" sx={{ py: 3, px: 2 }}>
          <CardMedia
            component="img"
            image="/logo.png"
            alt="Logo"
            sx={{ width: '70%', height: 'auto' }}
            onClick={()=>navigate('/')}
          />
        </Stack>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <List sx={{ pt: 3, mx: 2 }}>
          {menu.map((item) => {
            const active = isActive(item.path);
            return (
              <ListItemButton
                key={item.textKey}
                component={Link}
                to={item.path}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: active ? theme.palette.primary.main : 'transparent',
                  color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                  '&:hover': {
                    bgcolor: active
                      ? theme.palette.primary.main
                      : theme.palette.action.hover,
                    color: active
                      ? theme.palette.primary.contrastText
                      : theme.palette.text.secondary,
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: active ? theme.palette.primary.contrastText : theme.palette.text.secondary,
                    minWidth: "max-content",
                    mr: 2
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={t(item.textKey.toLocaleLowerCase())}
                  slotProps={{
                    primary: {
                      fontWeight: active ? "bold" : "normal"
                    }
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      {/* Bottom logout */}
      <Box sx={{ px: 2, py: 1, }}>
        <Divider />
        <ListItemButton
          onClick={() => setLogoutModalOpen(true)}
          sx={{
            mt: .5,
            width: "max-content",
            mx: "auto",
            color: theme.palette.error.main,
            "&:hover": {
              bgcolor: "inherit"
            }
          }}
        >
          <ListItemIcon sx={{ color: theme.palette.error.dark, minWidth: "max-content", mr: 2 }}>
            <Logout />
          </ListItemIcon>
          <ListItemText
            primary={t('logout')}
          />
        </ListItemButton>
      </Box>
      <LogoutConfirmation
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
      />
    </Drawer>
  );
}
