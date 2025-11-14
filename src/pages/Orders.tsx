// React
import { useEffect, useState } from "react";

// Store
import { useOrderStore } from "../store/useOrderStore";

// MUI
import { Stack, IconButton, Switch } from "@mui/material";
import { alpha } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";

// i18next
import { useTranslation } from "react-i18next";

// Components
import OrderForm from "../components/order/OrderForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { OrderModel } from "../types/order";

export default function Orders() {
  const { t } = useTranslation();

  // Extract state & actions from the order store
  const {
    data: orders,
    selected: selectedOrder,
    total,
    fetchOrders,
    changeStatus,
    setSelectedOrder
  } = useOrderStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Form state
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");

  // Fetch orders whenever page or per_page changes
  useEffect(() => {
    fetchOrders(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Open form in a specific mode (view, create, update, delete)
  const openForm = (mode: CRUDMode, order?: OrderModel) => {
    setFormMode(mode);
    if (order) {
      setSelectedOrder(order);
    }
    setFormOpen(true);
  };

  // Define columns for EntityTable
  const columns: Column<OrderModel>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "order_number", label: "Order Number", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying orders */}
      <EntityTable<OrderModel>
        data={orders as OrderModel[]}
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
        actions={(order) => (
          <Stack direction="row" spacing={1}>
            {/* View button */}
            <IconButton
              onClick={() => openForm("view", order)}
              sx={{
                bgcolor: (theme) => alpha(theme.palette.info.main, 0.1),
                color: "info.main",
                "&:hover": { bgcolor: (theme) => alpha(theme.palette.info.main, 0.2) },
              }}
            >
              <VisibilityIcon fontSize="small" />
            </IconButton>

            <Switch
              checked={true}
              onChange={async () => {
                await changeStatus(order.id);
              }}
              color="primary"
            />
          </Stack>
        )}
      />

      {/* Order form modal for create/update/delete */}
      <OrderForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={() => { }}
        mode={formMode}
        initialData={selectedOrder}
      />
    </>
  );
}
