"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  Typography,
  TextField,
  Box,
  Grid,
  IconButton,
  Button,
  InputAdornment,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { Upload, UploadFile } from "antd";
import ImgCrop from "antd-img-crop";
import { RcFile } from "antd/es/upload";
import { getGalleryImages, updateGalleryImages } from "@/app/api/city/city";
import DeleteIcon from "@mui/icons-material/Delete";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CustomLoader from "@/app/components/SpinLoader";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import {
  handleFindImage,
  handleFindImageAndReturnId,
} from "@/app/ulits/constatnt";

interface ImageData {
  _id: string;
  fileName: string;
  filepath: string;
}

const DynamicContent: React.FC = () => {
  const [images, setImages] = useState<UploadFile[]>([]);
  const dispatch = useDispatch();
  const [headline, setHeadline] = useState<string>("");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [existingImageIds, setExistingImageIds] = useState<any[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]); // New state for tracking deleted images
  const [isOpen, setIsOpen] = useState(false);
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [loader, setLoader] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<any>("");
  const [heading, setHeading] = useState("");
  const [heading1, setHeading1] = useState("");
  const [text, setText] = useState("");
  const [oldImages, setOldImages] = useState<any[]>([]);
  const [oldBackgroundImage, setOldBackgroundImage] = useState("");

  const fetchImages = useCallback(async () => {
    setLoader(true);
    try {
      const response: any = await getGalleryImages();
      if (response.remote === "success") {
        setHeadline(response.data.headline);
        setHeading(response.data.heading);
        setHeading1(response.data.heading1);
        setBackgroundImage(response.data.backgroundImage);
        setText(response.data.text);
        
        const mappedImages: string[] = response.data.images.map(
          (img: ImageData) =>
            `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${img.filepath}`
        );
        
        const ids = response.data.images.map((img: ImageData) => ({
          id: img._id,
          url: `${process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL}${img.filepath}`,
          isExisting: true // Flag to identify existing images
        }));
        
        setUploadedImages(mappedImages);
        setExistingImageIds(ids);
      }
    } catch (error) {
      console.error("Failed to fetch images:", error);
    }
    setLoader(false);
  }, []);

  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    fetchImages();
  }, []);

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

  const handleHeadlineChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const text = event.target.value.replace(/black/gi, "");
      setHeadline(text);
    },
    []
  );

  const handleRemoveImage = useCallback((url: string, index: number) => {
    // Find if the image being removed is an existing one
    const existingImage = existingImageIds.find(img => img.url === url);
    
    if (existingImage) {
      // If it's an existing image, add its ID to deletedImageIds
      setDeletedImageIds(prev => [...prev, existingImage.id]);
    }

    // Remove from uploadedImages
    setUploadedImages(prev => prev.filter(image => image !== url));
    
    // Remove from images state (for new uploads)
    setImages(prev => prev.filter((file: any) => file.objectUrl !== url));
    
    // Remove from existingImageIds
    setExistingImageIds(prev => prev.filter(img => img.url !== url));
    
    // Remove from oldImages if present
    setOldImages(prev => {
      const imagePath = url.split(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL || "")[1] || "";
      return prev.filter(item => item.filepath !== imagePath);
    });
  }, [existingImageIds]);

  const handleSelectedFile = (id: string, file: any) => {
    if (id === "cropper") {
      setOldImages(pre => [...pre, file]);
      setUploadedImages(pre => [...pre, handleFindImage(mediaUrls, file._id)]);
    } else {
      setOldBackgroundImage(file._id);
    }
  };

  const handleSubmit = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("headline", headline);
    formData.append("heading", heading);
    formData.append("heading1", heading1);
    formData.append("text", text);
    formData.append("backgroundImage", backgroundImage);

    // Add existing image IDs that weren't deleted
    formData.append(
      "existingImageIds",
      JSON.stringify(existingImageIds.map(item => item.id))
    );

    // Add deleted image IDs if any
    if (deletedImageIds.length > 0) {
      formData.append("deletedImageIds", JSON.stringify(deletedImageIds));
    }

    // Add old images that were selected but not yet saved
    const oldImageIds = oldImages.map(item => item._id);
    if (oldImageIds.length) {
      formData.append("oldImages", JSON.stringify(oldImageIds));
    }

    if (oldBackgroundImage) {
      formData.append("oldBackgroundImage", oldBackgroundImage);
    }

    // Add newly uploaded images
    images.forEach((image: any) => {
      formData.append("image", image.file as RcFile);
    });

    try {
      const response = await updateGalleryImages(formData);
      if (response.remote === "success") {
        toast.success("Gallery Updated Successfully");
        // Clear deleted images array after successful save
        setDeletedImageIds([]);
      }
    } catch (error: any) {
      toast.error("Something went wrong");
    }
    setLoader(false);
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dynamic Headline
      </Typography>
      <TextField
        label="Enter Headline"
        variant="outlined"
        fullWidth
        value={headline}
        onChange={handleHeadlineChange}
      />
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>
          Upload Images (Max 20)
        </Typography>

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
                id="cropper"
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
                onClick={() => handleRemoveImage(img, index)}
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

      <ToastContainer />

      <TextField
        label="Heading"
        variant="outlined"
        style={{ marginTop: "15px" }}
        fullWidth
        value={heading}
        onChange={(e) => setHeading(e.target.value)}
      />

      <TextField
        label="Text"
        variant="outlined"
        fullWidth
        style={{ marginTop: "15px" }}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <TextField
        type="file"
        fullWidth
        name="backgroundImage"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0] || null;
          setBackgroundImage(file);
        }}
        id="backgroundImage"
        onClick={(e: any) => {
          const id = e.target.id;
          if (!isOpen) {
            e.preventDefault();
          }
          handleOpenGalleryModel();
          dispatch(setCurrentElementId(id));
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setOldBackgroundImage("")}
                edge="end"
                aria-label="Clear"
              >
                <ClearIcon />
              </IconButton>
              {oldBackgroundImage && (
                <img
                  height={30}
                  width={40}
                  src={handleFindImage(mediaUrls, oldBackgroundImage)}
                  alt="Background preview"
                />
              )}
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Heading1"
        variant="outlined"
        style={{ marginTop: "15px" }}
        fullWidth
        value={heading1}
        onChange={(e) => setHeading1(e.target.value)}
      />

      <Button onClick={handleSubmit} style={{ marginTop: "15px" }}>
        {loader ? "Saving..." : "Save"}
      </Button>

      <ImageGalleryModal
        isOpen={isOpen}
        onClose={handleClose}
        onFileSelect={(value: any) => {
          if (elementId) {
            handleSelectedFile(elementId, value);
          }
        }}
        inputId=""
      />
    </Box>
  );
};

export default DynamicContent;