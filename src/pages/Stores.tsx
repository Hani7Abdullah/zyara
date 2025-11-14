// React
import { useEffect, useState } from "react";

// Store
import { useStore } from "../store/useStore";

// MUI
import { Stack, IconButton, Switch, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import StoreForm from "../components/store/StoreForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { StoreModel } from "../types/store";

export default function Stores() {
  const { t } = useTranslation();

  // Extract state & actions from the store store
  const {
    data: stores,
    selected: selectedStore,
    total,
    fetchStores,
    createStore,
    updateStore,
    deleteStore,
    switchActivation,
    setSelectedStore
  } = useStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  //is Admin
  const isAdmin = localStorage.getItem("is_admin") === "true";

  // Fetch stores whenever page or per_page changes
  useEffect(() => {
    fetchStores(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, store?: StoreModel) => {
    setFormMode(mode);
    if (store) {
      setSelectedStore(store);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: FormData) => {
    try {
      if (formMode === "create" && data) {
        // Create new store (FormData allowed for uploads)
        await createStore(data);
      } else if (formMode === "update" && selectedStore?.id) {
        // Update selected store (if no form data passed, send empty FormData)
        await updateStore(selectedStore.id, data ?? new FormData());
      } else if (formMode === "delete" && selectedStore?.id) {
        // Delete selected store
        await deleteStore(selectedStore.id);
        setFormOpen(false);
      }

    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<StoreModel>[] = [
    { key: "id", label: "#", sortable: true },
    {
          key: "brand",
          label: t("store.brand"),
          sortable: true,
          render: (_value, row) => (
            <Stack direction="row" columnGap={1} alignItems="center">
              <Avatar
                key={row.id}
                src={row.logo}
                alt={row.brand}
                sx={{ width: 32, height: 32 }}
              />
              {row.brand}
            </Stack>
          ),
        },
        { key: "arabic_brand", label: t("store.arabic_brand"), sortable: true },
        { key: "classification", label: t("classification.title"), render: (_v, row) => row.classification?.name ?? "" },
        ...(isAdmin
      ? [
        {
          key: "vendor" as keyof StoreModel,
          label: t("vendor.title"),
          render: (_v: unknown, row: { vendor: { name: string } }) => row.vendor?.name ?? "",
        },
      ]
      : []),
      { key: "phone_number", label: t("phone_number"), render: (_v, row) => row.phone_number ?? "" },

  ];

  return (
    <>
      {/* EntityTable for displaying stores */}
      <EntityTable<StoreModel>
        data={stores as StoreModel[]}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate={isAdmin}
        createLabel={t("create")}
        onCreateClick={() => openForm("create")}
        actions={(store) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", store)}
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
              onClick={() => openForm("update", store)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* Delete button */}
            {isAdmin && <>
              <IconButton
                onClick={() => openForm("delete", store)}
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
                checked={store.is_active}
                onChange={async () => {
                  await switchActivation(store.id);
                }}
                color="primary"
              />
            </>}
          </Stack>
        )}
      />
      {/* Store form modal for create/update/delete */}
      <StoreForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedStore}
      />
    </>
  );
}
