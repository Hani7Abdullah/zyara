// React
import { useEffect, useState } from "react";

// Store
import { useRoleStore } from "../store/useRoleStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// i18next
import { useTranslation } from "react-i18next";

// Components
import RoleForm from "../components/role/RoleForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { RoleModel } from "../types/role";

export default function Roles() {
  const { t } = useTranslation();

  // Extract state & actions from the role store
  const {
    data: roles,
    selected: selectedRole,
    total,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole,
    setSelectedRole
  } = useRoleStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch roles whenever page or per_page changes
  useEffect(() => {
    fetchRoles(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0); 
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, role?: RoleModel) => {
    setFormMode(mode);
    if (role) {
      setSelectedRole(role);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<RoleModel>) => {
    try {
      if (formMode === "create" && data) {
        await createRole(data as Omit<RoleModel, "id" | "role" | "is_role">);
      } else if (formMode === "update" && selectedRole?.id && data) {
        // Update selected role
        await updateRole(selectedRole.id, data);
      } else if (formMode === "delete" && selectedRole?.id) {
        // Delete selected role
        await deleteRole(selectedRole.id);
        setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<RoleModel>[] = [
    { key: "id", label: "#", sortable: true },
    { key: "name", label: t("shared.name"), sortable: true },
    { key: "arabic_name", label:t("shared.arabic_name"), sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying roles */}
      <EntityTable<RoleModel>
        data={roles as RoleModel[]}
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
        actions={(role) => (
          <Stack direction="row" spacing={1}>

             {/* Only Edit/Delete if id !== 1 */}
           
            {role.id !== 1 ? (
              <>
            {/* Edit button */}
            <IconButton
              onClick={() => openForm("update", role)}
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
              onClick={() => openForm("delete", role)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            </> ): "-"}
          </Stack>
        )}
      />

      {/* Role form modal for create/update/delete */}
      <RoleForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedRole}
      />
    </>
  );
}
