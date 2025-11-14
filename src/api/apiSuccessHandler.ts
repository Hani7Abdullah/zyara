import { enqueueSnackbar } from "notistack";
import { t } from "i18next";

export const handleApiSuccess = (message?: string) => {
  const msg = message || t("operation-successful"); 
  enqueueSnackbar(msg, { variant: "success" });
  return msg;
};
