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
import AddEditContacts from "./addEdit.components";

import { useDebounce } from "@uidotdev/usehooks";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addContact,
  deleteContact,
  editContact,
  getContactsByFilter,
} from "@/app/api/contact/contact";
import {
  GetAllContactsType,
  TransformContact,
} from "@/app/api/contact/contact.types";
import { COLUMS_DATA } from "./helper";

const ManageContacts = () => {
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [isContacts, setIsContacts] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [recordPerPage, setRecordPerPage] = useState<string>("5");
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [pageNo, setPageNo] = useState<number>(1);
  const [rowData, setRowData] = useState<TransformContact[]>([]);
  const [searchValue, setSearchValue] = useState<string>("");
  const debouncedSearchTerm = useDebounce(searchValue, 300);
  const [mount, setMount] = useState(false);
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string>("");
  const [error, setError] = useState("");
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [saveModelLoading, setSaveModelLoading] = useState(false);

  const clearAllState = () => {
    setIsContacts(false);
    setDeleteModal(false);
    setId("");
    setName("");
    setPhoneNumber("");
    setEmail("");
    setMessage("");
  };

  const handleContacts = () => {
    setIsContacts(true);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = async () => {
    if (id) {
      await handleEditContact();
    } else {
      await handleAddContact(name, phoneNumber, email, message);
    }
    clearAllState();
  };

  const handleGetAll = async (isLoadingShow?: boolean) => {
    if (isLoadingShow) {
      setLoading(true);
    }
    const payload: GetAllContactsType = {
      searchValue,
      pageNo,
      recordPerPage,
    };
    const response = await getContactsByFilter(payload);
    if (response.remote === "success") {
      setRowData(response.data.data.data);
      setPageCount(response.data.data.count);
    }
    setLoading(false);
  };

  const ContactsTableRow = (rowData: any) => ({
    id: rowData.id,
    name: rowData.name,
    phoneNumber: rowData.phoneNumber,
    email: rowData.email,
    message: rowData.message,
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
            handleContacts();
            setId(rowData.id);
            setName(rowData.name);
            setPhoneNumber(rowData.phoneNumber);
            setEmail(rowData.email);
            setMessage(rowData.message);
          }}
        >
          <SVG.ContentIcon />
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

  const handleAddContact = async (
    name: string,
    phoneNumber: string,
    email: string,
    message: string
  ) => {
    setSaveModelLoading(true);
    const data = await addContact({ name, phoneNumber, email, message });
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Add contact successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error adding contact");
      notify();
    }
    setSaveModelLoading(false);
  };

  const handleEditContact = async () => {
    setSaveModelLoading(true);
    const payload = {
      _id: id,
      name,
      phoneNumber,
      email,
      message,
    };
    const data = await editContact(payload);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Contact updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating contact");
      notify();
    }
    setSaveModelLoading(false);
  };

  const handleDeleteContact = async (id: string) => {
    setIsDeleteLoading(true);
    const data = await deleteContact(id);
    if (data.remote === "success") {
      await handleGetAll();
      const notify = () => toast.info("Delete contact successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error deleting contact");
      notify();
    }
    setIsDeleteLoading(false);
  };

  const onConfirm = async () => {
    await handleDeleteContact(id);
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
      <Title heading="Manage Contacts" />
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
        {/* <Button
          onClick={() => handleContacts()}
          disableRipple={true}
          sx={{
            fontSize: "20px",
            color: "#646464",
            "&:hover": { color: "#0096A4" },
          }}
        >
          <SVG.AddIcon className="svgActive" style={{ marginRight: "8px" }} />{" "}
          Add
        </Button> */}
      </Stack>
      <Box sx={{ overflow: "hidden", position: "relative" }}>
        <CustomTable
          columns={COLUMS_DATA}
          rows={rowData?.map((row) => ContactsTableRow(row)) || []}
          pageCount={pageCount}
          setRecordPerPage={setRecordPerPage}
          recordPerPage={recordPerPage}
          setPageNo={setPageNo}
          pageNo={pageNo}
          loading={loading}
        />
      </Box>
      <IModal
        open={isContacts}
        handleClose={() => setIsContacts(false)}
        maxWidth="450px"
      >
        <AddEditContacts
          handleClose={handleClose}
          name={name}
          setName={setName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          email={email}
          setEmail={setEmail}
          message={message}
          setMessage={setMessage}
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

export default ManageContacts;
