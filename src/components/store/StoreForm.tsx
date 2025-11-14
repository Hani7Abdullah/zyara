// React
import { useEffect, useState, useCallback, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";

// MUI
import {
  Button,
  Stack,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import ViewTable from "../ViewTable";
import PaginatedSelect from "../PaginatedSelect";
import UploadImage from "../UploadImage";

// API
import api from "../../api";

// Types
import type { Day, StoreModel, WorkingDay } from "../../types/store";
import type { CRUDMode } from "../../types/common";
import type { ClassificationModel } from "../../types/classification";
import type { VendorModel } from "../../types/vendor";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: FormData) => void;
  mode: CRUDMode;
  initialData?: Partial<StoreModel>;
}


export default function StoreForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: Props) {
  const { t, i18n } = useTranslation();

  const isAdmin = localStorage.getItem("is_admin") === "true";

  const DAYS: Day[] = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  const defaultWorkingDays = (): WorkingDay[] =>
    DAYS.map((day, index) => ({
      id: index + 1,
      day,
      opening_time: "09:00",
      closing_time: "17:00",
      is_vacation: false,
    }));

  const isCreate = mode === "create";
  const isDelete = mode === "delete";
  const isView = mode === "view";

  const {
    register,
    handleSubmit,
    reset,
    control,
    clearErrors,
    formState: { errors },
  } = useForm<Partial<StoreModel> & { logo?: File | null | string }>({
    defaultValues: {},
  });

  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedClassification, setSelectedClassification] =
    useState<ClassificationModel | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<VendorModel | null>(null);
  const [workingDays, setWorkingDays] = useState<WorkingDay[]>(defaultWorkingDays());
  const [workingDaysError, setWorkingDaysError] = useState("");
  const [serviceMethod, setServiceMethod] = useState<string>("Both");

  /** Initialize form data */
  useEffect(() => {
    if (isCreate) {
      reset({
        brand: "",
        arabic_brand: "",
        mobile_number: "",
        phone_number: "",
        address: "",
        arabic_address: "",
        service_method: "Both", // ✅ default for create
        delivery_cost: 0,
        delivery_duration: 0,
        min_order_value: 0,
      });

      setSelectedLogo(null);
      setLogoPreview("");
      setSelectedImage(null);
      setImagePreview("");
      setSelectedClassification(null);
      setSelectedVendor(null);
      setWorkingDays(defaultWorkingDays());
      setServiceMethod("Both");
    } else if (initialData) {
      // ✅ merge defaults with initial data
      reset({
        ...initialData,
        service_method: initialData.service_method || "Both",
      });

      setServiceMethod(initialData.service_method || "Both");
      setLogoPreview(initialData.logo || "");
      setImagePreview(initialData.image || "");
      setSelectedClassification(initialData.classification || null);
      setSelectedVendor(initialData.vendor || null);

      // ✅ ensure working days always have full week
      if (initialData.working_days?.length) {
        const mergedDays = DAYS.map((day, i) => {
          const existing = initialData?.working_days?.find((d) => d.day === day);
          return (
            existing || {
              id: i + 1,
              day,
              opening_time: "09:00",
              closing_time: "17:00",
              is_vacation: true, // mark missing ones as vacation
            }
          );
        });
        setWorkingDays(mergedDays);
      } else {
        setWorkingDays(defaultWorkingDays());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialData, reset]);


  /** Fetch helper for PaginatedSelect */
  const fetchOptions = useCallback(
    async (endpoint: string, page: number, per_page: number, search: string) => {
      try {
        const res = await api.get(endpoint, { params: { page, per_page, search } });
        return res.data?.data ?? res.data?.data?.items ?? [];
      } catch {
        return [];
      }
    },
    []
  );

  /** File handling */
  const handleLogoChange = (file: File | null) => {
    if (file) {
      setSelectedLogo(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setSelectedLogo(null);
      setLogoPreview("");
    }
  };

  const handleImageChange = (file: File | null) => {
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setSelectedImage(null);
      setImagePreview("");
    }
  };

  /** Build FormData */
  const buildFormData = useCallback(
    (data: Partial<StoreModel>): FormData => {
      const formData = new FormData();

      if (mode === "update") formData.append("_method", "PUT");

      // Basic store fields
      const entries: [keyof StoreModel, unknown][] = [
        ["brand", data.brand],
        ["arabic_brand", data.arabic_brand],
        ["mobile_number", data.mobile_number],
        ["phone_number", data.phone_number],
        ["address", data.address],
        ["arabic_address", data.arabic_address],
        ["service_method", data.service_method],
        ["delivery_cost", data.delivery_cost],
        ["delivery_duration", data.delivery_duration],
        ["min_order_value", data.min_order_value],
      ];

      entries.forEach(([key, val]) => {
        if (val !== undefined && val !== null) formData.append(key, String(val));
      });

      // Classification & Vendor
      if (selectedClassification?.id) {
        formData.append("classification_id", String(selectedClassification.id));
      }
      if (selectedVendor?.id) {
        formData.append("vendor_id", String(selectedVendor.id));
      }

      // Files
      if (selectedLogo) formData.append("logo", selectedLogo);
      if (selectedImage) formData.append("image", selectedImage);

      // Working days: remove vacation days and remove id/is_vacation
      const filteredDays = workingDays
        .filter((d) => !d.is_vacation)
        .map((item) => ({
          day: item.day,
          opening_time: item.opening_time,
          closing_time: item.closing_time,
        }));

      filteredDays.forEach((day, index) => {
        Object.entries(day).forEach(([key, value]) => {
          formData.append(`working_days[${index}][${key}]`, String(value));
        });
      });

      return formData;
    },
    [mode, selectedClassification, selectedVendor, selectedLogo, selectedImage, workingDays]
  );


  /** Submit handler */
  const onSubmit = async (data: Partial<StoreModel>) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setWorkingDaysError(""); // clear previous errors

    try {
      // ✅ Check for at least one active working day
      const activeDays = workingDays.filter((d) => !d.is_vacation);
      if (activeDays.length === 0) {
        setWorkingDaysError(t("validation.at_least_one_working_day"));
        return;
      }

      const formData = buildFormData(data);
      await onConfirm(formData);

      // reset();
      // setSelectedLogo(null);
      // setLogoPreview("");
      // setSelectedImage(null);
      // setImagePreview("");
      // setWorkingDays(defaultWorkingDays());
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm(new FormData());
    } finally {
      setIsSubmitting(false);
    }
  };

  /** Close handler */
  const handleClose = () => {
    onClose();
    reset();
    setSelectedLogo(null);
    setLogoPreview("");
    setSelectedImage(null);
    setImagePreview("");
  };

  /** Working days UI */
  const renderWorkingDays = useMemo(
    () => (
      <Grid container spacing={2}>
        {workingDays.map((day, index) => (
          <Grid key={day.id} size={{ xs: 12 }}>
            <Stack
              spacing={1.5}
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                p: 2,
                backgroundColor: day.is_vacation ? "action.hover" : "background.paper",
              }}
            >
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {t(`days.${day.day.toLocaleLowerCase()}`)}
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={day.is_vacation}
                      onChange={(e) => {
                        const updated = [...workingDays];
                        updated[index] = {
                          ...day,
                          is_vacation: e.target.checked,
                        };
                        setWorkingDays(updated);
                      }}
                      disabled={isSubmitting}
                    />
                  }
                  label={t("store.vacation")}
                />
              </Stack>

              {!day.is_vacation && (
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    label={t("store.opening_time")}
                    type="time"
                    value={day.opening_time}
                    onChange={(e) => {
                      const updated = [...workingDays];
                      updated[index] = { ...day, opening_time: e.target.value };
                      setWorkingDays(updated);
                    }}
                    size="small"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }}
                    disabled={isSubmitting}
                  />
                  <TextField
                    label={t("store.closing_time")}
                    type="time"
                    value={day.closing_time}
                    onChange={(e) => {
                      const updated = [...workingDays];
                      updated[index] = { ...day, closing_time: e.target.value };
                      setWorkingDays(updated);
                    }}
                    size="small"
                    fullWidth
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                    }} disabled={isSubmitting}
                  />
                </Stack>
              )}
            </Stack>
          </Grid>
        ))}
        {workingDaysError && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {workingDaysError}
          </Typography>
        )}
      </Grid>
    ),
    [workingDays, workingDaysError, t, isSubmitting]
  );

  /** Render */
  return (
    <EntityModalForm open={open} onClose={handleClose} title={`${t(mode)} ${t("store.title")}`}>
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("store.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={isSubmitting}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={isSubmitting}
              startIcon={
                isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined
              }
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : isView && initialData ? (
        <ViewTable
          rows={[
            { label: t("store.brand"), value: initialData.brand },
            { label: t("store.arabic_brand"), value: initialData.arabic_brand },
            { label: t("classification.title"), value: initialData.classification?.name },
            ...(isAdmin ? [{ label: t("vendor.title"), value: initialData.vendor?.name }] : []),
            { label: t("mobile_number"), value: initialData.mobile_number },
            { label: t("phone_number"), value: initialData.mobile_number },
            { label: t("shared.address"), value: initialData.address },
            { label: t("shared.arabic_address"), value: initialData.arabic_address },
            { label: t("store.service_method"), value: initialData.service_method },
            { label: t("store.delivery_cost"), value: `${initialData.delivery_cost} ${t("shared.syp")}` },
            {
              label: t("store.delivery_duration"),
              value: `${initialData.delivery_duration} ${t("minutes")}`,
            },
            { label: t("store.min_order_value"), value: `${initialData.min_order_value} ${t("shared.syp")}` },
            { label: t("shared.active"), value: initialData.is_active ? t("shared.yes") : t("shared.no") },
            {
              label: t("store.working_days"),
              value: initialData.working_days
                ?.map((d) =>
                  `${t(`days.${d.day.toLowerCase()}`)}: ${d.is_vacation ? t("vacation") : `${d.opening_time} - ${d.closing_time}`
                  }`
                )
                .join("\n"),
            },
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="column" rowGap={2}>
                  <Typography>{t("shared.logo")}</Typography>
                  <UploadImage
                    label={t("shared.icon")}
                    imageFile={selectedLogo || logoPreview}
                    initialImage={isCreate ? "" : initialData?.logo}
                    onChange={(file) => {
                      handleLogoChange(file);
                      if (file) clearErrors("logo");
                    }}
                    disabled={isSubmitting}
                  />

                  {/* hidden field to register icon */}
                  <input
                    type="hidden"
                    {...register("logo", {
                      validate: () => {
                        if (isCreate && !selectedLogo) {
                          return t("validation.required_logo") as string;
                        }
                        return true;
                      },
                    })}
                  />

                  {errors.logo && (
                    <Typography
                      variant="caption"
                      color="error"
                      align="center"
                      display="block"
                      sx={{ mt: 1 }}
                    >
                      {errors.logo.message}
                    </Typography>
                  )}
                </Stack>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="column" rowGap={2}>
                  <Typography>{t("shared.image")}</Typography>
                  <UploadImage
                    label={t("shared.image")}
                    imageFile={selectedImage || imagePreview}
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
                </Stack>
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("store.brand")}
                  {...register("brand", { required: t("validation.required") as string })}
                  error={!!errors.brand}
                  helperText={errors.brand?.message}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("store.arabic_brand")}
                  {...register("arabic_brand")}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              {isAdmin && (
                <>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Controller
                      name="classification_id"
                      control={control}
                      rules={{ required: t("validation.required") as string }}
                      render={({ field }) => (
                        <PaginatedSelect<number, ClassificationModel>
                          label={t("classification.title")}
                          value={field.value ?? selectedClassification?.id ?? null}
                          onChange={(val) => {
                            field.onChange(val);
                            const selected = val
                              ? { id: val, name: "", arabic_name: "" }
                              : null;
                            setSelectedClassification(selected as ClassificationModel | null);
                          }}
                          fetchOptions={async (page, perPage, search) => { const options = await fetchOptions("classifications", page, perPage, search); return options.filter((opt: { id: number; }) => opt.id !== 1); }}
                          getOptionLabel={(opt) =>
                            i18n.language === "ar" ? opt.arabic_name : opt.name
                          }
                          getOptionValue={(opt) => opt.id}
                          error={!!errors.classification_id}
                          helperText={errors.classification_id?.message}
                        />
                      )}
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>

                    <Controller
                      name="vendor_id"
                      control={control}
                      rules={{ required: t("validation.required") as string }}
                      render={({ field }) => (
                        <PaginatedSelect<number, ClassificationModel>
                          label={t("vendor.title")}
                          value={field.value ?? selectedVendor?.id ?? null}
                          onChange={(val) => {
                            field.onChange(val);
                            const selected = val
                              ? { id: val, name: "" }
                              : null;
                            setSelectedVendor(selected as VendorModel | null);
                          }}
                          fetchOptions={(page, per_page, search) =>
                            fetchOptions("vendors", page, per_page, search)
                          }
                          getOptionLabel={(opt) => opt.name}
                          getOptionValue={(opt) => opt.id}
                          error={!!errors.classification_id}
                          helperText={errors.classification_id?.message}
                        />
                      )}
                    />
                  </Grid>
                </>)}

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("mobile_number")}
                  {...register("mobile_number")}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("phone_number")}
                  {...register("phone_number")}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.address")}
                  {...register("address")}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.arabic_address")}
                  {...register("arabic_address")}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                  dir="rtl"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={`${t("store.min_order_value")} (${t("shared.syp")})`}
                  type="number"
                  {...register("min_order_value", {
                    required: t("validation.required") as string,
                    valueAsNumber: true,
                    min: {
                      value: 1,
                      message: t("validation.minValue", { value: 1 }) as string,
                    },
                    validate: (value) =>
                      !isNaN(value as number) || (t("validation.invalidNumber") as string),
                  })}
                  error={!!errors.min_order_value}
                  helperText={errors.min_order_value?.message}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                />

              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  select
                  label={t("store.service_method")}
                  {...register("service_method")}
                  value={serviceMethod}
                  onChange={(e) => setServiceMethod(e.target.value)}
                  fullWidth
                  size="small"
                  disabled={isSubmitting}
                >
                  <MenuItem value="Pickup">{t("store.pick_up")}</MenuItem>
                  <MenuItem value="Delivery">{t("store.delivery")}</MenuItem>
                  <MenuItem value="Both">{t("store.both")}</MenuItem>
                </TextField>
              </Grid>

              {serviceMethod !== "Pickup" && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={`${t("store.delivery_cost")} (${t("shared.syp")})`}
                    type="number"
                    {...register("delivery_cost", {
                      required: serviceMethod !== "Pickup" ? t("validation.required") as string : false,
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: t("validation.minValue", { value: 1 }) as string,
                      },
                      validate: (value) =>
                        !isNaN(value as number) || (t("validation.invalidNumber") as string),
                    })}
                    error={!!errors.delivery_cost}
                    helperText={errors.delivery_cost?.message}
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
              )}

              {serviceMethod !== "Pickup" && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    label={`${t("store.delivery_duration")}`}
                    type="number"
                    {...register("delivery_duration", {
                      required: serviceMethod !== "Pickup" ? t("validation.required") as string : false,
                      valueAsNumber: true,
                      min: {
                        value: 1,
                        message: t("validation.minValue", { value: 1 }) as string,
                      },
                      validate: (value) =>
                        !isNaN(value as number) || (t("validation.invalidNumber") as string),
                    })}
                    error={!!errors.delivery_duration}
                    helperText={errors.delivery_duration?.message}
                    fullWidth
                    size="small"
                    disabled={isSubmitting}
                  />
                </Grid>
              )}
            </Grid>

            {renderWorkingDays}


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
                  isSubmitting ? <CircularProgress size={18} color="inherit" /> : undefined
                }
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
