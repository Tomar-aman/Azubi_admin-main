"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Box, Grid, IconButton, Button, Typography } from "@mui/material";
import { Upload, UploadFile } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import {
  getLandingPageImages,
  updateLandingPageImages,
} from "@/app/api/city/city";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomLoader from "@/app/components/SpinLoader";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { handleFindImage } from "@/app/ulits/constatnt";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";

interface ImageData {
  _id: string;
  fileName: string;
  filepath: string;
}

const DynamicContent: React.FC = () => {
  const [images, setImages] = useState<UploadFile[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [existingImageIds, setExistingImageIds] = useState<string[]>([]);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();
  const [oldImages, setOldImages] = useState<any[]>([]);
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelectedFile = (id: string, file: any) => {
    if (id === "cropper") {
      setOldImages((pre) => {
        return [...pre, file];
      });
      setUploadedImages((pre) => {
        return [...pre, handleFindImage(mediaUrls, file._id)];
      });
    }
  };

  const fetchImages = useCallback(async () => {
    setLoader(true);
    try {
      const response: any = await getLandingPageImages();
      if (response.remote === "success") {
        console.log({ hello: response.data.images });
        const mappedImages: string[] = response.data.images.map(
          (img: ImageData) =>
            `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${img.filepath}`
        );
        const ids: string[] = response.data.images.map((img: ImageData) => {
          return {
            id: img._id,
            url: `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${img.filepath}`,
          };
        });
        setUploadedImages(mappedImages);
        setExistingImageIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
    setLoader(false);
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleImageUpload = useCallback(
    (file: RcFile): boolean => {
      if (images.length < 20) {
        const objectUrl = URL.createObjectURL(file);
        setImages((prevImages: any) => [...prevImages, { file, objectUrl }]);
        setUploadedImages((prev) => [...prev, objectUrl]);
      }
      return false;
    },
    [images]
  );

  const handleRemoveImage = useCallback((url: string) => {
    setUploadedImages((prevImages) =>
      prevImages.filter((image) => image !== url)
    );
    setImages((prevImages) =>
      prevImages.filter((file: any) => file.objectUrl !== url)
    );
    setExistingImageIds((prevIds) =>
      prevIds.filter((data: any) => data.url !== url)
    );
    setOldImages((prev) => {
      const imagePath =
        url.split(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "")[1] || "";
      return prev.filter((item) => item.filepath !== imagePath);
    });
  }, []);

  const handleSubmit = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append(
      "existingImageIds",
      JSON.stringify(existingImageIds.map((item: any) => item.id))
    );
    images.forEach((image: any) => {
      formData.append("image", image.file as RcFile);
    });
    const oldImageIds = oldImages.map((item) => item._id);
    if (oldImages.length) {
      oldImageIds.forEach((id) => formData.append("oldImages[]", id));
    }

    try {
      const response = await updateLandingPageImages(formData);
      if (response.remote === "success") {
        toast.success("Gallery Updated Successfully");
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
    setLoader(false);
  };

  return (
    <Box>
      <Box mt={4}>
        <Typography variant="h3">Landing Page Images</Typography>
        <ImgCrop>
          <Upload
            listType="picture-card"
            fileList={images}
            beforeUpload={handleImageUpload}
            showUploadList={false}
            openFileDialogOnClick={elementId ? true : false}
          >
            {images.length < 20 && (
              <Button
                id={"cropper"}
                onClick={(e) => {
                  handleOpenGalleryModel();
                  dispatch(setCurrentElementId("cropper"));
                }}
              >
                + Upload
              </Button>
            )}
          </Upload>
        </ImgCrop>
        <Grid container spacing={2} mt={2}>
          {uploadedImages.map((img, index) => (
            <Grid item key={img} position="relative">
              <img
                src={img}
                alt={`Uploaded ${index}`}
                style={{ width: "50px", height: "50px" }}
              />
              <IconButton
                onClick={() => handleRemoveImage(img)}
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.7)",
                }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Box>
      <Button onClick={handleSubmit}>
        {loader ? <CustomLoader /> : "Save"}
      </Button>
      <ToastContainer />
      <ImageGalleryModal
        isOpen={isOpen}
        onClose={handleClose}
        onFileSelect={(value: any) => {
          if (elementId) {
            handleSelectedFile(elementId, value);
          }
        }}
        inputId={""}
      />
    </Box>
  );
};

export default DynamicContent;
