//mui
import { Button, Stack, Box, Typography } from "@mui/material"
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type ErrorModel = {
  title: string,
  description: string,
  status: number,
  layout: 'default' | 'dashboard'
}

const Error = ({ title, description, status, layout }: ErrorModel) => {

  const navigate = useNavigate();

  const { t, i18n } = useTranslation();

  const isArabic:boolean = i18n.language === "ar";

  const goHome = () => {
    navigate("/", { replace: true })
  }

  return (

    <Stack
      direction="row"
      alignItems="center"
      justifyContent="center"
      height="100%"
      width="100%"
    >
      <Box
        sx={{
          position: "absolute",
          left: "50%",
          top: "50%",
          ...(layout === "dashboard" && {
            transform: `translate(calc(${isArabic ? "50% - 125px" : "-50% + 125px"}), -25%)`,
          }),
          ...(layout === "default" && {
            transform: `translate(calc(${isArabic ? "50%" : "-50%"}), -25%)`,
          }),
          maxWidth: "920px",
          width: "100%",
          lineHeight: 1.4,
          textAlign: "center",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            height: "100px",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: -1,
          }}
        >
          <Typography
            variant="h1"
            sx={{
              color: "#ececec",
              fontWeight: 900,
              fontSize: {
                xs: "185px",
                md: "276px"
              },
              m: 0,
              position: "absolute",
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            {status}
          </Typography>
        </Box>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            fontSize: {
              xs: "30px",
              md: "42px",
            },
            textTransform: "uppercase",
            m: 0,
          }}
        >
          {title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: "text.primary",
            lineHeight: "2em",
            mt: 2,
            mb: 5,
            fontSize: {
              xs: "17px",
              md: "19px",
            },
          }}
        >
          {description}
        </Typography>
        <Stack
          direction="row"
          justifyContent="center"
          width="100%"
          mt={10}
        >
          <Button
            variant="contained"
            onClick={goHome}
            sx={{
              p: 1.6
            }}
          >
            {t("error.home-back")}
          </Button>
        </Stack>
      </Box>
    </Stack>
  );
};

export default Error