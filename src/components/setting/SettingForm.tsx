// React
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// MUI
import {
  Button,
  Stack,
  TextField,
  Grid,
  CircularProgress,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";

// Store & Types
import type { SettingModel } from "../../types/setting";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data:Partial<SettingModel>, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<SettingModel>;
}

export default function SettingForm({
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
  } = useForm<Partial<SettingModel> & { image?: File | null | string }>({
    defaultValues: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);


  const onSubmit = async (data: Partial<SettingModel>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(data, initialData?.id?.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onClose();
      reset();
    }
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("setting.title")}`}
    >

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" rowGap={3}>
          <Grid container>

            {/* Value */}
            <Grid size={{ xs: 12 }} sx={{ pt: 1 }}>
              <TextField
                label={t("shared.value")}
                {...register("value", { required: t("validation.required") as string })}
                error={!!errors.value}
                helperText={errors.value?.message}
                fullWidth
                size="small"
                disabled={isSubmitting}
              />
            </Grid>

          </Grid>

          {/* Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined}
            >
              {t("update")}
            </Button>
          </Stack>
        </Stack>
      </form>
    </EntityModalForm>
  );
}
