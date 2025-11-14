// React
import { useEffect, useState } from "react";

// Store
import { useSlideStore } from "../store/useSlideStore";

// MUI
import { Stack, IconButton, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import SlideForm from "../components/slide/SlideForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { SlideModel } from "../types/slide";

export default function Slides() {
  const { t } = useTranslation();

  // Extract state & actions from the slide store
  const {
    data: slides,
    selected: selectedSlide,
    total,
    fetchSlider,
    createSlide,
    updateSlide,
    deleteSlide,
    switchActivation,
    setSelectedSlide
  } = useSlideStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch slides whenever page or per_page changes
  useEffect(() => {
    fetchSlider(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, slide?: SlideModel) => {
    setFormMode(mode);
    if (slide) {
      setSelectedSlide(slide);
    }
    setFormOpen(true);
  };

  // Handle form submit depending on mode
  const handleConfirm = async (data?: Partial<SlideModel>) => {
    try {
      if (formMode === "create" && data) {
        // Create new slide (exclude id, role, is_slide fields)
        await createSlide(data as Omit<SlideModel, "id" | "role" | "is_slide">);
      } else if (formMode === "update" && selectedSlide?.id && data) {
        // Update selected slide
        await updateSlide(selectedSlide.id, data);
      } else if (formMode === "delete" && selectedSlide?.id) {
        // Delete selected slide
        await deleteSlide(selectedSlide.id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Define columns for EntityTable
  const columns: Column<SlideModel>[] = [
    { key: "id", label: "ID", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying slides */}
      <EntityTable<SlideModel>
        data={slides as SlideModel[]}
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
        actions={(slide) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", slide)}
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
              onClick={() => openForm("update", slide)}
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
              onClick={() => openForm("delete", slide)}
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
              checked={slide.is_active} 
              onChange={async () => {
                await switchActivation(slide.id);
              }}
              color="primary"
            />
          </Stack>
        )}
      />
      {/* Slide form modal for create/update/delete */}
      <SlideForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedSlide}
      />
    </>
  );
}
