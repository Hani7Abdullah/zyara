// React
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

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
import UploadImage from "../UploadImage";
import PaginatedSelect from "../PaginatedSelect";

// Store & Types
import { useRoleStore } from "../../store/useRoleStore";
import type { AdminModel } from "../../types/admin";
import type { RoleModel } from "../../types/role";
import type { CRUDMode } from "../../types/common";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<AdminModel>;
}

export default function AdminForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: Props) {
  const { t, i18n } = useTranslation();
  const { fetchRoles } = useRoleStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    setValue,
    setError,
    formState: { errors },
  } = useForm<Partial<AdminModel> & { image?: File | null | string }>({
    defaultValues: {},
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleModel | null>(
    initialData?.role || null
  );

  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  // Reset form on mode or initialData change
  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        password: "",
        email: "",
        mobile_number: "",
        role_id: 0,
        image: "",
      });
      setSelectedImage(null);
      setPreview("");
      setSelectedRole(null);
    } else if (initialData && mode === "update") {
      reset(initialData);
      setPreview(initialData.image || "");
      setSelectedImage(null);
      setSelectedRole(initialData.role || null);
    }
  }, [mode, initialData, reset]);

  // Sync role selection with form value
  useEffect(() => {
    setValue("role_id", selectedRole?.id ?? 0);
  }, [selectedRole, setValue]);

  const handleImageChange = (file: File | null) => {
    if (!isSubmitting) {
      setSelectedImage(file);
      setPreview(file ? URL.createObjectURL(file) : "");
      clearErrors("image");
    }
  };

  const onSubmit = async (data: Partial<AdminModel>) => {
    if (isSubmitting) return;

    if (!selectedRole?.id || selectedRole.id === 0) {
      setError("role_id", {
        type: "manual",
        message: t("validation.required") as string,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();

      if (mode === "update") formData.append("_method", "PATCH");

      Object.entries(data).forEach(([key, value]) => {
        const initialValue = initialData?.[key as keyof AdminModel];
        if (
          key !== "role" &&
          key !== "image" &&
          value !== undefined &&
          value !== null &&
          value !== initialValue
        ) {
          formData.append(key, value.toString());
        }
      });

      if (selectedImage) formData.append("image", selectedImage);

      // Always append role_id
      formData.append("role_id", selectedRole!.id.toString());

      await onConfirm(formData, initialData?.id?.toString());
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
    if (!isSubmitting) {
      onClose();
      reset();
      setSelectedImage(null);
      setPreview(initialData?.image || "");
      setSelectedRole(initialData?.role || null);
    }
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("admin.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("admin.confirmDelete")}</Typography>
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
            <Grid container spacing={3}>
              {/* Image Upload */}
              <Grid size={{ xs: 12 }}>
                <UploadImage
                  label={t("shared.icon")}
                  imageFile={selectedImage || preview}
                  initialImage={isCreate ? "" : initialData?.image}
                  onChange={handleImageChange}
                  disabled={isSubmitting}
                />
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
              {isCreate && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={t("shared.password")}
                    {...register("password", {
                      required: t("validation.required") as string,
                    })}
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

              {/* Role Dropdown */}
              <Grid size={{ xs: 12, md: isCreate ? 12 : 6 }}>
                <Controller
                  name="role_id"
                  control={control}
                  rules={{ required: t("validation.required") as string }}
                  render={({ field }) => (
                    <PaginatedSelect<number, RoleModel>
                      label={t("role.title")}
                      value={field.value ?? null}
                      onChange={(val) => {
                        field.onChange(val);
                        const selected = val
                          ? { id: val, name: "", arabic_name: "" }
                          : null;
                        setSelectedRole(selected as RoleModel | null);
                      }}
                      fetchOptions={(page, per_page, search) => fetchRoles(page, per_page, search)}
                      getOptionLabel={(opt) =>
                        i18n.language === "ar" ? opt.arabic_name : opt.name
                      }
                      getOptionValue={(opt) => opt.id}
                      error={!!errors.role_id}
                      helperText={errors.role_id?.message}
                    />
                  )}
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
