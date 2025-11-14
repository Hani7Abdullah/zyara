// React
import { useEffect, useState } from "react";

// Store
import { useCouponStore } from "../store/useCouponStore";

// MUI
import { Stack, IconButton, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import CouponForm from "../components/coupon/CouponForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { CouponModel } from "../types/coupon";

export default function Coupons() {
  const { t } = useTranslation();

  // Extract state & actions from the coupon store
  const {
    data: coupons,
    selected: selectedCoupon,
    total,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    switchActivation,
    setSelectedCoupon
  } = useCouponStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch coupons whenever page or per_page changes
  useEffect(() => {
    fetchCoupons(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, coupon?: CouponModel) => {
    setFormMode(mode);
    if (coupon) {
      setSelectedCoupon(coupon);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<CouponModel>) => {
    try {
      if (formMode === "create" && data) {
        // Create new coupon (exclude id, role, is_coupon fields)
        await createCoupon(data as Omit<CouponModel, "id" | "role" | "is_coupon">);
      } else if (formMode === "update" && selectedCoupon?.id && data) {
        // Update selected coupon
        await updateCoupon(selectedCoupon.id, data);
      } else if (formMode === "delete" && selectedCoupon?.id) {
        // Delete selected coupon
        await deleteCoupon(selectedCoupon.id);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<CouponModel>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying coupons */}
      <EntityTable<CouponModel>
        data={coupons as CouponModel[]}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate
        createLabel={t("create")}
        onCreateClick={() => openForm("create")}
        actions={(coupon) => (
          <Stack direction="row" spacing={1}>
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

            {/* Edit button */}
            <IconButton
              onClick={() => openForm("update", coupon)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* Delete button */}
            <IconButton
              onClick={() => openForm("delete", coupon)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            {/* Switch Account toggle */}
            <Switch
              checked={coupon.is_active} 
              onChange={async () => {
                await switchActivation(coupon.id);
              }}
              color="primary"
            />
          </Stack>
        )}
      />
      {/* Coupon form modal for create/update/delete */}
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
