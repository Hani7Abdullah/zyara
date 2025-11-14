//React
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

//MUI
import { Box, Drawer, useTheme, useMediaQuery, Stack } from '@mui/material';

//Components
import AppBarTop from './AppBarTop';
import Sidebar from './Sidebar';
import { useAuthStore } from '../store/useAuthStore';

//Contstant
const drawerWidth = 250;

export default function DashboardLayout() {

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const fetchProfile = useAuthStore((s) => s.fetchProfile);

    useEffect(() => {
      fetchProfile()
    }, []);

  return (
    <Stack direction="row">
      
      {/* Responsive Sidebar Drawer */}
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}>
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
        >
          <Sidebar />
        </Drawer>
      </Box>

      <Stack sx={{ flexGrow: 1 }}>
        
        {/* Top AppBar */}
        <AppBarTop drawerWidth={drawerWidth} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Content */}
        <Box component="main" sx={{ p: 3, mt: 12 }}>
          <Outlet />
        </Box>
      </Stack>
    </Stack>
  );
}
