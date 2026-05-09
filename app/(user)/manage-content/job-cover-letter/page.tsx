"use client";

import { Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import Title from "@/app/components/title.components";
import { Box, Button, Grid } from "@mui/material";

import { SVG } from "@/app/components/icon";
import { useEffect, useState } from "react";
import TextEditor from "../textEditor/textEditor";
import {
  EditContents,
  getAllContents,
} from "@/app/api/manageContent/manageContent";
import CustomLoader from "@/app/components/SpinLoader";
import { ManageContentEditTypes } from "@/app/api/manageContent/manageContent.Types";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const JobCoverLetter = () => {
  const [content, setContent] = useState("");
  const [coverLetterFieldName, setCoverLetterFieldName] = useState("");
  const [id, setId] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [alertVariant, setAlertVariant] = useState("");
  const [editLoading, setEditLoading] = useState(false);
  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllContents();
    if (response.remote === "success") {
      setContent(response.data.data.jobCoverLetter);
      setCoverLetterFieldName(response.data.data.coverLetterFieldName);
      setId(response.data.data.id);
    }
    setIsLoading(false);
  };
  const handleUpdate = async () => {
    setEditLoading(true);
    const payload: ManageContentEditTypes = {
      id,
      jobCoverLetter: content,
      coverLetterFieldName,
    };
    const response = await EditContents(payload);
    if (response.remote === "success") {
      const notify = () => toast.info("Job Cover Letter updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating Job Cover Letter");
      notify();
    }
    setEditLoading(false);
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Job Cover Letter" />
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <TextField
          value={coverLetterFieldName}
          placeholder="Field Title"
          onChange={(e) => {
            setCoverLetterFieldName(e.target.value);
          }}
          sx={{ width: "50%" }}
        />
      </Stack>

      <Card elevation={0} sx={{ borderRadius: "10px" }}>
        <TextEditor content={content} setContent={setContent} />
      </Card>
      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ fontWeight: "700" }}
          onClick={handleUpdate}
        >
          <SVG.Save style={{ marginRight: "10px" }} />{" "}
          {editLoading ? "Update..." : "Update"}
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default JobCoverLetter;
