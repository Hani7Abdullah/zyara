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
import type { PopularTopicModel } from "../../types/popularTopic";
import type { CRUDMode } from "../../types/common";

//Props
interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: Partial<PopularTopicModel>) => void;
  mode: CRUDMode;
  initialData?: Partial<PopularTopicModel>;
}

export default function PopularTopicForm({
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
  } = useForm<Partial<PopularTopicModel>>({
    defaultValues: {},
  });

  useEffect(() => {
    if (mode === "create") {
      reset({ title: "", arabic_title: "" });
    } else {
      reset(initialData);
    }
  }, [mode, initialData, reset]);

  const isView = mode === "view";

  const onSubmit = (data: Partial<PopularTopicModel>) => {
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
      title={`${t(mode)} ${t("popularTopic")}`}
    >
      {mode === "delete" ? (
        <Stack spacing={3}>
          <Typography>{t("popularTopic.confirmDelete")}</Typography>
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
            { label: t("shared.name"), value: initialData.title },
            { label: t("shared.arabic_name"), value: initialData.arabic_title },
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t("shared.name")}
                  {...register("title", {
                    required: t("validation.required") as string,
                  })}
                  error={!!errors.title}
                  helperText={errors.title?.message}
                  fullWidth
                  size="small"
                  disabled={isView}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  label={t("shared.email")}
                  {...register("arabic_title", {
                    required: t("validation.required") as string,
                  })}
                  error={!!errors.arabic_title}
                  helperText={errors.arabic_title?.message}
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
