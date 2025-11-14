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
import type { SlideModel } from "../../types/slide";
import type { CRUDMode } from "../../types/common";

//Props
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: Partial<SlideModel>) => void;
  mode: CRUDMode;
  initialData?: Partial<SlideModel>;
}

export default function SlideForm({
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
  } = useForm<Partial<SlideModel>>({
    defaultValues: {},
  });

  useEffect(() => {
    if (mode === "create") {
      reset({ image: "" });
    } else {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const isView = mode === "view";

  const onSubmit = (data: Partial<SlideModel>) => {
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
      title={`${t(mode)} ${t("slide")}`}
    >
      {mode === "delete" ? (
        <Stack spacing={3}>
          <Typography>{t("slide.confirmDelete")}</Typography>
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
            { label: t("shared.image"), value: initialData.image },
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t("shared.image")}
                  {...register("image", {
                    required: t("validation.required") as string,
                  })}
                  error={!!errors.image}
                  helperText={errors.image?.message}
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
