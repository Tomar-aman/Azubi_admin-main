
"use client";

import { getAllImageGallery } from "@/app/api/iamge-gallery/imagegallery";
import {
  ImageGalleryType,
  ImagesGallery,
} from "@/app/api/training/jobTypes.types";
import { fetchFileContent } from "@/app/ulits/customMethods";
import { Box, Button, Grid, Stack, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { RotatingLines } from "react-loader-spinner";
import "./style.css";

interface ImageGalleryProps {
  handleClose: () => void;     // Add this prop for handling the modal close
  name: string;
  clearAllState: () => void;
  loading: boolean;
  onSubmit: (file: File | undefined) => void;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  handleClose,
  name,
  clearAllState,
  loading,
  onSubmit,
}) => {
  const [images, setImages] = useState<ImagesGallery[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | undefined>();
  const [showGallery, setShowGallery] = useState(true);
  const [selectedImage, setSelectedImage] = useState<ImagesGallery | undefined>();

  // Fetch image gallery data from API
  const getImageGallery = async () => {
    const response = await getAllImageGallery();
    if (response.remote === "success") {
      setImages(
        response.data.data.map((img: any) => ({
          _id: img._id,
          filepath: img.filepath,
          filename: img.filename,
          type: img.type,
        }))
      );
    } else {
      console.error("Failed to fetch image gallery");
    }
  };

  useEffect(() => {
    getImageGallery();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file);
    setSelectedImage(undefined);
  };

  const handleImageSelect = async (image: ImagesGallery) => {
    try {
      setSelectedImage(image);
      setShowGallery(false);
      const file = await fetchFileContent(
        `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${image.filepath}`
      );
      setSelectedFile(file as any);
    } catch (error) {
      console.log("Error fetching image:", error);
    }
  };

  return (
    <Box>
      <Stack direction={"row"} spacing={2} sx={{ pt: 4, px: 4 }} justifyContent={"center"}>
        <Button fullWidth onClick={() => setShowGallery(true)} className="modalBtn">
          Image Gallery
        </Button>

        <Button fullWidth onClick={() => setShowGallery(false)} className="modalBtn">
          Choose from device
        </Button>
      </Stack>

      <Box sx={{ mt: 4 }}>
        {showGallery ? (
          <Grid container spacing={2}>
            {images.length > 0
              ? images.map((itm: ImagesGallery, index: number) => (
                  <Grid item xs={12} lg={3} key={index}>
                    <Box
                      sx={{ position: "relative", overflow: "hidden", cursor: "pointer" }}
                      onClick={() => handleImageSelect(itm)}
                    >
                      <img
                        src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${itm.filepath}`}
                        width={"200px"}
                        height={"250px"}
                        alt={`Banner image ${index}`}
                      />
                    </Box>
                  </Grid>
                ))
              : ""}
          </Grid>
        ) : selectedFile ? (
          <Box>
            <p style={{
              color: "#9450bc",
              fontSize: "16px",
              fontWeight: "500",
              marginLeft: "35px",
            }}>{selectedFile.name}</p>
          </Box>
        ) : selectedImage ? (

          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <img
              src={`${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${selectedImage.filepath}`}
              width={"200px"}
              height={"250px"}
              alt={`Selected image`}
            />
          </Box>
        ) : (
          <TextField
            fullWidth
            type="file"
            id="outlined-basic"
            placeholder="Choose Image"
            autoComplete="off"
            name="image"
            onChange={handleFileChange}
          />
        )}
      </Box>

      <Button
        fullWidth
        onClick={() => {
          onSubmit(selectedFile);
          handleClose();  // Call handleClose when the submit is done
        }}
        className="submitBtn"
        disabled={!selectedFile && !selectedImage}
      >
        Submit
      </Button>
    </Box>
  );
};

export default ImageGallery;






