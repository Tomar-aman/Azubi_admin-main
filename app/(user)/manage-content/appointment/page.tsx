"use client";
import {
  Card,
  CardContent,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import Title from "@/app/components/title.components";
import { Box, Button } from "@mui/material";

import { SVG } from "@/app/components/icon";
import TextEditor from "../textEditor/textEditor";
import { useEffect, useState } from "react";
import {
  EditContents,
  getAllContents,
} from "@/app/api/manageContent/manageContent";
import CustomLoader from "@/app/components/SpinLoader";
import { ManageContentEditTypes } from "@/app/api/manageContent/manageContent.Types";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const AppointmentLetter = () => {
  const [content, setContent] = useState("");
  const [appointmentFieldName, setAppointmentFieldName] = useState("");
  const [id, setId] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllContents();
    if (response.remote === "success") {
      setContent(response.data.data.appointment);
      setAppointmentFieldName(response.data.data.appointmentFieldName);
      setId(response.data.data.id);
    }
    setIsLoading(false);
  };
  const handleUpdate = async () => {
    setEditLoading(true);
    const payload: ManageContentEditTypes = {
      id,
      appointment: content,
      appointmentFieldName,
    };
    const response = await EditContents(payload);
    if (response.remote === "success") {
      const notify = () =>
        toast.info("Appointment Letter updated successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating Appointment Letter");
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

      <Title heading="Appointment Letter" />
      <Stack
        direction={"row"}
        spacing={2}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ mb: 2 }}
      >
        <TextField
          value={appointmentFieldName}
          placeholder="Field Title"
          onChange={(e) => {
            setAppointmentFieldName(e.target.value);
          }}
          sx={{ width: "50%" }}
        />
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: "10px",
          "& .ql-container.ql-snow": {
            height: "230px",
          },
        }}
      >
        <CardContent>
          <TextEditor
            content={content}
            setContent={setContent}
            // style={{ height: "200px" }}
          />
        </CardContent>
      </Card>
      <Box sx={{ textAlign: "right", mt: 3 }} onClick={handleUpdate}>
        <Button
          variant="outlined"
          sx={{ fontWeight: "700" }}
          disabled={editLoading}
        >
          <SVG.Save style={{ marginRight: "10px" }} />{" "}
          {editLoading ? "Update..." : "Update"}
        </Button>
      </Box>
      <ToastContainer />
    </>
  );
};

export default AppointmentLetter;
