// React
import { useEffect, useState } from "react";

// Store
import { useSystemInformationStore } from "../store/useSystemInformationStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import SystemInformationForm from "../components/systemInformation/SystemInformationForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { SystemInformationModel } from "../types/systemInformation";

export default function SystemInformation() {
  const { t } = useTranslation();

  // Extract state & actions from the SystemInformation store
  const {
    data: systemInformation,
    selected: selectedSystemInformation,
    total,
    fetchSystemInformation,
    updateSystemInformation,
    setSelectedSystemInformation
  } = useSystemInformationStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch systemInformation whenever page or per_page changes
  useEffect(() => {
    fetchSystemInformation(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, SystemInformation?: SystemInformationModel) => {
    setFormMode(mode);
    if (SystemInformation) {
      setSelectedSystemInformation(SystemInformation);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<SystemInformationModel>) => {
    try {
      if (formMode === "update" && selectedSystemInformation?.id && data) {
        // Update selected SystemInformation
        await updateSystemInformation(selectedSystemInformation.id, data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<SystemInformationModel>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
    { key: "content", label: "Content", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying systemInformation */}
      <EntityTable<SystemInformationModel>
        data={systemInformation as SystemInformationModel[]}
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
        actions={(SystemInformation) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", SystemInformation)}
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
              onClick={() => openForm("update", SystemInformation)}
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
              onClick={() => openForm("delete", SystemInformation)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      />

      {/* SystemInformation form modal for create/update/delete */}
      <SystemInformationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedSystemInformation}
      />
    </>
  );
}
