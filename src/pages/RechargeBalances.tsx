// React
import { useEffect, useState } from "react";

// Store
import { useRechargeBalanceStore } from "../store/useRechargeBalanceStore";

// MUI
import { Stack, IconButton } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import RechargeBalanceForm from "../components/rechargeBalance/RechargeBalanceForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { RechargeBalanceModel } from "../types/rechargeBalance";

export default function RechargeBalances() {
  const { t } = useTranslation();

  // Extract state & actions from the rechargeBalance store
  const {
    data: rechargeBalances,
    selected: selectedRechargeBalance,
    total,
    fetchRechargeBalances,
    setSelectedRechargeBalance
  } = useRechargeBalanceStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch rechargeBalances whenever page or per_page changes
  useEffect(() => {
    fetchRechargeBalances(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0); 
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, rechargeBalance?: RechargeBalanceModel) => {
    setFormMode(mode);
    if (rechargeBalance) {
      setSelectedRechargeBalance(rechargeBalance);
    }
    setFormOpen(true);
  };

  // Define columns for EntityTable
  const columns: Column<RechargeBalanceModel>[] = [
    { key: "id", label: "ID", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying rechargeBalances */}
      <EntityTable<RechargeBalanceModel>
        data={rechargeBalances as RechargeBalanceModel[]}
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
        actions={(rechargeBalance) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", rechargeBalance)}
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
              onClick={() => openForm("update", rechargeBalance)}
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
              onClick={() => openForm("delete", rechargeBalance)}
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

      {/* RechargeBalance form modal for create/update/delete */}
      <RechargeBalanceForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={()=>{}}
        mode={formMode}
        initialData={selectedRechargeBalance}
      />
    </>
  );
}
