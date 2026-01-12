// React
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

// MUI
import {
  Button,
  Stack,
  TextField,
  Typography,
  Grid,
  CircularProgress,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";

// Store & Types
import type { PopularTopicModel } from "../../types/popularTopic";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: Partial<PopularTopicModel>, id?: string) => void;
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
  } = useForm<Partial<PopularTopicModel> & { image?: File | null | string }>({
    defaultValues: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  // Reset form on mode or initialData change
  useEffect(() => {
    if (isCreate) {
      reset({
        question: "",
        arabic_question: "",
        answer: "",
        arabic_answer: ""
      });
    } else if (initialData && mode === "update") {
      reset(initialData);
    }
  }, [mode, initialData, reset]);


  const onSubmit = async (data: Partial<PopularTopicModel>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      await onConfirm(data, initialData?.id?.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({}, initialData?.id?.toString());
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
      title={`${t(mode)} ${t("popularTopic.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("popularTopic.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={isSubmitting && <CircularProgress size={18} color="inherit" />}
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack direction="column" rowGap={3}>
            <Grid container spacing={3} pt={1}>

              {/* Question */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label={t("popularTopic.question")}
                  {...register("question", { required: t("validation.required") as string })}
                  error={!!errors.question}
                  helperText={errors.question?.message}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label={t("popularTopic.arabic_question")}
                  {...register("arabic_question", { required: t("validation.required") as string })}
                  error={!!errors.arabic_question}
                  helperText={errors.arabic_question?.message}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Answer */}
              <Grid size={{ xs: 12 }}>
                <TextField
                  label={t("popularTopic.answer")}
                  {...register("answer", { required: t("validation.required") as string })}
                  error={!!errors.answer}
                  helperText={errors.answer?.message}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
                  disabled={isSubmitting}
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  label={t("popularTopic.arabic_answer")}
                  {...register("arabic_answer", { required: t("validation.required") as string })}
                  error={!!errors.arabic_answer}
                  helperText={errors.arabic_answer?.message}
                  fullWidth
                  size="small"
                  multiline
                  minRows={2}
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
                {t(isCreate ? "create" : "update")}
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </EntityModalForm>
  );
}
