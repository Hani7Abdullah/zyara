//MUI
import { Box, CardMedia, Stack, Grid } from '@mui/material';
import { useState } from 'react';

//Components
import LoginForm from '../components/LoginForm';
import ForgotPasswordForm from '../components/ForgotPasswordForm';

//Images
import BG from '../assets/images/login/bg.jpg';
import LOGO from '/logo.png';

export default function Login() {
  const [view, setView] = useState<"login" | "forgot">("login");

  return (
    <Box>
      <Grid container alignItems="center" sx={{ height: "100vh" }}>
        <Grid size={{ xs: 12, md: 6, lg: 7 }}>
          <CardMedia
            component="img"
            image={BG}
            width="100%"
            sx={{
              height: "100vh",
              display: { xs: "none", md: "block" }
            }}
          />
        </Grid>
        <Grid
          size={{ xs: 12, md: 6, lg: 5 }}
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%'
          }}
        >
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            rowGap={6}
            sx={{ 
              width: {
                xs: "80%",
                md: "50%"
              }  
            }}
          >
            <CardMedia
              component="img"
              image={LOGO}
              width="25%"
              sx={{
                objectFit: "contain",
                height: "auto",
                p: 3
              }}
            />

            {view === "login" && <LoginForm onForgot={() => setView("forgot")} />}
            {view === "forgot" && <ForgotPasswordForm onBack={() => setView("login")} />}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
