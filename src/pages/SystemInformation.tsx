// React
import { useEffect, useState } from "react";

// Store
import { useSystemInformationStore } from "../store/useSystemInformationStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

// i18next
import { useTranslation } from "react-i18next";

// Components
import SystemInformationForm from "../components/systemInformation/SystemInformationForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { SystemInformationModel } from "../types/systemInformation";

export default function SystemInformation() {
  const { t, i18n } = useTranslation();

  // Extract state & actions from the systemInformation store
  const {
    data: systemInformation,
    selected: selectedsystemInformation,
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
  const openForm = (mode: CRUDMode, systemInformation?: SystemInformationModel) => {
    setFormMode(mode);
    if (systemInformation) {
      setSelectedSystemInformation(systemInformation);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<SystemInformationModel>) => {
    try {
      if (formMode === "update" && selectedsystemInformation?.id && data) {
        // Update selected systemInformation
        await updateSystemInformation(selectedsystemInformation.id, data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<SystemInformationModel>[] = [
    { key: "id", label: "#", sortable: true },
    {
      key: "name",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => i18n.language === "en" ? row.name : row.arabic_name,
    },
    {
      key: "content",
      label: t("systemInformation.content"),
      sortable: true,
      render: (_value, row) => i18n.language === "en" ? row.content : row.arabic_content,
    },
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
        showCreate={false}
        createLabel={t("create")}
        onCreateClick={() => openForm("create")}
        actions={(systemInformation) => (
          <Stack direction="row" spacing={1}>
           

            {/* Edit button */}
            <IconButton
              onClick={() => openForm("update", systemInformation)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      />

      {/* systemInformation form modal for create/update/delete */}
      <SystemInformationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedsystemInformation}
      />
    </>
  );
}
