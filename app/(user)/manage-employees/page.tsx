"use client";

import { SVG } from "@/app/components/icon";
import { Box, Button, Chip, Stack, IconButton } from "@mui/material";
import Title from "@/app/components/title.components";
import Filter from "@/app/components/filter";
import CustomTable from "@/app/components/table";
import { useEffect, useState } from "react";
import DeleteModal from "@/app/components/delete.modal.components";
import {
  getAllManagedEmployees,
  deleteManagedEmployee,
  toggleManagedEmployeeStatus,
  ManagedEmployee,
} from "@/app/api/managedEmployee/managedEmployee";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const COLUMNS = [
  { id: 1, name: "Name", key: "name" },
  { id: 2, name: "Email", key: "email" },
  { id: 3, name: "Position", key: "position" },
  { id: 4, name: "Permissions", key: "permissions" },
  { id: 5, name: "Status", key: "status" },
  { id: 6, name: "Added By", key: "addedBy" },
  { id: 7, name: "Action", key: "action" },
];

const ManageEmployeesPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  const [rows, setRows] = useState<ManagedEmployee[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState("10");
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ManagedEmployee | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState("");
  const [mount, setMount] = useState(false);

  const fetchEmployees = async () => {
    setLoading(true);
    const res = await getAllManagedEmployees({ pageNo, recordPerPage, searchValue });
    if (res.remote === "success") {
      setRows(res.data.data.employees);
      setPageCount(res.data.data.count);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (emp: ManagedEmployee) => {
    setTogglingId(emp._id);
    const res = await toggleManagedEmployeeStatus(emp._id);
    if (res.remote === "success") {
      toast.info("Status updated!");
      setRows((prev) =>
        prev.map((e) =>
          e._id === emp._id
            ? { ...e, status: e.status === "Active" ? "Inactive" : "Active" }
            : e
        )
      );
    } else {
      toast.error("Failed to update status");
    }
    setTogglingId("");
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleteLoading(true);
    const res = await deleteManagedEmployee(deleteTarget._id);
    if (res.remote === "success") {
      toast.info("Employee deleted!");
      setRows((prev) => prev.filter((e) => e._id !== deleteTarget._id));
    } else {
      toast.error("Error deleting employee");
    }
    setDeleteModal(false);
    setIsDeleteLoading(false);
  };

  const buildRow = (emp: ManagedEmployee) => ({
    name: (
      <span
        style={{ cursor: "pointer", color: "#2894A2" }}
        onClick={() => router.push(`/manage-employees/add?id=${emp._id}`)}
      >
        {emp.name}
      </span>
    ),
    email: emp.email,
    position: emp.position ?? "—",
    permissions: (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {emp.permissions.length === 0 ? (
          <Chip label="No permissions" size="small" />
        ) : (
          emp.permissions.slice(0, 2).map((p) => (
            <Chip key={p} label={p} size="small" color="info" variant="outlined" />
          ))
        )}
        {emp.permissions.length > 2 && (
          <Chip label={`+${emp.permissions.length - 2} more`} size="small" />
        )}
      </Box>
    ),
    status: (
      <span
        style={{
          cursor: "pointer",
          color: togglingId === emp._id ? "#999" : "#0096A4",
          fontWeight: 500,
        }}
        onClick={() => togglingId !== emp._id && handleToggleStatus(emp)}
      >
        {togglingId === emp._id ? "Processing..." : emp.status}
      </span>
    ),
    addedBy: <span style={{ color: "#555", fontWeight: 500 }}>{emp.createdByName ?? "Superadmin"}</span>,
    action: (
      <Stack
        direction="row"
        spacing={1}
        sx={{ "& .MuiButtonBase-root": { color: "#0096A4", "&:hover": { color: "#F1841D" } } }}
      >
        <IconButton onClick={() => router.push(`/manage-employees/add?id=${emp._id}`)}>
          <SVG.Edit />
        </IconButton>
        <IconButton
          onClick={() => {
            setDeleteTarget(emp);
            setDeleteModal(true);
          }}
        >
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  });

  useEffect(() => { fetchEmployees(); }, [pageNo, recordPerPage]);
  useEffect(() => { if (debouncedSearch) fetchEmployees(); }, [debouncedSearch]);
  useEffect(() => {
    if (!searchValue && mount) fetchEmployees();
    setMount(true);
  }, [searchValue]);

  return (
    <>
      <Title heading="Manage Employees" />
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Filter
          filter=""
          onFilterChange={() => {}}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterOptions={[]}
        />
        <Link href="/manage-employees/add">
          <Button
            disableRipple
            sx={{ fontSize: "20px", color: "#646464", "&:hover": { color: "#0096A4" } }}
          >
            <SVG.AddIcon className="svgActive" style={{ marginRight: "8px" }} /> Add
          </Button>
        </Link>
      </Stack>
      <Box sx={{ overflow: "hidden", position: "relative" }}>
        <CustomTable
          columns={COLUMNS}
          rows={rows.map(buildRow)}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <DeleteModal
        open={isDeleteModal}
        handleClose={() => setDeleteModal(false)}
        onConfirm={handleDelete}
        loading={isDeleteLoading}
      />
      <ToastContainer />
    </>
  );
};

export default ManageEmployeesPage;
