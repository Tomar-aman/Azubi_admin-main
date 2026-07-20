"use client";

import { SVG } from "@/app/components/icon";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
} from "@mui/material";

import Title from "@/app/components/title.components";
import CustomTable from "@/app/components/table";
import DeleteModal from "@/app/components/delete.modal.components";
import { useEffect, useState } from "react";
import IModal from "@/app/components/modal.components";
import AddEditTips from "./addEdit.components";

import { useDebounce } from "@uidotdev/usehooks";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addTip,
  deleteTip,
  editTip,
  getTipsByFilter,
} from "@/app/api/applicationTip/tip";
import { COLUMNS_DATA } from "./helper";
import {
  GetAllTipsType,
  TransformApplicationTip,
} from "@/app/api/applicationTip/tip.types";

const ManageTips = () => {
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isTips, setIsTips] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("10");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [rowData, setRowData] = useState<TransformApplicationTip[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [saveModelLoading, setSaveModelLoading] = useState(false);

  const clearAllState = () => {
    setIsTips(false);
    setDeleteModal(false);
    setId("");
    setTitle("");
    setDescription("");
  };

  const handleTips = () => {
    setIsTips(true);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = async () => {
    if (id) {
      await handleEditTip();
    } else {
      await handleAddTip(title, description);
    }
    clearAllState();
  };

  const handleGetAll = async (isLoadingShow?: boolean) => {
    if (isLoadingShow) {
      setLoading(true);
    }
    const payload: GetAllTipsType = {
      searchValue,
      pageNo,
      recordPerPage,
    };
    const response = await getTipsByFilter(payload);
    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };

  const TipsTableRow = (rowData: any) => ({
    id: rowData.id,
    title: rowData.title,
    description: rowData.description,
    action: (
      <Stack
        direction="row"
        spacing={2}
        alignItems={"center"}
        sx={{
          "& .MuiButtonBase-root": {
            color: "#0096A4",
            px: 0,
            "&:hover": {
              color: "#F1841D",
            },
          },
        }}
      >
        <IconButton
          disableRipple={true}
          onClick={() => {
            handleTips();
            setId(rowData.id);
            setTitle(rowData.title);
            setDescription(rowData.description);
          }}
        >
          <SVG.Edit />
        </IconButton>

        <IconButton
          onClick={() => {
            handleDeleteModal();
            setId(rowData.id);
          }}
          disableRipple={true}
        >
          <SVG.Delete />
        </IconButton>
      </Stack>
    ),
  });

  const handleAddTip = async (title: string, description: string) => {
    setSaveModelLoading(true);
    const data = await addTip({ title, description });
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Add tip successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error adding tip");
      notify();
    }
    setSaveModelLoading(false);
  };

  const handleEditTip = async () => {
    setSaveModelLoading(true);
    const payload = {
      _id: id,
      title,
      description,
    };
    const data = await editTip(payload);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Tip updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating tip");
      notify();
    }
    setSaveModelLoading(false);
  };

  const handleDeleteTip = async (id: string) => {
    setIsDeleteLoading(true);
    const data = await deleteTip(id);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Delete tip successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error deleting tip");
      notify();
    }
    setIsDeleteLoading(false);
  };

  const onConfirm = async () => {
    await handleDeleteTip(id);
    clearAllState();
  };

  useEffect(() => {
    handleGetAll(true);
  }, [pageNo, recordPerPage]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      handleGetAll(true);
    }
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!searchValue && mount) {
      handleGetAll(true);
    }
    setMount(true);
  }, [searchValue]);

  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000); // 5000 milliseconds = 5 seconds

      // Clear the timeout if the component unmounts before the 5 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  return (
    <>
      <Title heading="Manage Tips" />
      {error && <ErrorAlert severity="error" message={error} />}
      <Stack
        direction={"row"}
        spacing={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <TextField
          onChange={(e) => {
            setSearchValue(e.target.value);
          }}
          sx={{
            "& .MuiInputBase-root": {
              color: "rgba(0, 0, 0, 0.60)",
              background: "transparent !important",
              borderRadius: "0px",
              border: "0px",
              padding: "0px",
              "& .MuiInputBase-input": {
                padding: "0px",
              },
            },
            "& input::placeholder": {
              color: "rgba(0, 0, 0, 0.60)",
              opacity: 1,
            },
          }}
          placeholder="Search"
          id="input-with-icon-textfield"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SVG.Search />
              </InputAdornment>
            ),
          }}
          variant="outlined"
        />
        <Button
          onClick={() => handleTips()}
          disableRipple={true}
          sx={{
            fontSize: "20px",
            color: "#646464",
            "&:hover": { color: "#0096A4" },
          }}
        >
          <SVG.AddIcon className="svgActive" style={{ marginRight: "8px" }} />{" "}
          Add
        </Button>
      </Stack>
      <Box sx={{ overflow: "hidden", position: "relative" }}>
        <CustomTable
          columns={COLUMNS_DATA}
          rows={rowData?.map((row) => TipsTableRow(row)) || []}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <IModal
        open={isTips}
        handleClose={() => setIsTips(false)}
        maxWidth="450px"
      >
        <AddEditTips
          handleClose={handleClose}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          clearAllState={clearAllState}
          loading={saveModelLoading}
        />
      </IModal>
      <DeleteModal
        open={isDeleteModal}
        handleClose={clearAllState}
        onConfirm={onConfirm}
        loading={isDeleteLoading}
      />
      <ToastContainer />
    </>
  );
};

export default ManageTips;
