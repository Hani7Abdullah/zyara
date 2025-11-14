import { Box, CardMedia, useTheme, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';
import Logo from '/favicon.png';
import { useTranslation } from 'react-i18next';

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

export default function LoadingPage() {

  const theme = useTheme();

  const { t } = useTranslation();

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection="column"
      height="100vh"
      bgcolor={theme.palette.background.default}
    >
      <CardMedia
        component="img"
        image={Logo}
        alt="Logo"
        sx={{
          width: 100,
          height: 100,
          animation: `${float} 2s ease-in-out infinite`,
          mb: 3,
          objectFit: "contain"
        }}
      />
      <Typography>{`${t("loading")}...`}</Typography>
    </Box>
  );
}
