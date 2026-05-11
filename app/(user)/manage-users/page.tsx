"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  Chip,
  Stack,
  IconButton,
} from "@mui/material";
import Title from "@/app/components/title.components";
import Filter from "@/app/components/filter";
import CustomTable from "@/app/components/table";
import { useEffect, useState } from "react";
import DeleteModal from "@/app/components/delete.modal.components";
import {
  getAllManagedUsers,
  deleteManagedUser,
  toggleManagedUserStatus,
} from "@/app/api/managedUser/managedUser";
import { ManagedUser } from "@/app/api/managedUser/managedUser.types";
import { useRouter } from "next/navigation";
import { useDebounce } from "@uidotdev/usehooks";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

const COLUMNS = [
  { id: 1, name: "Username", key: "username" },
  { id: 2, name: "Email", key: "email" },
  { id: 3, name: "Permissions", key: "permissions" },
  { id: 4, name: "Status", key: "status" },
  { id: 5, name: "Added By", key: "addedBy" },
  { id: 6, name: "Created", key: "createdAt" },
  { id: 7, name: "Action", key: "action" },
];

const ManageUsersPage = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebounce(searchValue, 300);
  const [rows, setRows] = useState<ManagedUser[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [recordPerPage, setRecordPerPage] = useState("10");
  const [pageNo, setPageNo] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ManagedUser | null>(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState("");
  const [mount, setMount] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getAllManagedUsers({ pageNo, recordPerPage, searchValue });
    if (res.remote === "success") {
      setRows(res.data.data.users);
      setPageCount(res.data.data.count);
    }
    setLoading(false);
  };

  const handleToggleStatus = async (user: ManagedUser) => {
    setTogglingId(user._id);
    const res = await toggleManagedUserStatus(user._id);
    if (res.remote === "success") {
      toast.info("Status updated!");
      setRows((prev) =>
        prev.map((u) =>
          u._id === user._id
            ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
            : u
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
    const res = await deleteManagedUser(deleteTarget._id);
    if (res.remote === "success") {
      toast.info("User deleted successfully!");
      setRows((prev) => prev.filter((u) => u._id !== deleteTarget._id));
    } else {
      toast.error("Error deleting user");
    }
    setDeleteModal(false);
    setIsDeleteLoading(false);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString("de-DE");

  const buildRow = (user: ManagedUser) => ({
    username: (
      <span
        style={{ cursor: "pointer", color: "#2894A2" }}
        onClick={() => router.push(`/manage-users/add?id=${user._id}`)}
      >
        {user.username}
      </span>
    ),
    email: user.email,
    permissions: (
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
        {user.permissions.length === 0 ? (
          <Chip label="No permissions" size="small" />
        ) : (
          user.permissions.slice(0, 3).map((p) => (
            <Chip key={p} label={p} size="small" color="primary" variant="outlined" />
          ))
        )}
        {user.permissions.length > 3 && (
          <Chip label={`+${user.permissions.length - 3} more`} size="small" />
        )}
      </Box>
    ),
    status: (
      <span
        style={{ cursor: "pointer", color: togglingId === user._id ? "#999" : "#0096A4", fontWeight: 500 }}
        onClick={() => togglingId !== user._id && handleToggleStatus(user)}
      >
        {togglingId === user._id ? "Processing..." : user.status}
      </span>
    ),
    addedBy: <span style={{ color: "#555", fontWeight: 500 }}>{user.createdByName ?? "Superadmin"}</span>,
    createdAt: formatDate(user.createdAt),
    action: (
      <Stack
        direction="row"
        spacing={1}
        sx={{ "& .MuiButtonBase-root": { color: "#0096A4", "&:hover": { color: "#F1841D" } } }}
      >
        <IconButton onClick={() => router.push(`/manage-users/add?id=${user._id}`)}>
          <SVG.Edit />
        </IconButton>
        <IconButton
          onClick={() => {
            setDeleteTarget(user);
            setDeleteModal(true);
          }}
        >
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  });

  useEffect(() => { fetchUsers(); }, [pageNo, recordPerPage]);
  useEffect(() => { if (debouncedSearch) fetchUsers(); }, [debouncedSearch]);
  useEffect(() => {
    if (!searchValue && mount) fetchUsers();
    setMount(true);
  }, [searchValue]);

  return (
    <>
      <Title heading="Manage Users" />
      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Filter
          filter=""
          onFilterChange={() => {}}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filterOptions={[]}
        />
        <Link href="/manage-users/add">
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

export default ManageUsersPage;
