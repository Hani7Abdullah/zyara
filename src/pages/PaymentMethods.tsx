// React
import { useEffect, useState } from "react";

// Store
import { usePaymentMethodStore } from "../store/usePaymentMethodStore";

// MUI
import { Stack, Switch } from "@mui/material";

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { PaymentMethodModel } from "../types/paymentMethod";

export default function PaymentMethods() {
  const { t } = useTranslation();

  // Extract state & actions from the paymentMethod store
  const {
    data: paymentMethods,
    total,
    fetchPaymentMethods,
    switchActivation,
  } = usePaymentMethodStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");


  // Fetch paymentMethods whenever page or per_page changes
  useEffect(() => {
    fetchPaymentMethods(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Define columns for EntityTable
  const columns: Column<PaymentMethodModel>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "name", label: "Name", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying paymentMethods */}
      <EntityTable<PaymentMethodModel>
        data={paymentMethods as PaymentMethodModel[]}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate
        createLabel={t("create")}
        actions={(paymentMethod) => (
          <Stack direction="row" spacing={1}>
            {/* Switch Account toggle */}
            <Switch
              checked={paymentMethod.is_active} 
              onChange={async () => {
                await switchActivation(paymentMethod.id);
              }}
              color="primary"
            />
          </Stack>
        )}
      />
    </>
  );
}
