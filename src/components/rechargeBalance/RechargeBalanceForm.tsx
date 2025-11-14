//React
import { useEffect } from "react";
import { useForm } from "react-hook-form";

//MUI
import { Button, Stack, TextField, Typography, Grid } from "@mui/material";

//i18next
import { useTranslation } from "react-i18next";

//Components
import EntityModalForm from "../EntityModal";
import ViewTable from "../ViewTable";

//Types
import type { RechargeBalanceModel } from "../../types/rechargeBalance";
import type { CRUDMode } from "../../types/common";

//Props
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: Partial<RechargeBalanceModel>) => void;
  mode: CRUDMode;
  initialData?: Partial<RechargeBalanceModel>;
}

export default function RechargeBalanceForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: Props) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Partial<RechargeBalanceModel>>({
    defaultValues: {},
  });

  useEffect(() => {
    if (mode === "create") {
      reset({ amount: 0 });
    } else {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const isView = mode === "view";

  const onSubmit = (data: Partial<RechargeBalanceModel>) => {
    onConfirm(data);
    reset();
  };

  const handleClose = () => {
    onClose();
    reset();
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("rechargeBalance")}`}
    >
      {mode === "delete" ? (
        <Stack spacing={3}>
          <Typography>{t("rechargeBalance.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined">
              {t("cancel")}
            </Button>
            <Button onClick={() => onConfirm()} variant="contained" color="error">
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : isView && initialData ? (
        <ViewTable
          rows={[
            { label: t("shared.recipient_mobile_number"), value: initialData.recipient_mobile_number },
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t("shared.recipient_mobile_number")}
                  {...register("recipient_mobile_number", {
                    required: t("validation.required") as string,
                  })}
                  error={!!errors.recipient_mobile_number}
                  helperText={errors.recipient_mobile_number?.message}
                  fullWidth
                  size="small"
                  disabled={isView}
                />
              </Grid>
            </Grid>

            {!isView && (
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button onClick={handleClose} variant="outlined">
                  {t("cancel")}
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  {t(mode === "create" ? "create" : "update")}
                </Button>
              </Stack>
            )}
          </Stack>
        </form>
      )}
    </EntityModalForm>
  );
}
