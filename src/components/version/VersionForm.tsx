// React
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

// MUI
import {
  Stack,
  TextField,
  Grid,
  Typography,
  Switch,
  Button,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";

// Store & Types
import type { VersionModel } from "../../types/version";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<VersionModel>, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<VersionModel>;
}

export default function VersionForm({
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
    control,
    formState: { errors },
  } = useForm<Partial<VersionModel>>({
    defaultValues: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    reset(initialData);
  }, [initialData, reset]);

  const onSubmit = async (data: Partial<VersionModel>) => {
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
      title={`${t(mode)} ${t("version.title")}`}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack direction="column" spacing={3}>
          <Grid container spacing={2} sx={{ pt: 1 }}>
            {mode === "create" && (
              <>
                <Grid size={{xs:12, md: 7}}>
                  <TextField
                    label={t("version.title")}
                    {...register("version", {
                      required: t("validation.required") as string,
                    })}
                    error={!!errors.version}
                    helperText={errors.version?.message}
                    fullWidth
                    size="small"
                  />
                </Grid>

                {/* Platform Radio Buttons */}
                <Grid size={{xs:12, md: 5}}>
                  <FormControl component="fieldset" error={!!errors.platform}>
                    <Controller
                      name="platform"
                      control={control}
                      defaultValue={initialData?.platform ?? "android"}
                      render={({ field }) => (
                        <RadioGroup {...field} row>
                          <FormControlLabel
                            value="android"
                            control={<Radio />}
                            label={t("version.android")}
                          />
                          <FormControlLabel
                            value="ios"
                            control={<Radio />}
                            label={t("version.ios")}
                          />
                        </RadioGroup>
                      )}
                    />
                    {errors.platform && (
                      <Typography variant="caption" color="error">
                        {errors.platform.message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              </>
            )}
            { mode ==="update" && (
            <Grid size={{xs:12, md: 7}}>
              <TextField
                label={t("version.currency")}
                {...register("currency", {
                  required: t("validation.required") as string,
                })}
                error={!!errors.currency}
                helperText={errors.currency?.message}
                fullWidth
                size="small"
              />
            </Grid>
            )}
            <Grid size={{xs:12, md: 5}}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography>{t("version.is_required")}</Typography>
                <Controller
                  name="is_required"
                  control={control}
                  defaultValue={initialData?.is_required ?? false}
                  render={({ field }) => (
                    <Switch {...field} checked={field.value} disabled={isSubmitting} />
                  )}
                />
              </Stack>
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
              startIcon={
                isSubmitting ? <CircularProgress size={20} color="inherit" /> : undefined
              }
            >
              {t(mode === "create" ? "create" : "update")}
            </Button>
          </Stack>
        </Stack>
      </form>
    </EntityModalForm>
  );
}
