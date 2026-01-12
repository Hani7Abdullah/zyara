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
  Checkbox,
  FormControlLabel,
} from "@mui/material";

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import UploadImage from "../UploadImage";

// Types
import type { ClassificationModel } from "../../types/classification";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<ClassificationModel>;
}

export default function ClassificationForm({
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
    clearErrors,
  } = useForm<Partial<ClassificationModel> & { icon?: File | null | string }>({
    defaultValues: {},
  });

  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  const [selectedIcon, setSelectedIcon] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Checkbox state to enable sort
  const [enableSort, setEnableSort] = useState(false);

  // Initialize form values
  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        arabic_name: "",
        color: "#000000",
        index: 0,
        icon: "",
      });
      setSelectedIcon(null);
      setPreview("");
      setEnableSort(false);
    } else if (initialData) {
      reset(initialData);
      setPreview(initialData.icon || "");
      setSelectedIcon(null);
      setEnableSort(initialData.index !== undefined && initialData.index !== null);
    }
  }, [mode, initialData, reset, isCreate]);

  // File selection handler
  const handleIconChange = (file: File | null) => {
    if (file) {
      setSelectedIcon(file);
      setPreview(URL.createObjectURL(file));
      clearErrors("icon");
    } else {
      setSelectedIcon(null);
    }
  };

  // Submit handler
  const onSubmit = async (data: Partial<ClassificationModel>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (mode === "update") formData.append("_method", "PATCH");

      Object.entries(data).forEach(([key, value]) => {
        const initialValue = initialData?.[key as keyof ClassificationModel];

        // Only send sort if checkbox is enabled
        if (
          key !== "icon" &&
          value !== undefined &&
          value !== null &&
          value !== initialValue &&
          (key !== "index" || enableSort)
        ) {
          formData.append(key, value.toString());
        }
      });

      if (selectedIcon) {
        formData.append("icon", selectedIcon);
      }

      await onConfirm(formData, initialData?.id?.toString());
      // reset();
      //   setSelectedIcon(null);
      //   setPreview("");
      //   setEnableSort(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(new FormData(), initialData?.id?.toString());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setSelectedIcon(null);
    setPreview("");
    setEnableSort(false);
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("classification.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("classification.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack direction="column" rowGap={3}>
            <Grid container spacing={3}>
              {/* Icon Upload */}
              <Grid size={{ xs:12}}>
                <UploadImage
                  label={t("shared.icon")}
                  imageFile={selectedIcon || preview}
                  initialImage={isCreate ? "" : initialData?.icon}
                  onChange={(file) => {
                    handleIconChange(file);
                    if (file) clearErrors("icon");
                  }}
                  disabled={isSubmitting}
                />

                {/* hidden field to register icon */}
                <input
                  type="hidden"
                  {...register("icon", {
                    validate: () => {
                      if (isCreate && !selectedIcon) {
                        return t("required_image") as string;
                      }
                      return true;
                    },
                  })}
                />

                {errors.icon && (
                  <Typography
                    variant="caption"
                    color="error"
                    align="center"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {errors.icon.message}
                  </Typography>
                )}
              </Grid>

              {/* Name */}
              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  label={t("shared.name")}
                  {...register("name", { required: t("validation.required") as string })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Arabic Name */}
              <Grid size={{ xs:12, md:6 }}>
                <TextField
                  label={t("shared.arabic_name")}
                  {...register("arabic_name", { required: t("validation.required") as string })}
                  error={!!errors.arabic_name}
                  helperText={errors.arabic_name?.message}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Color Picker */}
              <Grid size={{ xs:12 }}>
                <TextField
                  type="color"
                  {...register("color", { required: t("validation.required") as string })}
                  error={!!errors.color}
                  helperText={errors.color?.message}
                  fullWidth
                  size="small"
                  sx={{
                    "& input[type='color']": {
                      height: "40px",
                      padding: 0,
                      cursor: "pointer",
                      borderRadius: "6px",
                    },
                  }}
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Enable Sort Checkbox */}
              <Grid size={{ xs:12, md:6 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={enableSort}
                      onChange={(e) => setEnableSort(e.target.checked)}
                      disabled={isSubmitting}
                    />
                  }
                  label={t("shared.enableSort")}
                />
              </Grid>

              {/* Sort Field (conditionally rendered) */}
              {enableSort && (
                <Grid size={{ xs:12, md:6 }}>
                  <TextField
                    label={t("shared.sort")}
                    type="number"
                    {...register("index", {
                      required: enableSort ? (t("validation.required") as string) : false,
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message:
                          t("validation.minValue", { value: 1 })
                      },
                      validate: (value) =>
                        !isNaN(value as number) || (t("validation.invalidNumber") as string),
                    })}
                    fullWidth
                    size="small"
                    error={!!errors.index}
                    helperText={errors.index?.message}
                    disabled={isSubmitting}
                  />
                </Grid>
              )}
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
                startIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined}
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
