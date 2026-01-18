"use client";

// React
import { useEffect, useState } from "react";

// Store
import { useCurrencyStore } from "../store/useCurrencyStore";

// MUI
import { Stack, IconButton, Button } from "@mui/material";
import { alpha } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SyncIcon from "@mui/icons-material/Sync";

// i18next
import { useTranslation } from "react-i18next";

// Components
import CurrencyForm from "../components/currency/CurrencyForm";
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { CRUDMode } from "../types/common";
import type { CurrencyModel } from "../types/currency";

export default function Currencies() {
  const { t } = useTranslation();

  const {
    data: currencies,
    selected: selectedCurrency,
    total,
    fetchCurrencies,
    createCurrency,
    updateCurrency,
    updateCurrencyRate,
    deleteCurrency,
    setSelectedCurrency,
  } = useCurrencyStore();

  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<CRUDMode>("create");
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    fetchCurrencies(page, per_page, search);
  }, [page, per_page, search]);

  const handleSearch = (value: string) => {
    setPage(0);
    setSearch(value);
  };

  const openForm = (mode: CRUDMode, currency?: CurrencyModel) => {
    setFormMode(mode);
    if (currency) setSelectedCurrency(currency);
    setFormOpen(true);
  };

  const handleConfirm = async (data: FormData) => {
    try {
      if (formMode === "create" && data) await createCurrency(data);
      else if (formMode === "update" && selectedCurrency?.id && data)
        await updateCurrency(selectedCurrency.id, data);
      else if (formMode === "delete" && selectedCurrency?.id) {
        await deleteCurrency(selectedCurrency.id);
        setFormOpen(false);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Refresh currency rates
  const handleRefreshRate = async () => {
    try {
      setRateLoading(true);
      await updateCurrencyRate();
    } catch (err) {
      console.error(err);
    } finally {
      setRateLoading(false);
    }
  };

  const columns: Column<CurrencyModel>[] = [
    { key: "id", label: "#", sortable: true },
    { key: "code", label: t("currency.code"), sortable: true },
    { key: "symbol", label: t("currency.symbol"), sortable: true },
    {
      key: "rate",
      label: t("currency.rate"),
      sortable: true,
      render: (value) => Number(value).toString() + ` (${t("shared.syp")})`
    },
  ];

  return (
    <>
      {/* Refresh Button */}
      <Stack direction="row" mb={2}>
        <Button
          variant="outlined"
          disabled={rateLoading}
          endIcon={
            <SyncIcon
              sx={{
                ...(rateLoading && {
                  animation: "spin 1s linear infinite",
                }),
              }}
            />
          }
          sx={{
            py: 1.5,
            "@keyframes spin": {
              "0%": { transform: "rotate(0deg)" },
              "100%": { transform: "rotate(360deg)" },
            },
          }}
          onClick={handleRefreshRate}
        >
          {rateLoading ? t("currency.refreshing") : t("currency.refresh-live")}
        </Button>
      </Stack>

      {/* Currency Table */}
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
        onCreateClick={() => openForm("create")}
        actions={(currency) => (
          <Stack direction="row" spacing={1}>
            {currency.id !== 1 ? (
              <>
                <IconButton
                  onClick={() => openForm("update", currency)}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
                    color: "warning.main",
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.warning.main, 0.2),
                    },
                  }}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  onClick={() => openForm("delete", currency)}
                  sx={{
                    bgcolor: (theme) => alpha(theme.palette.error.main, 0.1),
                    color: "error.main",
                    "&:hover": {
                      bgcolor: (theme) => alpha(theme.palette.error.main, 0.2),
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </>
            ) : (
              "-"
            )}
          </Stack>
        )}
      />

      {/* Currency Form Modal */}
      <CurrencyForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onConfirm={handleConfirm}
        mode={formMode}
        initialData={selectedCurrency}
      />
    </>
  );
}
