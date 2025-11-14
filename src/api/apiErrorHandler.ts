import { AxiosError } from "axios";

import { enqueueSnackbar } from "notistack";

import { t } from "i18next";

export const handleApiError = (error: unknown) => {

    let message = t("something-went-wrong");

    if (error instanceof AxiosError) {
        const status = error.response?.status;
        const dataMessage = error.response?.data?.message;

        switch (status) {
            case 401:
                message = dataMessage;
                localStorage.removeItem("token");
                localStorage.removeItem("refresh_token");
                localStorage.removeItem("is_admin");
                window.location.replace("/login");
                break;
            case 403:
                message = dataMessage;
                window.location.replace("/403");
                break;
            case 404:
                message = dataMessage;
                window.location.replace("/404");
                break;
            default:
                message = dataMessage || error.message || t("something-went-wrong");
                break;
        }
    } else if (error instanceof Error) {
        message = error.message;
    } else if (typeof error === "string") {
        message = error;
    }

    // Show notification
    enqueueSnackbar(message, { variant: "error" });

    return message;
};
