"use client";

import React, { useEffect, useState } from "react";
import { TextField, Box, Typography, Button } from "@mui/material";
import { manageCityContent, updateCityContent } from "@/app/api/city/city";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ManageCityContent: React.FC = () => {
  const [heading, setHeading] = useState<string>("");
  const [subheading, setSubheading] = useState<string>("");
  const [bottomHeading, setBottomHeading] = useState<string>("");
  const [firstButtonText, setFirstButtonText] = useState<string>("");
  const [secondButtonText, setSecondButtonText] = useState<string>("");
  const getAllCityContent = async () => {
    const response: any = await manageCityContent();
    if (response.remote === "success") {
      setBottomHeading(response.data.bottomHeading);
      setFirstButtonText(response.data.firstButtonText);
      setSubheading(response.data.subheading);
      setSecondButtonText(response.data.secondButtonText);
      setHeading(response.data.heading);
    }
  };
  const handleUpdateCityContent = async () => {
    const payload = {
      heading,
      subheading,
      bottomHeading,
      firstButtonText,
      secondButtonText,
    };
    const response: any = await updateCityContent(payload);
    if (response.remote === "success") {
      toast.success("Update successfully");
    }
  };
  useEffect(() => {
    getAllCityContent();
  }, []);
  return (
    <>
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography variant="h6">Manage City Content</Typography>

        <TextField
          label="Heading"
          variant="outlined"
          value={heading}
          onChange={(e) => setHeading(e.target.value)}
          fullWidth
        />
        <TextField
          label="Subheading"
          variant="outlined"
          value={subheading}
          onChange={(e) => setSubheading(e.target.value)}
          fullWidth
        />
        <TextField
          label="Bottom Heading"
          variant="outlined"
          value={bottomHeading}
          onChange={(e) => setBottomHeading(e.target.value)}
          fullWidth
        />
        <TextField
          label="First Button Text"
          variant="outlined"
          value={firstButtonText}
          onChange={(e) => setFirstButtonText(e.target.value)}
          fullWidth
        />
        <TextField
          label="Second Button Text"
          variant="outlined"
          value={secondButtonText}
          onChange={(e) => setSecondButtonText(e.target.value)}
          fullWidth
        />
      </Box>
      <Button onClick={handleUpdateCityContent}>Update</Button>
      <ToastContainer />
    </>
  );
};

export default ManageCityContent;
