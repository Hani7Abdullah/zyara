// React
import { useEffect, useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";

// MUI
import {
  Button,
  Stack,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  IconButton,
  Switch,
} from "@mui/material";
import { AddCircle, Delete } from "@mui/icons-material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import UploadImage from "../UploadImage";
import PaginatedSelect from "../PaginatedSelect";

// Store
import { useStore } from "../../store/useStore";
import { useCategoryStore } from "../../store/useCategoryStore";

// Types
import type { ProductModel, SelectionOption } from "../../types/product";
import type { CRUDMode } from "../../types/common";
import type { StoreModel } from "../../types/store";
import type { CategoryModel } from "../../types/category";
import ViewTable from "../ViewTable";

interface ProductFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (formData: FormData, id?: string) => void;
  mode: CRUDMode;
  initialData?: Partial<ProductModel>;
}

export default function ProductForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: ProductFormProps) {
  const { t, i18n } = useTranslation();

  const isView = mode === "view";
  const isDelete = mode === "delete";
  const isCreate = mode === "create";

  const { fetchStores } = useStore();
  const { fetchCategories } = useCategoryStore();

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    clearErrors,
    setValue,
    control,
    formState: { errors },
  } = useForm<Partial<ProductModel> & { image?: File | null | string }>({
    defaultValues: {
      selection_rules: initialData?.selection_rules ?? [],
      ...initialData,
    },
  });

  const {
    fields: ruleFields,
    append: appendRule,
    remove: removeRule,
  } = useFieldArray({
    control,
    name: "selection_rules",
  });

  const handleAddRule = () =>
    appendRule({
      id: Date.now(),
      title: "",
      arabic_title: "",
      required: false,
      multiple: false,
      options: [],
    });

  const handleAddOption = (ruleIndex: number) => {
    const rules = watch("selection_rules") || [];
    const options = rules[ruleIndex]?.options || [];
    const newOption: SelectionOption = {
      id: Date.now(),
      name: "",
      arabic_name: "",
      price_adjustment: 0,
    };
    setValue(`selection_rules.${ruleIndex}.options`, [...options, newOption]);
  };

  const handleRemoveOption = (ruleIndex: number, optionIndex: number) => {
    const rules = watch("selection_rules") || [];
    const updated = rules[ruleIndex].options?.filter((_, i) => i !== optionIndex);
    setValue(`selection_rules.${ruleIndex}.options`, updated);
  };

  const selectedStoreID = watch("store_id");

  useEffect(() => {
    if (mode === "create") {
      reset({
        name: "",
        arabic_name: "",
        description: "",
        arabic_description: "",
        price: 0,
        quantity: null,
        discount: 0,
        category_id: 0,
        store_id: 0,
        selection_rules: [],
      });
      setSelectedImage(null);
      setPreview("");
    } else if (initialData && mode === "update") {
      reset(initialData);
      setPreview(initialData.image || "");
    }
  }, [mode, initialData, reset]);

  const handleImageChange = (file: File | null) => {
    if (!isSubmitting && file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: Partial<ProductModel>) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      if (mode === "update") formData.append("_method", "PATCH");

      // ✅ Add basic product fields
      Object.entries(data).forEach(([key, value]) => {
        if (
          key !== "image" &&
          key !== "selection_rules" &&
          key !== "is_recommended" &&
          value !== undefined &&
          value !== null
        ) {
          formData.append(key, value.toString());
        }
        if (key === "is_recommended") {
          formData.append(key, value ? "1" : "0");
        }
      });

      // ✅ Handle selection rules as nested fields
      if (data.selection_rules && data.selection_rules.length > 0) {
        data.selection_rules.forEach((rule, ruleIndex) => {
          if (rule.title !== undefined)
            formData.append(`selection_rules[${ruleIndex}][title]`, rule.title);
          if (rule.arabic_title !== undefined)
            formData.append(`selection_rules[${ruleIndex}][arabic_title]`, rule.arabic_title);
          formData.append(
            `selection_rules[${ruleIndex}][required]`,
            rule.required ? "1" : "0"
          );
          formData.append(
            `selection_rules[${ruleIndex}][multiple]`,
            rule.multiple ? "1" : "0"
          );

          if (rule.options && rule.options.length > 0) {
            rule.options.forEach((opt, optIndex) => {
              if (opt.name !== undefined)
                formData.append(
                  `selection_rules[${ruleIndex}][options][${optIndex}][name]`,
                  opt.name
                );
              if (opt.arabic_name !== undefined)
                formData.append(
                  `selection_rules[${ruleIndex}][options][${optIndex}][arabic_name]`,
                  opt.arabic_name
                );
              if (opt.price_adjustment !== undefined)
                formData.append(
                  `selection_rules[${ruleIndex}][options][${optIndex}][price_adjustment]`,
                  opt.price_adjustment.toString()
                );
            });
          }
        });
      }

      if (selectedImage) formData.append("image", selectedImage);

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
    }
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("product.title")}`}
    >
      {isDelete ? (
        // ✅ Delete confirmation (same)
        <Stack spacing={3}>
          <Typography>{t("product.confirmDelete")}</Typography>
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
      ) : isView && initialData ? (
        <ViewTable
          rows={[
            { label: t("shared.name"), value: initialData.name },
            { label: t("shared.arabic_name"), value: initialData.arabic_name },
            { label: t("shared.description"), value: initialData.description },
            { label: t("shared.arabic_description"), value: initialData.arabic_description },
            { label: t("product.price"), value: `${initialData.price} ${t("shared.syp")}` },
            { label: t("product.quantity"), value: initialData.quantity },
            { label: t("product.discount"), value: `${initialData.discount}%` },
            {
              label: t("category.title"),
              value:
                i18n.language === "ar"
                  ? initialData.category?.arabic_name
                  : initialData.category?.name,
            },
            {
              label: t("store.title"),
              value:
                i18n.language === "ar"
                  ? initialData.store?.arabic_brand
                  : initialData.store?.brand,
            },
            {
              label: t("product.is_recommended"),
              value:
                initialData?.is_recommended ? t("shared.yes") : t("shared.no")
            },
            {
  label: t("product.selectionRules"),
  value: initialData.selection_rules?.length
    ? initialData.selection_rules
        .map((rule, index) => {
          const ruleHeader = `# ${t("product.rule")} ${index + 1}`;

          const ruleTitle = 
            `${t("shared.title")}: ${rule.title || "-"}\n` +
            `${t("shared.arabic_title")}: ${rule.arabic_title || "-"}\n`;

          const ruleSettings =
            `${t("shared.required")}: ${rule.required ? t("shared.yes") : t("shared.no")}\n` +
            `${t("shared.multiple")}: ${rule.multiple ? t("shared.yes") : t("shared.no")}`;

          const optionsText = rule.options?.length
            ? rule.options
                .map(
                  (opt, idx) =>
                    `${idx + 1}. ${opt.name || "-"} / ${opt.arabic_name || "-"}\n` +
                    `   ${t("product.price_adjustment")}: ${opt.price_adjustment ?? 0} ${t("shared.syp")}`
                )
                .join("\n\n")
            : `- ${t("shared.noOptions")}`;

          return (
            `${ruleHeader}\n\n` +
            `${ruleTitle}\n` +
            `${ruleSettings}\n\n` +
            `${t("shared.options")}:\n${optionsText}`
          );
        })
        .join("\n\n-----------------------------\n\n")
    : "-",
}
          ]}
        />
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <Stack direction="column" rowGap={3}>
            <Grid container spacing={3}>
              {/* Image */}
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
              </Grid>

              {/* English / Arabic fields */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.name")}
                  {...register("name", { required: t("validation.required") as string })}
                  error={!!errors.name}
                  helperText={errors.name?.message}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.arabic_name")}
                  {...register("arabic_name")}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Description */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.description")}
                  {...register("description")}
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.arabic_description")}
                  {...register("arabic_description")}
                  multiline
                  rows={3}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={`${t("product.price")} (${t("shared.syp")})`}
                  type="number"
                  {...register("price", { required: t("validation.required") as string })}
                  error={!!errors.price}
                  helperText={errors.price?.message}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("product.quantity")}
                  type="number"
                  {...register("quantity")}
                  fullWidth
                  size="small"
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("product.discount")}
                  type="number"
                  {...register("discount")}
                  fullWidth
                  size="small"
                />
              </Grid>


              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="store_id"
                  control={control}
                  rules={{ required: t("validation.required") }}
                  render={({ field }) => (
                    <PaginatedSelect<number, StoreModel>
                      label={t("store.title")}
                      value={field.value || []}
                      onChange={(val) => field.onChange(val)}
                      fetchOptions={fetchStores}
                      getOptionLabel={(store) =>
                        i18n.language === "ar"
                          ? store.arabic_brand
                          : store.brand
                      }
                      getOptionValue={(s) => s.id}
                      error={!!errors.store_id}
                      helperText={errors.store_id?.message}
                    />
                  )}
                />
              </Grid>

              {/* Select Categories */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="category_id"
                  control={control}
                  rules={{ required: t("validation.required") }}
                  render={({ field }) => (
                    <PaginatedSelect<number, CategoryModel>
                      key={selectedStoreID}
                      label={t("category.title")}
                      value={field.value || null}
                      onChange={(val) => field.onChange(val)}
                      disabled={!selectedStoreID}
                      fetchOptions={(page, per_page, search) => {
                        if (!selectedStoreID) return Promise.resolve([]);
                        return fetchCategories(page, per_page, search, "filter[forStore]", String(selectedStoreID));
                      }}
                      getOptionLabel={(cat) =>
                        i18n.language === "ar" ? cat.arabic_name : cat.name
                      }
                      getOptionValue={(c) => c.id}
                      error={!!errors.category_id}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, md: 6 }}>
                <Stack direction="row" alignItems="center" spacing={1} mt={2}>
                  <Typography>{t("product.is_recommended")}</Typography>
                  <Controller
                    name="is_recommended"
                    control={control}
                    defaultValue={initialData?.is_recommended ?? false}
                    render={({ field }) => (
                      <Switch
                        {...field}
                        checked={field.value}
                        disabled={isSubmitting}
                      />
                    )}
                  />
                </Stack>
              </Grid>

            </Grid>


            {/* --- SELECTION RULES --- */}
            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">{t("product.selectionRules")}</Typography>
                <Button
                  variant="outlined"
                  startIcon={<AddCircle />}
                  onClick={handleAddRule}
                  disabled={isSubmitting}
                >
                  {t("product.addRule")}
                </Button>
              </Stack>

              {ruleFields.map((rule, ruleIndex) => (
                <Stack
                  key={rule.id}
                  sx={{
                    border: "1px solid #ccc",
                    borderRadius: 2,
                    p: 2,
                    mt: 1,
                  }}
                  spacing={2}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="subtitle1">
                      {t("rule")} #{ruleIndex + 1}
                    </Typography>
                    <IconButton color="error" onClick={() => removeRule(ruleIndex)}>
                      <Delete />
                    </IconButton>
                  </Stack>

                  <Grid container spacing={2}>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label={t("shared.title")}
                        {...register(`selection_rules.${ruleIndex}.title` as const)}
                        fullWidth
                        size="small"
                      />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                      <TextField
                        label={t("shared.arabic_title")}
                        {...register(`selection_rules.${ruleIndex}.arabic_title` as const)}
                        fullWidth
                        size="small"
                      />
                    </Grid>

                    <Grid size={{ xs: 6, md: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>{t("shared.required")}</Typography>
                        <Switch
                          {...register(`selection_rules.${ruleIndex}.required` as const)}
                        />
                      </Stack>
                    </Grid>
                    <Grid size={{ xs: 6, md: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Typography>{t("shared.multiple")}</Typography>
                        <Switch
                          {...register(`selection_rules.${ruleIndex}.multiple` as const)}
                        />
                      </Stack>
                    </Grid>
                  </Grid>

                  {/* Options */}
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography variant="subtitle2">
                        {t("shared.options")}
                      </Typography>
                      <Button
                        variant="outlined"
                        startIcon={<AddCircle />}
                        onClick={() => handleAddOption(ruleIndex)}
                        sx={{ mb: 1 }}
                      >
                        {t("product.addOption")}
                      </Button>
                    </Stack>

                    {(watch(`selection_rules.${ruleIndex}.options`) || []).map(
                      (option, optionIndex) => (
                        <Stack
                          key={option.id}
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <TextField
                            label={t("shared.name")}
                            {...register(
                              `selection_rules.${ruleIndex}.options.${optionIndex}.name` as const
                            )}
                            size="small"
                            fullWidth
                          />
                          <TextField
                            label={t("shared.arabic_name")}
                            {...register(
                              `selection_rules.${ruleIndex}.options.${optionIndex}.arabic_name` as const
                            )}
                            size="small"
                            fullWidth
                          />
                          <TextField
                            label={`${t("product.price_adjustment")} (${t("shared.syp")})`}
                            type="number"
                            {...register(
                              `selection_rules.${ruleIndex}.options.${optionIndex}.price_adjustment` as const
                            )}
                            size="small"
                            fullWidth
                          />
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveOption(ruleIndex, optionIndex)}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      )
                    )}
                  </Stack>
                </Stack>
              ))}
            </Stack>

            {/* Buttons */}
            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
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
                {t(isCreate ? "create" : "update")}
              </Button>
            </Stack>
          </Stack>
        </form>
      )}
    </EntityModalForm>
  );
}
