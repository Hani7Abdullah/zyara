// SlideForm.tsx
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";

// MUI
import {
  Button,
  Stack,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import UploadImage from "../UploadImage";
import PaginatedSelect from "../PaginatedSelect";
import ViewTable from "../ViewTable";

// Types
import type { SlideModel, SlideType } from "../../types/slide";
import type { StoreModel } from "../../types/store";
import type { CRUDMode } from "../../types/common";
import { useStore } from "../../store/useStore";

import moment from "moment";

interface SlideFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData, id?: string) => Promise<void> | void;
  mode: CRUDMode;
  initialData?: Partial<SlideModel>;
}

export default function SlideForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: SlideFormProps) {
  const { t, i18n } = useTranslation();
  const { fetchStores } = useStore();

  const isView = mode === "view";
  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    control,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<Partial<SlideModel>>({
    shouldUnregister: true,
    defaultValues: {
      type: "internal",
      index: 0,
    },
  });

  const slideType = watch("type");

  /* ================= INIT ================= */
  useEffect(() => {
    if (isCreate) {
      reset({
        type: "internal",
        index: 0,
      });
      setImageFile(null);
      setPreview("");
    } else if (initialData) {
      reset({
        ...initialData,
        start_date: initialData.start_date
          ? moment(initialData.start_date).format("YYYY-MM-DD")
          : "",
        end_date: initialData.end_date
          ? moment(initialData.end_date).format("YYYY-MM-DD")
          : "",
      });
      setPreview(initialData.image || "");
    }
  }, [mode, initialData, reset, isCreate]);

  /* ================= IMAGE ================= */
  const handleImageChange = (file: File | null) => {
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
    setValue("image", file as any);
    clearErrors("image");
  };

  /* ================= FORM DATA ================= */
  const buildFormData = (values: Partial<SlideModel>) => {
    const fd = new FormData();

    if (mode === "update") {
      fd.append("_method", "PATCH");
    }

    if (values.start_date) {
      fd.append(
        "start_date",
        moment(values.start_date).format("YYYY-MM-DD HH:mm:ss")
      );
    }

    if (values.end_date) {
      fd.append(
        "end_date",
        moment(values.end_date).format("YYYY-MM-DD HH:mm:ss")
      );
    }

    fd.append("type", values.type as SlideType);
    fd.append("index", String(values.index ?? 0));

    if (values.type === "internal" && values.store_id) {
      fd.append("store_id", String(values.store_id));
    }

    if (values.type === "external") {
      fd.append("owner_name", values.owner?.name || "");
      fd.append("owner_email", values.owner?.email || "");
      fd.append("owner_mobile_number", values.owner?.mobile_number || "");
      fd.append("link", values.link || "");
    }

    if (imageFile) {
      fd.append("image", imageFile);
    }

    return fd;
  };

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: Partial<SlideModel>) => {
    if (loading) return;
    setLoading(true);
    try {
      const formData = buildFormData(values);
      await onConfirm(formData, initialData?.id?.toString());
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(new FormData(), initialData?.id?.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      reset();
      setImageFile(null);
      setPreview("");
    }
  };

  /* ================= VIEW TABLE ================= */
  if (isView && initialData) {
    const rows = [
      {
        label: t("shared.start_date"),
        value: initialData.start_date
          ? moment(initialData.start_date).format("YYYY-MM-DD")
          : "-",
      },
      {
        label: t("shared.end_date"),
        value: initialData.end_date
          ? moment(initialData.end_date).format("YYYY-MM-DD")
          : "-",
      },
      {
        label: t("shared.type"),
        value: t(`slide.${initialData.type as SlideType}`),
      },
      {
        label: t("store.title"),
        value:
          initialData.type === "internal"
            ? i18n.language === "ar"
              ? initialData.store?.arabic_brand ?? "-"
              : initialData.store?.brand ?? "-"
            : "-",
      },
      {
        label: t("slide.owner"),
        value:
          initialData.type === "external" && initialData.owner
            ? `${initialData.owner.name} | ${initialData.owner.email} | ${initialData.owner.mobile_number}`
            : "-",
      },
      {
        label: t("shared.link"),
        value: initialData.link ?? "-",
      },
      {
        label: t("shared.sort"),
        value: initialData.index ?? 0,
      },
      {
        label: t("shared.active"),
        value: initialData.is_active ? t("shared.yes") : t("shared.no"),
      },
    ];

    return (
      <EntityModalForm
        open={open}
        onClose={handleClose}
        title={`${t("view")} ${t("slide.title")}`}
      >
        <ViewTable rows={rows} />
      </EntityModalForm>
    );
  }

  /* ================= CREATE / UPDATE ================= */
  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("slide.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("admin.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={loading && <CircularProgress size={18} color="inherit" />}
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <UploadImage
                  label={t("shared.image")}
                  imageFile={preview}
                  onChange={handleImageChange}
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  type="date"
                  label={t("shared.start_date")}
                  InputLabelProps={{ shrink: true }}
                  {...register("start_date")}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 6 }}>
                <TextField
                  type="date"
                  label={t("shared.end_date")}
                  InputLabelProps={{ shrink: true }}
                  {...register("end_date")}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="internal"
                        control={<Radio />}
                        label={t("slide.internal")}
                      />
                      <FormControlLabel
                        value="external"
                        control={<Radio />}
                        label={t("slide.external")}
                      />
                    </RadioGroup>
                  )}
                />
              </Grid>
              {slideType === "internal" && (
                <Grid size={{ xs: 6 }}>
                  <Controller
                    name="store_id"
                    control={control}
                    rules={{ required: t("validation.required") as string }}
                    render={({ field }) => (
                      <PaginatedSelect<number, StoreModel>
                        label={t("store.title")}
                        value={field.value ?? null}
                        onChange={field.onChange}
                        fetchOptions={fetchStores}
                        getOptionLabel={(s) =>
                          i18n.language === "ar"
                            ? s.arabic_brand
                            : s.brand
                        }
                        getOptionValue={(s) => s.id}
                        error={!!errors.store_id}
                        helperText={errors.store_id?.message}
                      />
                    )}
                  />
                </Grid>
              )}

              {slideType === "external" && (
                <>
                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label={t("shared.name")}
                      {...register("owner.name", { required: true })}
                      error={!!errors?.owner?.name}
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label={t("shared.email")}
                      {...register("owner.email", { required: true })}
                      error={!!errors?.owner?.email}
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label={t("mobile_number")}
                      {...register("owner.mobile_number", { required: true })}
                      error={!!errors?.owner?.mobile_number}
                      fullWidth
                      size="small"
                    />
                  </Grid>

                  <Grid size={{ xs: 6 }}>
                    <TextField
                      label={t("shared.link")}
                      {...register("link", { required: true })}
                      error={!!errors.link}
                      fullWidth
                      size="small"
                    />
                  </Grid>
                </>
              )}

              <Grid size={{ xs: 6 }}>
                <TextField
                  type="number"
                  label={t("shared.sort")}
                  {...register("index")}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button onClick={handleClose} variant="outlined" disabled={loading}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : undefined}
              >
                {t(isCreate ? "create" : "update")}
              </Button>
            </Stack>
          </Stack>
        </form>)}
    </EntityModalForm>
  );
}
