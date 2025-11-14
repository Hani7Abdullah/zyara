import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  TablePagination,
  Typography,
  TextField,
  Button,
  TableSortLabel,
  Stack,
} from "@mui/material";
import { Add, Search } from "@mui/icons-material";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import i18n from "../i18n";

export interface Column<T> {
  label: string;
  key: keyof T;
  sortable?: boolean;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface EntityTableProps<T> {
  data: T[];
  columns: Column<T>[];
  /** Current page (1-based from API) */
  page: number;
  /** Rows per page */
  per_page: number;
  /** Total rows count */
  total: number;
  /** Called when page changes (1-based page) */
  onPageChange: (newPage: number) => void;
  /** Called when per_page changes */
  onRowsPerPageChange: (rows: number) => void;
  /** Optional actions column */
  actions?: (item: T) => React.ReactNode;
  /** Optional search handler */
  onSearch?: (searchTerm: string) => void;
  /** Optional sort handler */
  onSort?: (key: keyof T, direction: "asc" | "desc") => void;
  /** Create button handler */
  onCreateClick?: () => void;
  /** Show Create button */
  showCreate?: boolean;
  /** Create button label */
  createLabel?: string;
  /** Show search input */
  searchable?: boolean;
}

export default function EntityTable<T>({
  data,
  columns,
  page,
  per_page,
  total,
  onPageChange,
  onRowsPerPageChange,
  actions,
  onSearch,
  onSort,
  onCreateClick,
  showCreate = false,
  createLabel = "Create",
  searchable = true,
}: EntityTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });

  const { t } = useTranslation();
  const currentLang = i18n.language;

  const handleSort = (key: keyof T) => {
    const isAsc = sortConfig.key === key && sortConfig.direction === "asc";
    const direction = isAsc ? "desc" : "asc";
    setSortConfig({ key, direction });
    onSort?.(key, direction);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    onSearch?.(value);
  };

  // Convert 1-based `page` (API) → 0-based `TablePagination`
  const muiPage = page > 0 ? page - 1 : 0;

  const handlePageChange = (_: unknown, newMuiPage: number) => {
    // Convert back to 1-based before passing to parent
    onPageChange(newMuiPage + 1);
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        "& .MuiTablePagination-actions svg": {
          transform: currentLang === "ar" ? "rotate(180deg)" : "rotate(0deg)",
        },
      }}
    >
      {/* --- Top Bar (Search + Create Button) --- */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        p={2}
        pt={4}
      >
        {searchable && (
          <TextField
            size="small"
            placeholder={`${t("search")}...`}
            value={search}
            onChange={handleSearchChange}
            sx={{ width: "50%" }}
            slotProps={{
              input: {
                startAdornment: <Search fontSize="small" sx={{ mr: 1 }} />,
              },
            }}
          />
        )}

        {showCreate && onCreateClick && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={onCreateClick}
          >
            {createLabel}
          </Button>
        )}
      </Stack>

      {/* --- Table --- */}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={String(col.key)} sx={{ fontWeight: "bold" }}>
                  {col.sortable ? (
                    <TableSortLabel
                      active={sortConfig.key === col.key}
                      direction={sortConfig.direction}
                      onClick={() => handleSort(col.key)}
                    >
                      {col.label}
                    </TableSortLabel>
                  ) : (
                    col.label
                  )}
                </TableCell>
              ))}
              {actions && (
                <TableCell sx={{ fontWeight: "bold" }}>
                  {t("table.actions")}
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((row, idx) => (
              <TableRow key={idx} sx={{ "& td": { py: 1 } }}>
                {columns.map((col) => (
                  <TableCell key={String(col.key)}>
                    {col.render
                      ? col.render(row[col.key], row)
                      : String(row[col.key])}
                  </TableCell>
                ))}
                {actions && <TableCell>{actions(row)}</TableCell>}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* --- No Data Message --- */}
      {data.length === 0 && (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="center"
          p={2}
          sx={{ minHeight: "40vh" }}
        >
          <Typography fontSize="16px" fontWeight={600}>
            {t("table.no-data")}
          </Typography>
        </Stack>
      )}

      {/* --- Pagination --- */}
      <TablePagination
        component="div"
        count={total}
        page={muiPage}
        rowsPerPage={per_page}
        onPageChange={handlePageChange}
        onRowsPerPageChange={(e) =>
          onRowsPerPageChange(parseInt(e.target.value, 10))
        }
        labelRowsPerPage={t("table.rows-per-page")}
      />
    </Paper>
  );
}
