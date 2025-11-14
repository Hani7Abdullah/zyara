// React
import { useEffect, useState } from "react";

// Store
import { useProductStore } from "../store/useProductStore";

// MUI
import { Stack, IconButton, Switch, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import ProductForm from "../components/product/ProductForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { ProductModel } from "../types/product";
import { Controller, useForm } from "react-hook-form";
import type { StoreModel } from "../types/store";
import PaginatedSelect from "../components/PaginatedSelect";
import { useStore } from "../store/useStore";

export default function Products() {
  const { t, i18n } = useTranslation();

  const { fetchStores } = useStore();

  const {
    data: products,
    selected: selectedProduct,
    total,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    switchActivation,
    setSelectedProduct,
  } = useProductStore();

  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form hook for controlling store select
  const { control, watch, formState: { errors } } = useForm<{ store_id: number }>({
    defaultValues: { store_id: 0 },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  const selectedStore = watch("store_id");

  // Fetch Products when filters change
  useEffect(() => {
    if (!selectedStore) {
      fetchProducts(page, per_page, search);
    }
    if (selectedStore && selectedStore !== 0) {
      fetchProducts(page, per_page, search, "filter[store]", String(selectedStore));
    }
  }, [page, per_page, search, selectedStore]);

  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  const openForm = (mode: CRUDMode, product?: ProductModel) => {
    setFormMode(mode);
    if (product) setSelectedProduct(product);
    setFormOpen(true);
  };

  const handleConfirm = async (data: FormData) => {
    try {
      if (formMode === "create" && data) await createProduct(data);
      else if (formMode === "update" && selectedProduct?.id && data)
        await updateProduct(selectedProduct.id, data);
      else if (formMode === "delete" && selectedProduct?.id) {
        await deleteProduct(selectedProduct.id);
        setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<ProductModel>[] = [
    { key: "id", label: "#", sortable: true },
    {
      key: "name",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => (
        <Stack direction="row" columnGap={1} alignItems="center">
          <Avatar
            key={row.id}
            src={row.image}
            alt={row.name}
            sx={{ width: 32, height: 32 }}
          />
          {row.name}
        </Stack>
      ),
    },
    {
      key: "store",
      label: t("store.title"),
      sortable: true,
      render: (_value, row) => i18n.language === "ar" ?  row.store?.arabic_brand :  row.store?.brand || "-",
      
    },
    {
      key: "category",
      label: t("category.title"),
      sortable: true,
      render: (_value, row) => i18n.language === "ar" ?  row.category?.arabic_name :  row.category?.name || "-",
    },
    { key: "price", label: `${t("product.price")} (${t("shared.syp")})`, sortable: true },
    { key: "quantity", label: t("product.quantity"), sortable: true },
  ];


  return (
    <>
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
      <EntityTable<ProductModel>
        data={products as ProductModel[]}
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
        actions={(product) => (

          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", product)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.info.main, 0.2) },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>
            <IconButton
              onClick={() => openForm("update", product)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => openForm("delete", product)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            <Switch
              checked={product.is_active}
              onChange={async () => await switchActivation(product.id)}
              color="primary"
            />
          </Stack>
        )}
      />

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedProduct}
      />
    </>
  );
}
