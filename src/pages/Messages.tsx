// React
import { useEffect, useState } from "react";

// Store
import { useMessageStore } from "../store/useMessageStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import MessageForm from "../components/message/MessageForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { MessageModel } from "../types/message";

export default function Messages() {
  const { t } = useTranslation();

  // Extract state & actions from the message store
  const {
    data: messages,
    selected: selectedMessage,
    total,
    fetchMessages,
    setSelectedMessage
  } = useMessageStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch messages whenever page or per_page changes
  useEffect(() => {
    fetchMessages(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0); 
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, message?: MessageModel) => {
    setFormMode(mode);
    if (message) {
      setSelectedMessage(message);
    }
    setFormOpen(true);
  };

  // Define columns for EntityTable
  const columns: Column<MessageModel>[] = [
    { key: "id", label: "ID", sortable: true },
     {
      key: "user",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => row.user?.name || "-",
    }
  ];

  return (
    <>
      {/* EntityTable for displaying messages */}
      <EntityTable<MessageModel>
        data={messages as MessageModel[]}
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
        actions={(message) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", message)}
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
              onClick={() => openForm("update", message)}
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
              onClick={() => openForm("delete", message)}
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

      {/* Message form modal for create/update/delete */}
      <MessageForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={()=>{}}
        mode={formMode}
        initialData={selectedMessage}
      />
    </>
  );
}
