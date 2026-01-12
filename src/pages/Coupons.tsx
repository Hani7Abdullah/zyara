// React
import { useEffect, useState } from "react";

// Store
import { useCouponStore } from "../store/useCouponStore";

// MUI
import {
  Stack,
  IconButton,
  Switch
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import CouponForm from "../components/coupon/CouponForm";
import EntityTable, { type Column } from "../components/EntityTable";
import PaginatedSelect from "../components/PaginatedSelect";

// Types
import type { CRUDMode } from "../types/common";
import type { CouponModel } from "../types/coupon";
import type { StoreModel } from "../types/store";

// Hooks
import { useStore } from "../store/useStore";
import { Controller, useForm } from "react-hook-form";

export default function Coupons() {
  const { t, i18n } = useTranslation();

  const { fetchStores } = useStore();

  // Coupon store
  const {
    data: coupons,
    selected: selectedCoupon,
    total,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    switchActivation,
    setSelectedCoupon,
  } = useCouponStore();

  // Pagination & filtering states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form hook for controlling store select
  const { control, watch, formState: { errors } } = useForm<{ store_id: number }>({
    defaultValues: { store_id: 0 },
  });

  const selectedStore = watch("store_id");

  // Coupon form modal states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch coupons when filters change
  useEffect(() => {

    if (selectedStore && selectedStore !== 0) {
      fetchCoupons(page, per_page, search, "filter[forStore]", String(selectedStore));
    } else {
      fetchCoupons(page, per_page, search);
    }
  }, [page, per_page, search, selectedStore]);

  // Search handler
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Modal open handler
  const openForm = (mode: CRUDMode, coupon?: CouponModel) => {
    setFormMode(mode);
    if (coupon) setSelectedCoupon(coupon);
    setFormOpen(true);
  };

  // Confirm handler for create/update/delete

  const handleConfirm = async (data?: Partial<CouponModel>) => {
    try {
      if (formMode === "create" && data) {
        await createCoupon(data as Omit<CouponModel, "id">);
      } else if (formMode === "update" && selectedCoupon?.id && data) {
        await updateCoupon(selectedCoupon.id, data);
      } else if (formMode === "delete" && selectedCoupon?.id) {
        await deleteCoupon(selectedCoupon.id);
        setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Table columns
  const columns: Column<CouponModel>[] = [
    { key: "id", label: "#", sortable: true },
    {
      key: "name",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => i18n.language === "en" ? row.name : row.arabic_name,
    },
    { key: "code", label: t("coupon.code"), sortable: true },
    {
      key: "type",
      label: t("shared.type"),
      sortable: true,
      render: (_value, row) => t(`coupon.${row.type}`) + (row.type === "discount" ? ` ( ${row.discount}% )` : "")
    },
    { key: "start_date", label: t("shared.start_date"), sortable: true },
    { key: "end_date", label: t("shared.end_date"), sortable: true },
  ];

  return (
    <>
      {/* Store selection (for non-admin users) */}

      <Stack
        width="25%"
        mb={3}
        sx={{
          position: "relative",
          right: "-75%",
        }}
      >
        <Controller
          name="store_id"
          control={control}
          rules={{ required: t("validation.required") as string }}
          render={({ field }) => (
            <PaginatedSelect<number, StoreModel>
              label={t("store.title")}
              value={field.value ?? null}
              onChange={(val) => field.onChange(val)}
              fetchOptions={async (page, per_page, search) => {
                const stores = await fetchStores(page, per_page, search);
                const allOption: StoreModel = {
                  id: 0,
                  classification_id: 0,
                  classification: {
                    id: 0,
                    name: "",
                    arabic_name: "",
                    icon: "",
                    color: "",
                    is_active: false,
                    index: 0,
                  },
                  vendor_id: 0,
                  vendor: {
                    id: 0,
                    name: "",
                    email: "",
                    mobile_number: "",
                    password: "",
                    image: "",
                    is_admin: false,
                    is_active: false,
                  },
                  brand: t("store.all"),
                  arabic_brand: "",
                  logo: "",
                  image: "",
                  mobile_number: "",
                  phone_number: "",
                  address: "",
                  arabic_address: "",
                  is_active: false,
                  service_method: "Both",
                  delivery_cost: 0,
                  delivery_duration: 0,
                  min_order_value: 0,
                  working_days: [],
                };
                return [allOption, ...stores];
              }}
              getOptionLabel={(store) =>
                i18n.language === "ar" ? store.arabic_brand : store.brand
              }
              getOptionValue={(store) => store.id}
              placeholder={t("store.select_store")}
              error={!!errors.store_id}
              helperText={errors.store_id?.message}
            />
          )}
        />
      </Stack>


      {/* Coupon Table */}
      <EntityTable<CouponModel>
        data={coupons as CouponModel[]}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate={(selectedStore === null || selectedStore === 0)}
        createLabel={t("create")}
        onCreateClick={() => openForm("create")}
        actions={(coupon) => (
          <Stack direction="row" spacing={1} alignItems="center">
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", coupon)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.info.main, 0.2) },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>

            {/* Edit */}
            <IconButton
              onClick={() => openForm("update", coupon)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2),
                },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* Delete */}
            <IconButton
              onClick={() => {
                setSelectedCoupon(coupon);
                openForm("delete", coupon);
              }}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": {
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
                },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            {/* Store activation */}
            {selectedStore && selectedStore !== 0 ? (
              <Switch
                checked={
                  (coupon.stores as StoreModel[])
                    ?.find((store) => store.id === selectedStore)
                    ?.is_active ?? false
                }
                onChange={async () => {
                  await switchActivation(coupon.id, selectedStore);
                }}
                color="primary"
              />
            ) : (
              <></>
            )}
          </Stack>
        )}

      />

      {/* Coupon Form Modal */}
      <CouponForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedCoupon}
      />
    </>
  );
}
