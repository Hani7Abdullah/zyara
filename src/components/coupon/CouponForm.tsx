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
import type { CouponModel } from "../../types/coupon";
import type { CRUDMode } from "../../types/common";

//Props
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: Partial<CouponModel>) => void;
  mode: CRUDMode;
  initialData?: Partial<CouponModel>;
}

export default function CouponForm({
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
  } = useForm<Partial<CouponModel>>({
    defaultValues: {},
  });

  useEffect(() => {
    if (mode === "create") {
      reset({ name: ""});
    } else {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const isView = mode === "view";

  const onSubmit = (data: Partial<CouponModel>) => {
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
      title={`${t(mode)} ${t("coupon")}`}
    >
      {mode === "delete" ? (
        <Stack spacing={3}>
          <Typography>{t("coupon.confirmDelete")}</Typography>
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
            { label: t("shared.name"), value: initialData.name },
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t("shared.name")}
                  {...register("name", {
                    required: t("validation.required") as string,
                  })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
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
