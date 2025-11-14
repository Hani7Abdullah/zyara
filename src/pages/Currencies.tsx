// React
import { useEffect, useState } from "react";

// Store
import { useCurrencyStore } from "../store/useCurrencyStore";

// MUI
import { Stack, Switch } from "@mui/material";

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CurrencyModel } from "../types/currency";

export default function Currencies() {
  const { t } = useTranslation();

  // Extract state & actions from the currency store
  const {
    data: currencies,
    total,
    fetchCurrencies,
    switchActivation,
  } = useCurrencyStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");


  // Fetch currencies whenever page or per_page changes
  useEffect(() => {
    fetchCurrencies(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  // Define columns for EntityTable
  const columns: Column<CurrencyModel>[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "code", label: "Code", sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying currencies */}
      <EntityTable<CurrencyModel>
        data={currencies as CurrencyModel[]}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate
        createLabel={t("create")}
        actions={(currency) => (
          <Stack direction="row" spacing={1}>
            {/* Switch Account toggle */}
            <Switch
              checked={currency.is_active} 
              onChange={async () => {
                await switchActivation(currency.id);
              }}
              color="primary"
            />
          </Stack>
        )}
      />
    </>
  );
}
