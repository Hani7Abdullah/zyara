// React
import { useEffect, useState } from "react";

// Store
import { useClassificationStore } from "../store/useClassificationStore";

// MUI
import { Stack, IconButton, Switch, Avatar, Typography, Box } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// i18next
import { useTranslation } from "react-i18next";

// Components
import ClassificationForm from "../components/classification/ClassificationForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { ClassificationModel } from "../types/classification";

export default function Classifications() {
  const { t } = useTranslation();

  // Extract state & actions from the classification store
  const {
    data: classifications,
    selected: selectedClassification,
    total,
    fetchClassifications,
    createClassification,
    updateClassification,
    deleteClassification,
    switchActivation,
    setSelectedClassification
  } = useClassificationStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch classifications whenever page or per_page changes
  useEffect(() => {
    fetchClassifications(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, classification?: ClassificationModel) => {
    setFormMode(mode);
    if (classification) {
      setSelectedClassification(classification);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data: FormData) => {
  try {
    if (formMode === "create" && data) {
      await createClassification(data);
    } else if (formMode === "update" && selectedClassification?.id && data) {
      await updateClassification(selectedClassification.id, data);
    } else if (formMode === "delete" && selectedClassification?.id) {
      await deleteClassification(selectedClassification.id);
      setFormOpen(false);
    }

    // Close form & refresh classifications for all modes
    fetchClassifications(page, per_page, search);

  } catch (err) {
    console.error(err);
  }
};


  // Define columns for EntityTable
  const columns: Column<ClassificationModel>[] = [
    { key: "id", label: "#", sortable: true },
    {
      key: "name",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => (
        <Stack direction="row" columnGap={1} alignItems="center">
          <Avatar
            key={row.id}
            src={row.icon || ""}
            alt={row.name}
            sx={{ width: 32, height: 32 }}
          />
          {row.name}
        </Stack>
      ),
    },
    { key: "arabic_name", label: t("shared.arabic_name"), sortable: true },
    {
      key: "color",
      label: t("classification.color"),
      sortable: true,
      render: (_, row) => (
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              width: 24,
              height: 24,
              bgcolor: row.color,
              border: "1px solid",
              borderColor: "divider",
              borderRadius: "4px",
            }}
          />
          <Typography variant="body2">{row.color}</Typography>
        </Stack>
      ),
    },
    { key: "index", label: t("shared.sort"), sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying classifications */}
      <EntityTable<ClassificationModel>
        data={classifications as ClassificationModel[]}
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
        actions={(classification) => classification.id!==1 ? (
          <Stack direction="row" spacing={1}>
            {/* Edit button */}
            <IconButton
              onClick={() => openForm("update", classification)}
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
              onClick={() => openForm("delete", classification)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                color: "error.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.error.main, 0.2) },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
            {/* Switch toggle */}
            <Switch
              checked={classification.is_active}
              onChange={async () => {
                await switchActivation(classification.id);
              }}
              color="primary"
            />
          </Stack>
        ): "-"}
      />

      {/* Classification form modal for create/update/delete */}
      <ClassificationForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedClassification}
      />
    </>
  );
}
