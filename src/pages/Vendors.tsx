// React
import { useEffect, useState } from "react";

// Store
import { useVendorStore } from "../store/useVendorStore";

// MUI
import { Stack, IconButton, Switch, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// i18next
import { useTranslation } from "react-i18next";

// Components
import VendorForm from "../components/vendor/VendorForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { VendorModel } from "../types/vendor";

export default function Vendors() {
  const { t } = useTranslation();

  const {
    data: vendors,
    selected: selectedVendor,
    total,
    fetchVendors,
    createVendor,
    updateVendor,
    deleteVendor,
    switchActivation,
    setSelectedVendor,
  } = useVendorStore();

  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  useEffect(() => {
    fetchVendors(page, per_page, search);
  }, [page, per_page, search]);

  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  const openForm = (mode: CRUDMode, vendor?: VendorModel) => {
    setFormMode(mode);
    if (vendor) setSelectedVendor(vendor);
    setFormOpen(true);
  };

  const handleConfirm = async (data: FormData) => {
    try {
      if (formMode === "create" && data) await createVendor(data);
      else if (formMode === "update" && selectedVendor?.id && data)
        await updateVendor(selectedVendor.id, data);
      else if (formMode === "delete" && selectedVendor?.id) {
 await deleteVendor(selectedVendor.id);
      setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<VendorModel>[] = [
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

    { key: "email", label: t("shared.email"), sortable: true },
    { key: "mobile_number", label: t("mobile_number"), sortable: true }
  ];


  return (
    <>
      <EntityTable<VendorModel>
        data={vendors as VendorModel[]}
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
        actions={(vendor) => (

          <Stack direction="row" spacing={1}>


            <IconButton
              onClick={() => openForm("update", vendor)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={() => openForm("delete", vendor)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            <Switch
              checked={vendor.is_active}
              onChange={async () => await switchActivation(vendor.id)}
              color="primary"
            />

          </Stack>
        )}
      />

      <VendorForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedVendor}
      />
    </>
  );
}
