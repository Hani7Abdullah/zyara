// React
import { useEffect, useState } from "react";

// Store
import { useClientStore } from "../store/useClientStore";

// MUI
import { Stack, IconButton, Switch, Avatar } from "@mui/material";
import { alpha } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import ClientForm from "../components/client/ClientForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { ClientModel } from "../types/client";

export default function Clients() {
  const { t } = useTranslation();

  // Extract state & actions from the client store
  const {
    data: clients,
    selected: selectedClient,
    total,
    fetchClients,
    switchActivation,
    setSelectedClient
  } = useClientStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch clients whenever page or per_page changes
  useEffect(() => {
    fetchClients(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, client?: ClientModel) => {
    setFormMode(mode);
    if (client) {
      setSelectedClient(client);
    }
    setFormOpen(true);
  };

  // Define columns for EntityTable
  const columns: Column<ClientModel>[] = [
    { key: "id", label: "#", sortable: true },

    {
      key: "full_name",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => (
        <Stack direction="row" columnGap={1} alignItems="center">
          <Avatar
            src={row.image}
            alt={row.full_name}
            sx={{ width: 32, height: 32 }}
          />
          {row.full_name}
        </Stack>
      ),
    },

    { key: "email", label: t("shared.email"), sortable: true },
    { key: "mobile_number", label: t("mobile_number"), sortable: true },
    { key: "country", label: t("client.country"), sortable: true },

  ];

  return (
    <>
      {/* EntityTable for displaying clients */}
      <EntityTable<ClientModel>
        data={clients as ClientModel[]}
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
        actions={(client) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", client)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.info.main, 0.2) },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>

            {/* Switch Account toggle */}
            <Switch
              checked={client.is_active}
              onChange={async () => {
                await switchActivation(client.id);
              }}
              color="primary"
            />
          </Stack>
        )}
      />

      {/* Client form modal for create/update/delete */}
      <ClientForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={() => { }}
        mode={formMode}
        initialData={selectedClient}
      />
    </>
  );
}
