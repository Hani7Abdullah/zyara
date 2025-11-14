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

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import PaginatedSelect from "../PaginatedSelect";

// Types
import type { CRUDMode } from "../../types/common";
import type { CategoryModel } from "../../types/category";
import type { StoreModel } from "../../types/store";

// Stores
import { useStore } from "../../store/useStore";
import { useCategoryStore } from "../../store/useCategoryStore";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm?: (
    formData: Partial<CategoryModel>,
    id?: string
  ) => Promise<void> | void;
  mode: CRUDMode;
  initialData?: Partial<CategoryModel>;
}

export default function CategoryForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: Props) {
  const { t, i18n } = useTranslation();
  const isDelete = mode === "delete";
  const isCreate = mode === "create";
  const isUpdate = mode === "update";
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const [loading, setLoading] = useState(false);

  const { fetchStores } = useStore();
  const { fetchCategories, enableInStores, createCategory, updateCategory } =
    useCategoryStore();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<Partial<CategoryModel>>({
    defaultValues: {
      name: "",
      arabic_name: "",
      store_ids: [],
      category_ids: [],
    },
  });

  /** Reset form when initialData or mode changes **/
  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        arabic_name: "",
        store_ids: [],
        category_ids: [],
      });
    } else if (initialData) {
      reset(initialData);
    }
  }, [initialData, isCreate, isUpdate, reset]);

  /** Handle form submit **/
  const onSubmit = async (data: Partial<CategoryModel>) => {
    setLoading(true);
    try {
      if (!isAdmin) {
        await enableInStores({category_ids:data.category_ids || [], store_ids:data.store_ids|| []});
      } else {
        // 🔹 Admins create or update categories normally
        if (isCreate) {
          await createCategory({name:data.name || "", arabic_name:data.arabic_name || ""});
        } else if (isUpdate && initialData?.id) {
          await updateCategory(initialData.id, data);
        }
      }
      if(!isAdmin) {
        reset()
      }
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onConfirm) return;
    setLoading(true);
    try {
      await onConfirm({}, initialData?.id?.toString());
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      reset();
    }
  };

  return (
    <EntityModalForm
      open={open}
      onClose={handleClose}
      title={`${t(mode)} ${t("category.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("category.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined" disabled={loading}>
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={18} color="inherit" />
              }
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack direction="column" rowGap={3}>
            <Grid container spacing={3} pt={1}>
              {/* Admin Fields */}
              {isAdmin && (
                <>
                  <Grid size={{xs:12, md:6}}>
                    <TextField
                      label={t("shared.name")}
                      {...register("name", { required: t("validation.required") })}
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      fullWidth
                      size="small"
                      disabled={loading}
                    />
                  </Grid>

                  <Grid size={{xs:12, md:6}}>
                    <TextField
                      label={t("shared.arabic_name")}
                      {...register("arabic_name", { required: t("validation.required") })}
                      error={!!errors.arabic_name}
                      helperText={errors.arabic_name?.message}
                      fullWidth
                      size="small"
                      disabled={loading}
                    />
                  </Grid>
                </>
              )}

              {/* Non-Admin Fields */}
              {!isAdmin && (
                <>
                  {/* Select Stores */}
                  <Grid size={{xs:12, md:6}}>
                    <Controller
                      name="store_ids"
                      control={control}
                      rules={{ required: t("validation.required") }}
                      render={({ field }) => (
                        <PaginatedSelect<number, StoreModel>
                          label={t("store.title")}
                          multiple
                          value={field.value || []}
                          onChange={(val) => field.onChange(val)}
                          fetchOptions={fetchStores}
                          getOptionLabel={(store) =>
                            i18n.language === "ar"
                              ? store.arabic_brand
                              : store.brand
                          }
                          getOptionValue={(s) => s.id}
                          error={!!errors.store_ids}
                          helperText={errors.store_ids?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Select Categories */}
                  <Grid size={{xs:12, md:6}}>
                    <Controller
                      name="category_ids"
                      control={control}
                      rules={{ required: t("validation.required") }}
                      render={({ field }) => (
                        <PaginatedSelect<number, CategoryModel>
                          label={t("category.title")}
                          multiple
                          value={field.value || []}
                          onChange={(val) => field.onChange(val)}
                          fetchOptions={fetchCategories}
                          getOptionLabel={(cat) =>
                            i18n.language === "ar"
                              ? cat.arabic_name
                              : cat.name
                          }
                          getOptionValue={(c) => c.id}
                          error={!!errors.category_ids}
                          helperText={errors.category_ids?.message}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}
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
                startIcon={
                  loading && <CircularProgress size={18} color="inherit" />
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
