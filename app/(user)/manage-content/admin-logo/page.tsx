"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import CustomLoader from "@/app/components/SpinLoader";
import {
  EditHomePageV2Contents,
  getAllHomePageV2Content,
} from "@/app/api/manageContent/manageContent";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";

const DEFAULT_LOGO = "/logo.png";

const buildImageUrl = (filepath?: string) => {
  if (!filepath) return DEFAULT_LOGO;
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "";
  return `${baseUrl.replace(/\/$/, "")}/${filepath.replace(/^\//, "")}`;
};

const AdminLogoPage = () => {
  const [loading, setLoading] = useState(true);
  const [editLoading, setEditLoading] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [adminLogo, setAdminLogo] = useState<File | null>(null);
  const [oldAdminLogo, setOldAdminLogo] = useState("");
  const [previewUrl, setPreviewUrl] = useState(DEFAULT_LOGO);
  const [removeAdminLogo, setRemoveAdminLogo] = useState(false);

  const localPreviewUrl = useMemo(() => {
    if (!adminLogo) return "";
    return URL.createObjectURL(adminLogo);
  }, [adminLogo]);

  useEffect(() => {
    if (localPreviewUrl) {
      setPreviewUrl(localPreviewUrl);
    }

    return () => {
      if (localPreviewUrl) {
        URL.revokeObjectURL(localPreviewUrl);
      }
    };
  }, [localPreviewUrl]);

  const loadAdminLogo = async () => {
    setLoading(true);
    const response = await getAllHomePageV2Content();
    if (response.remote === "success") {
      const logo = response.data.data?.adminLogo;
      if (logo?._id && logo?.filepath) {
        setOldAdminLogo(logo._id);
        setPreviewUrl(buildImageUrl(logo.filepath));
      } else {
        setOldAdminLogo("");
        setPreviewUrl(DEFAULT_LOGO);
      }
    } else {
      toast.error("Error fetching admin logo");
    }
    setLoading(false);
  };

  useEffect(() => {
    loadAdminLogo();
  }, []);

  const handleSelectedFile = (_id: string, file: any) => {
    setAdminLogo(null);
    setOldAdminLogo(file._id);
    setRemoveAdminLogo(false);
    setPreviewUrl(buildImageUrl(file.filepath));
    setIsGalleryOpen(false);
  };

  const handleClear = () => {
    setAdminLogo(null);
    setOldAdminLogo("");
    setRemoveAdminLogo(true);
    setPreviewUrl(DEFAULT_LOGO);
  };

  const handleUpdate = async () => {
    setEditLoading(true);
    const payload: any = {};
    if (adminLogo) {
      payload.adminLogo = adminLogo;
    } else if (oldAdminLogo) {
      payload.oldAdminLogo = oldAdminLogo;
    } else if (removeAdminLogo) {
      payload.removeAdminLogo = true;
    }

    const response = await EditHomePageV2Contents(payload, "adminLogo");
    if (response.remote === "success") {
      toast.success("Admin logo updated successfully");
      await loadAdminLogo();
    } else {
      toast.error("Error updating admin logo");
    }
    setEditLoading(false);
  };

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <>
      <Title heading="Admin Logo" />
      <Card elevation={0} sx={{ borderRadius: "10px", p: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Box
              sx={{
                width: "100%",
                maxWidth: 260,
                aspectRatio: "16 / 9",
                border: "1px solid #e5e5e5",
                borderRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#f8fdfd",
                p: 2,
              }}
            >
              <Box
                component="img"
                src={previewUrl}
                alt="Admin logo preview"
                sx={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
              />
            </Box>
            <Typography variant="body2" sx={{ mt: 1, color: "#646464" }}>
              Default logo is shown when no admin logo is saved.
            </Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <TextField
                fullWidth
                type="file"
                inputProps={{ accept: "image/*" }}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0];
                  if (file) {
                    setAdminLogo(file);
                    setOldAdminLogo("");
                    setRemoveAdminLogo(false);
                  }
                }}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="outlined" onClick={() => setIsGalleryOpen(true)}>
                  Choose from gallery
                </Button>
                <Button variant="outlined" color="warning" onClick={handleClear}>
                  Use default logo
                </Button>
              </Stack>
              <Box sx={{ textAlign: "right" }}>
                <Button
                  variant="contained"
                  onClick={handleUpdate}
                  sx={{ fontWeight: 700, bgcolor: "#0096A4" }}
                >
                  {editLoading ? "Updating..." : "Update"}
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Card>

      <ToastContainer />
      <ImageGalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        onFileSelect={(file: any) => handleSelectedFile("adminLogo", file)}
        inputId="adminLogo"
      />
    </>
  );
};

export default AdminLogoPage;
