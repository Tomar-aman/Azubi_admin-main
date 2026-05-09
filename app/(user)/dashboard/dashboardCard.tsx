
import React, { useState } from "react";
import { getDashBoardData } from "@/app/api/auth/auth";
import Title from "@/app/components/title.components";
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import IModal from "@/app/components/modal.components";
import ImageGallery from "@/app/components/image-gallery";

export interface Dashboard {
  id: string;
  title: string;
  count: number | string;
}

const DashboardCard = ({ id, title, count }: Dashboard) => {
  const [saveModelLoading, setSaveModelLoading] = useState(false);
  const [isDeleteModal, setDeleteModal] = useState(false);
  const [imageGallery, setImageGallery] = useState(false);
  const [name, setName] = useState("");

  const clearAllState = () => {
    setDeleteModal(false);
  };

  const handleImageModel = () => {
    setImageGallery(true);
  };

  const handleDeleteModal = () => {
    setDeleteModal(true);
  };

  const handleClose = () => {
    setImageGallery(false);
    clearAllState();
  };

  const handleSubmit = (file: File | undefined) => {
    // Handle file submission logic here
    console.log("File submitted:", file);
    setImageGallery(false);
  };

  return (
    <>
      <Grid item xs={12} lg={6} key={id}>
        <Card
          onClick={handleImageModel}
          sx={{
            borderRadius: "10px",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          <CardContent>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Typography variant="h4" sx={{ fontWeight: 500 }}>
                {title}
              </Typography>
              <Box
                sx={{
                  flexGrow: 1,
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <Avatar
                  sx={{
                    width: "70px",
                    height: "70px",
                    background: "#0096A4",
                    fontSize: "24px",
                  }}
                >
                  {count}
                </Avatar>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>

      <IModal open={imageGallery} handleClose={handleClose} maxWidth="800px">
        <ImageGallery
          handleClose={handleClose}
          name={name}
          clearAllState={clearAllState}
          loading={saveModelLoading}
          onSubmit={handleSubmit}
        />
      </IModal>
    </>
  );
};

export default DashboardCard;
