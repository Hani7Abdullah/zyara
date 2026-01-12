// React
import { useEffect, useState } from "react";

// Store
import { usePopularTopicStore } from "../store/usePopularTopicStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

// i18next
import { useTranslation } from "react-i18next";

// Components
import PopularTopicForm from "../components/popularTopic/PopularTopicForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { PopularTopicModel } from "../types/popularTopic";

export default function PopularTopics() {
  const { t, i18n } = useTranslation();

  const {
    data: popularTopics,
    selected: selectedPopularTopic,
    total,
    fetchPopularTopics,
    createPopularTopic,
    updatePopularTopic,
    deletePopularTopic,
    setSelectedPopularTopic,
  } = usePopularTopicStore();

  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  useEffect(() => {
    fetchPopularTopics(page, per_page, search);
  }, [page, per_page, search]);

  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  const openForm = (mode: CRUDMode, popularTopic?: PopularTopicModel) => {
    setFormMode(mode);
    if (popularTopic) setSelectedPopularTopic(popularTopic);
    setFormOpen(true);
  };

  const handleConfirm = async (data?: Partial<PopularTopicModel>) => {
    try {
      if (formMode === "create" && data) await createPopularTopic(data as Omit<PopularTopicModel, "id">);
      else if (formMode === "update" && selectedPopularTopic?.id && data)
        await updatePopularTopic(selectedPopularTopic.id, data);
      else if (formMode === "delete" && selectedPopularTopic?.id) {
        await deletePopularTopic(selectedPopularTopic.id);
      setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const columns: Column<PopularTopicModel>[] = [
    { key: "id", label: "#", sortable: true },
    {
      key: "question",
      label: t("popularTopic.question"),
      sortable: true,
      render: (_value, row) => i18n.language === "en" ? row.question : row.arabic_question,
    },
    {
      key: "answer",
      label: t("popularTopic.answer"),
      sortable: true,
      render: (_value, row) => i18n.language === "en" ? row.answer : row.arabic_answer,
    },
  ];


  return (
    <>
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
