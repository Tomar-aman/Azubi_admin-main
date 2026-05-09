"use client";
import React, { useEffect, useState, useCallback } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import { Button, TextField, Box } from "@mui/material";
import {
  EditJobMarketContents,
  getAllJobMarketContents,
} from "@/app/api/manageContent/manageContent";
import TextEditor from "../textEditor/textEditor";

const JobMarket = () => {
  const [loading, setLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [state, setState] = useState({
    heading: "",
    subHeading: "",
    description: "",
    sidebarText: "",
    sidebarColor: "",
    id: "",
    bottomBarColor: "",
    linkText: "",
    linkUrl: "",
  });

  const handleChange = useCallback(
    (e: { target: { name: any; value: any } }) => {
      const { name, value } = e.target;
      setState((prevState) => ({ ...prevState, [name]: value }));
    },
    []
  );

  const handleUpdate = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setEditLoading(true);
    const response = await EditJobMarketContents(state);
    response.remote === "success"
      ? toast.info("Update successful!")
      : toast.error("Error updating job market");
    setEditLoading(false);
  };

  const handleGetAllContent = useCallback(async () => {
    setLoading(true);
    const response: any = await getAllJobMarketContents();
    if (response.remote === "success" && response.data?.data) {
      setState(response.data.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    handleGetAllContent();
  }, [handleGetAllContent]);

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Job Market" />
      <form onSubmit={handleUpdate}>
        <TextField
          fullWidth
          required
          label="Heading"
          placeholder="Enter Heading"
          name="heading"
          value={state.heading}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          required
          label="Description"
          placeholder="Enter Description"
          name="description"
          value={state.description}
          onChange={handleChange}
        />
        <TextField
          fullWidth
          required
          label="Subheading"
          placeholder="Enter Subheading"
          name="subHeading"
          value={state.subHeading}
          onChange={handleChange}
        />
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <TextEditor
            content={state.sidebarText}
            setContent={(content) =>
              handleChange({ target: { name: "sidebarText", value: content } })
            }
          />
          <TextField
            required
            fullWidth
            type="color"
            name="sidebarColor"
            style={{ width: "50vh" }}
            value={state.sidebarColor}
            onChange={handleChange}
          />
          <TextField
            required
            label="Bottom-Bar-Color"
            fullWidth
            type="color"
            name="bottomBarColor"
            style={{ width: "50vh" }}
            value={state.bottomBarColor}
            onChange={handleChange}
          />
        </Box>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          mt={2}
        >
          <TextField
            fullWidth
            required
            label="Link Text"
            placeholder="Enter link text"
            name="linkText"
            value={state.linkText}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            type="url"
            required
            placeholder="Enter link url"
            autoComplete="off"
            name="linkUrl"
            value={state.linkUrl}
            onChange={handleChange}
          />
        </Box>
        <Button type="submit" disabled={editLoading}>
          {editLoading ? "Updating..." : "Update"}
        </Button>
      </form>
      <ToastContainer />
    </>
  );
};

export default JobMarket;
