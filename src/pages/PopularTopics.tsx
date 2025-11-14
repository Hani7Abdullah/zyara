// React
import { useEffect, useState } from "react";

// Store
import { usePopularTopicStore } from "../store/usePopularTopicStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import PopularTopicForm from "../components/popularTopic/PopularTopicForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { PopularTopicModel } from "../types/popularTopic";

export default function PopularTopics() {
  const { t } = useTranslation();

  // Extract state & actions from the popularTopic store
  const {
    data: popularTopics,
    selected: selectedPopularTopic,
    total,
    fetchPopularTopics,
    createPopularTopic,
    updatePopularTopic,
    deletePopularTopic,
    setSelectedPopularTopic
  } = usePopularTopicStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch popularTopics whenever page or per_page changes
  useEffect(() => {
    fetchPopularTopics(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0); 
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, popularTopic?: PopularTopicModel) => {
    setFormMode(mode);
    if (popularTopic) {
      setSelectedPopularTopic(popularTopic);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<PopularTopicModel>) => {
    try {
      if (formMode === "create" && data) {
        // Create new popularTopic (exclude id, popularTopic, is_popularTopic fields)
        await createPopularTopic(data as Omit<PopularTopicModel, "id" | "popularTopic" | "is_popularTopic">);
      } else if (formMode === "update" && selectedPopularTopic?.id && data) {
        // Update selected popularTopic
        await updatePopularTopic(selectedPopularTopic.id, data);
      } else if (formMode === "delete" && selectedPopularTopic?.id) {
        // Delete selected popularTopic
        await deletePopularTopic(selectedPopularTopic.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<PopularTopicModel>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "title", label: "Title", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying popularTopics */}
      <EntityTable<PopularTopicModel>
        data={popularTopics as PopularTopicModel[]}
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
        actions={(popularTopic) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", popularTopic)}
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
              onClick={() => openForm("update", popularTopic)}
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
              onClick={() => openForm("delete", popularTopic)}
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

      {/* PopularTopic form modal for create/update/delete */}
      <PopularTopicForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedPopularTopic}
      />
    </>
  );
}
