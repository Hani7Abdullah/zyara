// React
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
  Switch,
} from "@mui/material";

// i18n
import { useTranslation } from "react-i18next";

// Components
import EntityModalForm from "../EntityModal";
import ViewTable from "../ViewTable";
import PaginatedSelect from "../PaginatedSelect";

// Stores
import { useStore } from "../../store/useStore";
import { useClientStore } from "../../store/useClientStore";

// Types
import type { CouponModel, CouponType } from "../../types/coupon";
import type { CRUDMode } from "../../types/common";
import type { StoreModel } from "../../types/store";
import type { ClientModel } from "../../types/client";

import moment from "moment";

interface CouponFormProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data?: Partial<CouponModel>, id?: number) => Promise<void> | void;
  mode: CRUDMode;
  initialData?: Partial<CouponModel>;
}

interface CouponFormValues {
  name: string;
  arabic_name: string;
  code: string;
  type: CouponType;
  discount?: number;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  for_all_users: boolean;
  for_all_stores: boolean;
  users: number[];
  stores: number[];
}

export default function CouponForm({
  open,
  onClose,
  onConfirm,
  mode,
  initialData,
}: CouponFormProps) {
  const { t, i18n } = useTranslation();
  const { fetchStores } = useStore();
  const { fetchClients } = useClientStore();

  const isView = mode === "view";
  const isDelete = mode === "delete";
  const isCreate = mode === "create";
  const isUpdate = mode === "update";

  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    formState: { errors },
  } = useForm<CouponFormValues>({
    defaultValues: {
      name: "",
      arabic_name: "",
      code: "",
      type: "discount",
      discount: 0,
      is_active: true,
      for_all_users: false,
      for_all_stores: false,
      users: [],
      stores: [],
    },
  });

  const couponType = watch("type");
  const forAllUsers = watch("for_all_users");
  const forAllStores = watch("for_all_stores");

  /* ================= INIT ================= */
  useEffect(() => {
    if (isCreate) {
      reset({
        name: "",
        arabic_name: "",
        code: "",
        type: "discount",
        discount: 0,
        is_active: true,
        for_all_users: false,
        for_all_stores: false,
        users: [],
        stores: [],
      });
      return;
    }

    if (initialData && isUpdate) {
      const userIds =
        initialData.users?.map((u) =>
          typeof u === "object" ? u.id : u
        ) ?? [];

      const storeIds =
        initialData.stores?.map((s) =>
          typeof s === "object" ? s.id : s
        ) ?? [];

      reset({
        ...initialData,
        type: initialData.type ?? "discount",
        discount: initialData.discount ?? 0,
        for_all_users: Boolean(initialData.for_all_users),
        for_all_stores: Boolean(initialData.for_all_stores),
        users: userIds,
        stores: storeIds,
        start_date: initialData.start_date
          ? moment(initialData.start_date).format("YYYY-MM-DD")
          : "",
        end_date: initialData.end_date
          ? moment(initialData.end_date).format("YYYY-MM-DD")
          : "",
      });
    }
  }, [isCreate, isUpdate, initialData, reset]);

  /* ================= SUBMIT ================= */
  const onSubmit = async (values: CouponFormValues) => {
    if (loading) return;
    setLoading(true);

    try {
      const payload: Partial<CouponModel> = {
        ...values,
      };

      if (payload.type !== "discount") {
        delete payload.discount;
      }

      if (payload.for_all_users) delete payload.users;
      if (payload.for_all_stores) delete payload.stores;

      await onConfirm(payload, initialData?.id);
    } finally {
      setLoading(false);
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async () => {
    setLoading(true);
    try {
      await onConfirm(undefined, initialData?.id);
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

  /* ================= VIEW ================= */
  if (isView && initialData) {
    const rows = [
      { label: t("shared.name"), value: initialData.name },
      { label: t("shared.arabic_name"), value: initialData.arabic_name },
      { label: t("coupon.code"), value: initialData.code },
      {
        label: t("shared.type"),
        value:
          t(`coupon.${initialData.type as CouponType}`) +
          (initialData.type === "discount"
            ? ` (${initialData.discount}%)`
            : ""),
      },
      { label: t("coupon.for_all_stores"), value: initialData.for_all_stores ? t("shared.yes") : t("shared.no"), },
      { label: t("stores"), value: (initialData.stores as StoreModel[])?.map((store) => i18n.language === "ar" ? store.arabic_brand : store.brand).join("\n"), }, { label: t("coupon.for_all_users"), value: initialData.for_all_users ? t("shared.yes") : t("shared.no"), },
      { label: t("clients"), value: (initialData.users as ClientModel[])?.map((user) => `${user.full_name} | ${user.mobile_number}`).join("\n"), },
    ];

    return (
      <EntityModalForm
        open={open}
        onClose={handleClose}
        title={`${t("view")} ${t("coupon.title")}`}
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
      title={`${t(mode)} ${t("coupon.title")}`}
    >
      {isDelete ? (
        <Stack spacing={3}>
          <Typography>{t("coupon.confirmDelete")}</Typography>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button onClick={handleClose} variant="outlined">
              {t("cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              variant="contained"
              color="error"
              startIcon={loading && <CircularProgress size={18} />}
            >
              {t("sure")}
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3} pt={1}>
            <Grid container spacing={3}>
              {/* Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.name")}
                  {...register("name", { required: t("validation.required") })}
                  error={!!errors.name}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Arabic Name */}
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label={t("shared.arabic_name")}
                  {...register("arabic_name")}
                  fullWidth
                  size="small"
                />
              </Grid>

              {/* Type */}
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="discount"
                        control={<Radio />}
                        label={t("coupon.discount")}
                      />
                      <FormControlLabel
                        value="free delivery"
                        control={<Radio />}
                        label={t("coupon.free delivery")}
                      />
                    </RadioGroup>
                  )}
                />
              </Grid>

              {/* Discount */}
              {couponType === "discount" && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <TextField
                    type="number"
                    label={t("coupon.discount")}
                    {...register("discount", { min: 0, max: 100 })}
                    fullWidth
                    size="small"
                  />
                </Grid>
              )}

              {/* Stores Switch */}
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="for_all_stores"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} {...field} />}
                      label={t("coupon.for_all_stores")}
                    />
                  )}
                />
              </Grid>

              {/* Stores */}
              {!forAllStores && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="stores"
                    control={control}
                    render={({ field }) => (
                      <PaginatedSelect<number, StoreModel>
                        label={t("store.title")}
                        multiple
                        value={field.value}
                        onChange={field.onChange}
                        fetchOptions={fetchStores}
                        initialOptions={initialData?.stores as StoreModel[]}
                        getOptionLabel={(s) =>
                          i18n.language === "ar"
                            ? s.arabic_brand
                            : s.brand
                        }
                        getOptionValue={(s) => s.id}
                      />
                    )}
                  />
                </Grid>
              )}

              {/* Users Switch */}
              <Grid size={{ xs: 6 }}>
                <Controller
                  name="for_all_users"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch checked={field.value} {...field} />}
                      label={t("coupon.for_all_users")}
                    />
                  )}
                />
              </Grid>

              {/* Users */}
              {!forAllUsers && (
                <Grid size={{ xs: 12, md: 6 }}>
                  <Controller
                    name="users"
                    control={control}
                    render={({ field }) => (
                      <PaginatedSelect<number, ClientModel>
                        label={t("client.title")}
                        multiple
                        value={field.value}
                        onChange={field.onChange}
                        fetchOptions={fetchClients}
                        initialOptions={initialData?.users as ClientModel[]}
                        getOptionLabel={(c) =>
                          `${c.full_name} (${c.mobile_number})`
                        }
                        getOptionValue={(c) => c.id}
                      />
                    )}
                  />
                </Grid>
              )}
            </Grid>

            {/* Buttons */}
            <Stack direction="row" justifyContent="flex-end" spacing={2}>
              <Button variant="outlined" onClick={handleClose}>
                {t("cancel")}
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading && <CircularProgress size={18} />}
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
