// React
import { useEffect, useState } from "react";

// Store
import { useVersionStore } from "../store/useVersionStore";

// MUI
import { Stack, IconButton, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";

// i18next
import { useTranslation } from "react-i18next";

// Components
import VersionForm from "../components/version/VersionForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { VersionModel } from "../types/version";

export default function Versions() {
  const { t } = useTranslation();

  // Extract state & actions from the version store
  const {
    data: versions,
    selected: selectedVersion,
    total,
    fetchVersions,
    createVersion,
    updateVersion,
    makePublish,
    setSelectedVersion
  } = useVersionStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch versions whenever page or per_page changes
  useEffect(() => {
    fetchVersions(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, version?: VersionModel) => {
    setFormMode(mode);
    if (version) {
      setSelectedVersion(version);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<VersionModel>) => {
    try {
      if (formMode === "create" && data) {
          await createVersion(data as Omit<VersionModel, "id" | "status" | "released_at">);
        } else if (formMode === "update" && selectedVersion?.id && data) {
        // Update selected version
        await updateVersion(selectedVersion.id, data);
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Define columns for EntityTable
  const columns: Column<VersionModel>[] = [
    { key: "id", label: "#", sortable: true },
    { key: "version", label: t("version.title"), sortable: true },
    { key: "platform", label: t("version.platform"), sortable: true },
    { key: "currency", label: t("version.currency"), sortable: true },
    {
      key: "is_required",
      label: t("version.is_required"),
      sortable: true,
      render: (_value, row) => row.is_required ? t("shared.yes"): t("shared.no")
    },
    { key: "status", label: t("version.status"), sortable: true },
    {
      key: "released_at",
      label: t("version.released_at"),
      sortable: true,
      render: (_value, row) => new Date(row.released_at).toDateString() || "-",
    },
  ];

  return (
    <>
      {/* EntityTable for displaying versions */}
      <EntityTable<VersionModel>
        data={versions as VersionModel[]}
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
        actions={(version) => (
          <Stack direction="row" spacing={1}>


            {/* Edit button */}
            <IconButton
              onClick={() => openForm("update", version)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                color: "warning.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2) },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* Switch Account toggle */}
            {version.status === "draft" && (
              <Switch
                onChange={async () => {
                  await makePublish(version.id);
                  fetchVersions(page, per_page, search);
                }}
                color="primary"
              />
            )}
          </Stack>
        )}
      />
      {/* Version form modal for create/update/delete */}
      <VersionForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedVersion}
      />
    </>
  );
}
