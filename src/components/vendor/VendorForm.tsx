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

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import UploadImage from "../UploadImage";

// Types
import type { VendorModel } from "../../types/vendor";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<VendorModel>;
}

export default function VendorForm({
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
    clearErrors,
    formState: { errors },
  } = useForm<Partial<VendorModel> & { image?: File | null | string }>({
    defaultValues: {},
  });

  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === "create") {
      reset({
        name: "",
        password: "",
        email: "",
        mobile_number: "",
        image: "",
      });
      setSelectedImage(null);
      setPreview("");
    } else if (initialData && mode === "update") {
      reset(initialData);
      setPreview(initialData.image || "");
      setSelectedImage(null);
    }
  }, [mode, initialData, reset]);

  // Submit handler
  const onSubmit = async (data: Partial<VendorModel>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const formData = new FormData();

      if (mode === "update") formData.append("_method", "PATCH");

      Object.entries(data).forEach(([key, value]) => {
        const initialValue = initialData?.[key as keyof VendorModel];

        if (
          key !== "image" &&
          value !== undefined &&
          value !== null &&
          value !== initialValue
        ) {
          formData.append(key, value.toString());
        }
      });

      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      await onConfirm(formData, initialData?.id?.toString());
      // reset();
      // setSelectedImage(null);
      // setPreview("");
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
    setSelectedImage(null);
    setPreview("");
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("vendor.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("vendor.confirmDelete")}</Typography>

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
              {/* Image Upload */}
              <Grid size={{ xs: 12 }}>
                <UploadImage
                  label={t("shared.icon")}
                  imageFile={selectedImage || preview}
                  initialImage={isCreate ? "" : initialData?.image}
                  onChange={(file) => {
                    handleImageChange(file);
                    if (file) clearErrors("image");
                  }}
                  disabled={isSubmitting}
                />

                {/* hidden field to register icon */}
                <input
                  type="hidden"
                  {...register("image", {
                    validate: () => {
                      if (isCreate && !selectedImage) {
                        return t("validation.required_image") as string;
                      }
                      return true;
                    },
                  })}
                />

                {errors.image && (
                  <Typography
                    variant="caption"
                    color="error"
                    align="center"
                    display="block"
                    sx={{ mt: 1 }}
                  >
                    {errors.image.message}
                  </Typography>
                )}
              </Grid>

              {/* Name */}
              <Grid size={{ xs: 12, md: 6 }}>
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

              {/* Password */}
              {mode === "create" && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("shared.password")}
                    {...register("password", { required: t("validation.required") as string })}
                    type="password"
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
              )}

              {/* Email */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.email")}
                  {...register("email", { required: t("validation.required") as string })}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              {/* Mobile Number */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("mobile_number")}
                  {...register("mobile_number", { required: t("validation.required") as string })}
                  error={!!errors.mobile_number}
                  helperText={errors.mobile_number?.message}
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
