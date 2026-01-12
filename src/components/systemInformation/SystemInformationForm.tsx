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
import type { SystemInformationModel } from "../../types/systemInformation";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data:Partial<SystemInformationModel>, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<SystemInformationModel>;
}

export default function SystemInformationForm({
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
  } = useForm<Partial<SystemInformationModel> & { image?: File | null | string }>({
    defaultValues: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);


  const onSubmit = async (data: Partial<SystemInformationModel>) => {
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
      title={`${t(mode)} ${t("systemInformation.title")}`}
    >

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" rowGap={3} pt={1}>
          <Grid container spacing={3}>

            {/* Content */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label={t("systemInformation.content")}
                {...register("content", { required: t("validation.required") as string })}
                error={!!errors.content}
                helperText={errors.content?.message}
                fullWidth
                size="small"
                multiline
                minRows={5}
                disabled={isSubmitting}
              />
            </Grid>

            {/* Arabic Content */}
            <Grid size={{ xs: 12 }}>
              <TextField
                label={t("systemInformation.arabic_content")}
                {...register("arabic_content", { required: t("validation.required") as string })}
                error={!!errors.arabic_content}
                helperText={errors.arabic_content?.message}
                fullWidth
                size="small"
                multiline
                minRows={5}
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
