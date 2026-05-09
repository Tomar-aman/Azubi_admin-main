"use client";
import { useState, useEffect } from "react";
import { Card, Button, Box } from "@mui/material";
import Title from "@/app/components/title.components";
import TextEditor from "../textEditor/textEditor";
import { SVG } from "@/app/components/icon";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cropper, { FileState } from "@/app/ulits/cropper";
import { ManageAlert } from "@/app/api/manageContent/manageContent.Types";
import {
  getAllAlertContent,
  updateAlertContent,
} from "@/app/api/manageContent/manageContent";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";

const JobAlertContent = () => {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState("");
  const [alertContent, setAlertContent] = useState<ManageAlert>({
    _id: "",
    heading: "",
    subheading: "",
    image: "",
  });
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [editLoading, setEditLoading] = useState(false);
  const [oldFile, setOldFile] = useState<FileState[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [oldMedia, setOldMedia] = useState("");
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const dispatch = useDispatch();

  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSelectedFile = (id: string, file: any) => {
    setFileList([
      {
        name: file.filepath,
        uid: file._id + 1,
        url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + file.filepath,
      },
    ] as any);
    setOldMedia(file._id);
  };

  const handleGetAlertContent = async () => {
    setLoading(true);
    try {
      const response = await getAllAlertContent(id);
      if (response.remote === "success") {
        setAlertContent(response.data.data);
        setFileList([
          {
            name: response.data.data.image,
            uid: response.data.data.image,
            url:
              process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL +
              response.data.data.image,
          },
        ]);
        setOldFile([
          {
            name: response.data.data.image,
            uid: response.data.data.image,
            url:
              process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL +
              response.data.data.image,
          },
        ]);
      } else {
        toast.error("Error fetching job alert content");
      }
    } catch (error) {
      console.error("Error fetching job alert content:", error);
      toast.error("Error fetching job alert content");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    const errors: any = {};

    // Check if heading is empty
    if (!alertContent.heading) {
      errors.heading = "Heading is required";
    }

    // Check if subheading is empty
    if (!alertContent.subheading) {
      errors.subheading = "Subheading is required";
    }

    // Check if fileList is empty
    if (fileList.length === 0) {
      errors.image = "Image is required";
    }

    // If there are errors, display them and return
    if (Object.keys(errors).length > 0) {
      Object.keys(errors).forEach((key) => {
        toast.error(errors[key]);
      });
      return;
    }

    const imagePayload = {
      image: fileList[0]?.originFileObj, // Using optional chaining to avoid errors if fileList[0] is undefined
    };

    const payload = {
      ...alertContent,
    };

    if (imagePayload.image) {
      payload.image = imagePayload.image;
    }
    if (oldMedia) {
      payload.oldMedia = oldMedia;
    }
    setEditLoading(true);
    const data = await updateAlertContent(payload as any);
    if (data.remote === "success") {
      toast.success("job alert content update successfully");
    } else {
      toast.error("Error updating job alert content");
    }
    setEditLoading(false);
  };

  useEffect(() => {
    handleGetAlertContent();
  }, []);

  if (loading) {
    return <CustomLoader />;
  }

  return (
    <>
      <Title heading="Job Alert Content" />
      <Title heading="Heading" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <TextEditor
          content={alertContent.heading}
          setContent={(newHeading) =>
            setAlertContent((prevState: any) => ({
              ...prevState,
              heading: newHeading,
            }))
          }
        />
      </Card>
      <Title heading="Sub Heading" />
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <TextEditor
          content={alertContent.subheading}
          setContent={(newSubheading) =>
            setAlertContent((prevState: any) => ({
              ...prevState,
              subheading: newSubheading,
            }))
          }
        />
      </Card>
      <Title heading="Image" />
      <small style={{ fontSize: "0.70em", color: "grey" }}>
        Preferred size (512x512)px
      </small>
      <Card elevation={0} sx={{ borderRadius: "10px", mb: 2 }}>
        <Box
          sx={{
            "& textarea": {
              width: "100%",
              height: "136px",
              resize: "none",
              borderRadius: "10px",
              border: "1px solid #646464",
              fontSize: "16px",
              fontFamily: "'Poppins', sans-serif",
              padding: "8px 12px",
              outline: "none",
              fontWeight: "500",
            },
          }}
        >
          <span onClick={(e: any) => {}}>
            {" "}
            <Cropper
              clickable={() => {
                handleOpenGalleryModel();
                dispatch(setCurrentElementId("cropper"));
              }}
              disabled={!isOpen}
              fileList={fileList}
              setFileList={setFileList}
              setOldFile={setOldFile}
              maxCount={1}
            />
          </span>
        </Box>
      </Card>
      <Box sx={{ textAlign: "right", mt: 3 }}>
        <Button
          variant="outlined"
          sx={{ fontWeight: "700" }}
          onClick={handleUpdate}
        >
          <SVG.Save style={{ marginRight: "10px" }} />{" "}
          {editLoading ? "Updating..." : "Update"}
        </Button>
      </Box>
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
    </>
  );
};

export default JobAlertContent;
