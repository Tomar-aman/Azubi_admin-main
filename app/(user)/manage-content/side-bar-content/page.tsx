"use client";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import { Button, TextField } from "@mui/material";
import {
  EditSideBarContents,
  getAllSideBarContents,
} from "@/app/api/manageContent/manageContent";
function SideBarContent() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [state, setState] = useState({
    menu_1: "",
    menu_2: "",
    menu_3: "",
    menu_4: "",
    contact_label: "",
    contact_below_content: "",
    id: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const response = await EditSideBarContents(state);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
    setEditLoading(false);
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllSideBarContents();
    if (response.remote === "success") {
      //@ts-ignore
      if (response.data.data) setState(response.data.data);
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Side Bar Content" />

      <form onSubmit={handleUpdate}>
        <label>menu 1</label>
        <TextField
          fullWidth
          required
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="menu_1"
          value={state?.menu_1}
          onChange={handleChange}
        />

        <label>menu 2</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="menu_2"
          value={state?.menu_2}
          onChange={handleChange}
        />

        <label>menu 3</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="menu_3"
          value={state?.menu_3}
          onChange={handleChange}
        />

        <label>menu 4</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="menu_4"
          value={state?.menu_4}
          onChange={handleChange}
        />

        <label>contact label</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="contact_label"
          value={state?.contact_label}
          onChange={handleChange}
        />
        <label>Contact Below Content</label>
        <TextField
          required
          fullWidth
          id="outlined-basic"
          placeholder="Enter Heading"
          autoComplete="off"
          name="contact_below_content"
          value={state?.contact_below_content}
          onChange={handleChange}
        />

        <Button type="submit">{editLoading ? "Update..." : "Update"}</Button>
      </form>
      <ToastContainer />
    </>
  );
}

export default SideBarContent;
