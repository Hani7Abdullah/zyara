// React
import { useEffect, useState } from "react";

// Store
import { useCategoryStore } from "../store/useCategoryStore";

// MUI
import {
  Stack,
  IconButton,
  Switch,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// i18next
import { useTranslation } from "react-i18next";

// Components
import CategoryForm from "../components/category/CategoryForm";
import EntityTable, { type Column } from "../components/EntityTable";
import PaginatedSelect from "../components/PaginatedSelect";

// Types
import type { CRUDMode } from "../types/common";
import type { CategoryModel } from "../types/category";
import type { StoreModel } from "../types/store";

// Hooks
import { useStore } from "../store/useStore";
import { Controller, useForm } from "react-hook-form";

export default function Categories() {
  const { t, i18n } = useTranslation();
  const isAdmin = localStorage.getItem("is_admin") === "true";

  const { fetchStores } = useStore();

  // Category store
  const {
    data: categories,
    selected: selectedCategory,
    total,
    vendorData: vendorCategories,
    vendorTotal,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    deleteCategoryFromStore,
    switchActivationInStore,
    setSelectedCategory,
  } = useCategoryStore();

  // Pagination & filtering states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form hook for controlling store select
  const { control, watch, formState: { errors } } = useForm<{ store_id: number }>({
    defaultValues: { store_id: 0 },
  });

  const selectedStore = watch("store_id");

  // Category form modal states
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Confirmation dialog for deleting from store
  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    storeId: number | null;
    categoryId: number | null;
  }>({ open: false, storeId: null, categoryId: null });

  // Fetch categories when filters change
  useEffect(() => {
    if (isAdmin) {
      fetchCategories(page, per_page, search);
    } else {
      if (selectedStore && selectedStore !== 0) {
        fetchCategories(page, per_page, search, "filter[forStore]", String(selectedStore));
      } else {
        fetchCategories(page, per_page, search, "filter[forVendor]", "true");
      }
    }
  }, [page, per_page, search, selectedStore]);

  // Search handler
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Modal open handler
  const openForm = (mode: CRUDMode, category?: CategoryModel) => {
    setFormMode(mode);
    if (category) setSelectedCategory(category);
    setFormOpen(true);
  };

  // Confirm handler for create/update/delete
  const handleConfirm = async (data?: Partial<CategoryModel>) => {
    try {
      if (formMode === "create" && data) {
        await createCategory(data as Omit<CategoryModel, "id">);
      } else if (formMode === "update" && selectedCategory?.id && data) {
        await updateCategory(selectedCategory.id, data);
      } else if (formMode === "delete" && selectedCategory?.id) {
        await deleteCategory(selectedCategory.id);
        setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Confirm delete from store
  const handleConfirmDeleteFromStore = async () => {
    if (confirmDialog.storeId && confirmDialog.categoryId) {
      await deleteCategoryFromStore(confirmDialog.storeId, confirmDialog.categoryId);
    }
    setConfirmDialog({ open: false, storeId: null, categoryId: null });
  };

  // Table columns
  const columns: Column<CategoryModel>[] = [
    { key: "id", label: "#", sortable: true },
    { key: "name", label: t("shared.name"), sortable: true },
    { key: "arabic_name", label: t("shared.arabic_name"), sortable: true },
  ];

  return (
    <>
      {/* Store selection (for non-admin users) */}
      {!isAdmin && (
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
      )}

      {/* Category Table */}
      <EntityTable<CategoryModel>
        data={isAdmin ? (categories as CategoryModel[]) : (vendorCategories as CategoryModel[])}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={isAdmin ? total : vendorTotal}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate={isAdmin || (!isAdmin && (selectedStore === null || selectedStore === 0))}
        createLabel={t("create")}
        onCreateClick={() => openForm("create")}
        actions={(category) =>
          isAdmin || (!isAdmin && selectedStore !== 0) ? (
            <Stack direction="row" spacing={1}>
              {/* Edit button */}
              {isAdmin && (
                <IconButton
                  onClick={() => openForm("update", category)}
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
              )}

              {/* Delete button */}
              {(isAdmin || (selectedStore && selectedStore !== 0)) && (
                <IconButton
                  onClick={() => {
                    setSelectedCategory(category);
                    if (isAdmin) {
                      openForm("delete", category);
                    } else {
                      setConfirmDialog({
                        open: true,
                        storeId: selectedStore,
                        categoryId: category.id,
                      });
                    }
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
              )}

              {/* Activation toggle */}
              {!isAdmin && selectedStore && selectedStore !== 0 && (
                <Switch
                  checked={category.is_enabled}
                  onChange={async () =>
                    await switchActivationInStore(selectedStore, category.id)
                  }
                  color="primary"
                />
              )}
            </Stack>
          ) : (
            "-"
          )
        }
      />

      {/* Category Form Modal */}
      <CategoryForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedCategory}
      />

      {/* Confirmation Dialog for Vendor Delete */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, storeId: null, categoryId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
        fontWeight={700}
        align='center'
        sx={{
          mb: 2
        }}
      > {t("category.confirmDelete")}</DialogTitle>
        <DialogContent>
          <Stack spacing={3}>
            <Typography>
              {t("category.confirmDelete")}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="flex-end">
              <Button
                onClick={() =>
                  setConfirmDialog({ open: false, storeId: null, categoryId: null })
                }
                variant="outlined"
              >
                {t("cancel")}
              </Button>
              <Button
                onClick={handleConfirmDeleteFromStore}
                color="error"
                variant="contained"
              >
                {t("sure")}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
