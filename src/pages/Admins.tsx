// React
import { useEffect, useState } from "react";

// Store
import { useAdminStore } from "../store/useAdminStore";

// MUI
import { Stack, IconButton, Switch, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// i18next
import { useTranslation } from "react-i18next";

// Components
import AdminForm from "../components/admin/AdminForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { AdminModel } from "../types/admin";

export default function Admins() {
  const { t } = useTranslation();

  const {
    data: admins,
    selected: selectedAdmin,
    total,
    fetchAdmins,
    createAdmin,
    updateAdmin,
    deleteAdmin,
    switchActivation,
    setSelectedAdmin,
  } = useAdminStore();

  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  useEffect(() => {
    fetchAdmins(page, per_page, search);
  }, [page, per_page, search]);

  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  const openForm = (mode: CRUDMode, admin?: AdminModel) => {
    setFormMode(mode);
    if (admin) setSelectedAdmin(admin);
    setFormOpen(true);
  };

  const handleConfirm = async (data: FormData) => {
    try {
      if (formMode === "create" && data) await createAdmin(data);
      else if (formMode === "update" && selectedAdmin?.id && data)
        await updateAdmin(selectedAdmin.id, data);
      else if (formMode === "delete" && selectedAdmin?.id) {
        await deleteAdmin(selectedAdmin.id);
      setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<AdminModel>[] = [
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
    { key: "mobile_number", label: t("mobile_number"), sortable: true },
    {
      key: "role",
      label: t("role.title"),
      sortable: true,
      render: (_value, row) => row.role?.name || "-",
    },
  ];


  return (
    <>
      <EntityTable<AdminModel>
        data={admins as AdminModel[]}
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
        actions={(admin) => (

          <Stack direction="row" spacing={1}>

            {/* Only Edit/Delete/Switch if id !== 1 */}
            {admin.id !== 1 ? (
              <>
                <IconButton
                  onClick={() => openForm("update", admin)}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                    color: "warning.main",
                    "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => openForm("delete", admin)}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    color: "error.main",
                    "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>

                <Switch
                  checked={admin.is_active}
                  onChange={async () => await switchActivation(admin.id)}
                  color="primary"
                />
              </>
            ) : "-"}
          </Stack>
        )}
      />

      <AdminForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedAdmin}
      />
    </>
  );
}
