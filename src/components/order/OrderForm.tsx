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
import type { OrderModel } from "../../types/order";
import type { CRUDMode } from "../../types/common";

//Props
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: Partial<OrderModel>) => void;
  mode: CRUDMode;
  initialData?: Partial<OrderModel>;
}

export default function OrderForm({
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
  } = useForm<Partial<OrderModel>>({
    defaultValues: {},
  });

  useEffect(() => {
    if (mode === "create") {
      reset({ order_number: "" });
    } else {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const isView = mode === "view";

  const onSubmit = (data: Partial<OrderModel>) => {
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
      title={`${t(mode)} ${t("order")}`}
    >
      {mode === "delete" ? (
        <Stack spacing={3}>
          <Typography>{t("order.confirmDelete")}</Typography>
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
            { label: t("shared.order_number"), value: initialData.order_number },
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t("shared.order_number")}
                  {...register("order_number", {
                    required: t("validation.required") as string,
                  })}
                  error={!!errors.order_number}
                  helperText={errors.order_number?.message}
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
