// React
import { useEffect, useState } from "react";

// Store
import { useJoinRequestStore } from "../store/useJoinRequestStore";

// i18next
import { useTranslation } from "react-i18next";

// Components
import EntityTable, { type Column } from "../components/EntityTable";

// Types
import type { JoinRequestModel } from "../types/joinRequest";

export default function JoinRequests() {
  const { t } = useTranslation();

  // Extract state & actions from the joinRequest store
  const {
    data: joinRequests,
    total,
    fetchJoinRequests,
  } = useJoinRequestStore();

  // Local states
  const [page, setPage] = useState(0);
  const [per_page, setPerPage] = useState(10);
  const [search, setSearch] = useState("");

  // Fetch joinRequests whenever page or per_page changes
  useEffect(() => {
    fetchJoinRequests(page, per_page, search);
  }, [page, per_page, search]);

  // Handle search from EntityTable
  const handleSearch = (value: string) => {
    setPage(0); 
    setSearch(value);
  };

  // Define columns for EntityTable
  const columns: Column<JoinRequestModel>[] = [
    { key: "id", label: "#", sortable: true },
     {
      key: "user",
      label: t("shared.name"),
      sortable: true,
      render: (_value, row) => row.user?.full_name || "-",
    },
    {
      key: "user",
      label: t("shared.email"),
      sortable: true,
      render: (_value, row) => row.user?.email || "-",
    },
    {
      key: "user",
      label: t("mobile_number"),
      sortable: true,
      render: (_value, row) => row.user?.mobile_number || "-",
    },
    { key: "classification", label: t("classification.title"), sortable: true },
     { key: "store_name", label: t("store_name"), sortable: true },
  ];

  return (
    <>
      {/* EntityTable for displaying joinRequests */}
      <EntityTable<JoinRequestModel>
        data={joinRequests as JoinRequestModel[]}
        columns={columns}
        page={page}
        per_page={per_page}
        onSearch={handleSearch}
        total={total}
        onPageChange={setPage}
        onRowsPerPageChange={setPerPage}
        showCreate={false}
        createLabel={t("create")}
      />
    </>
  );
}
