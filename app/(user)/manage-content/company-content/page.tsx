"use client";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import { Button, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  EditCompanyContents,
  getAllCompanyContents,
} from "@/app/api/manageContent/manageContent";
import TextEditor from "../textEditor/textEditor";
import { Box } from "@mui/system";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { handleFindImage } from "@/app/ulits/constatnt";
function CompanyContent() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [industryImage, setIndustryImage] = useState<any>(null);
  const [ownerImage, setOwnerImage] = useState<any>(null);
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const [oldOwnerImage, setOldOwnerImage] = useState("");
  const [oldIndustryImage, setOldIndustryImage] = useState("");
  const [state, setState] = useState({
    content: "",
    advertisement: "",
    owner: "",
    industry: "",
    companyInfo: "",
    website: "",
    contact: "",
    address: "",
    id: "",
  });
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };

  const handleSelectedFile = (id: string, file: any) => {
    if (id === "industry-image-upload") {
      setOldIndustryImage(file._id);
      setIndustryImage(handleFindImage(mediaUrls, file._id));
    } else if (id === "owner-image-upload") {
      setOldOwnerImage(file._id);
      setOwnerImage(handleFindImage(mediaUrls, file._id));
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const payload: any = {
      ...state,
    };
    if (
      ownerImage &&
      typeof ownerImage === 'string' &&
      !ownerImage.includes(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL as any)
    ) {
      payload.ownerImage = ownerImage;
    } else if (ownerImage && typeof ownerImage !== 'string') {
      // Handle the file object case here if needed, e.g., upload the file or process it
      payload.ownerImage = ownerImage;
    }
    
    if (
      industryImage &&
      typeof industryImage === 'string' &&
      !industryImage.includes(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL as any)
    ) {
      payload.industryImage = industryImage;
    } else if (industryImage && typeof industryImage !== 'string') {
      // Handle the file object case here if needed, such as uploading the file or processing it
      payload.industryImage = industryImage;
    }
    
    if (
      typeof industryImage === "string" &&
      industryImage.includes(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL as any)
    ) {
      payload.oldIndustryImage = oldIndustryImage;
    }
    if (
      typeof ownerImage === "string" &&
      ownerImage.includes(process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL as any)
    ) {
      payload.oldOwnerImage = oldOwnerImage;
    }
    const response = await EditCompanyContents(payload);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
    setEditLoading(false);
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllCompanyContents();
    if (response.remote === "success") {
      //@ts-ignore
      const { industryImage, ownerImage, ...rest } = response.data.data;
      //@ts-ignore
      if (response.data.data) setState(rest);
      console.log(response.data.data);
    }
    setIsLoading(false);
  };
  const handleImageChange = (
    event: { target: { files: any[] } },
    setImage: (arg0: any) => void
  ) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  useEffect(() => {
    handleGetAllContent();
  }, []);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="company content" />
      <form onSubmit={handleUpdate}>
        <label>content</label>
        <TextEditor
          content={state?.content}
          setContent={(value) => {
            const event: any = {
              target: {
                value: value,
                name: "content",
              },
            };
            handleChange(event);
          }}
        />
        <label>advertisement</label>
        <TextEditor
          content={state?.advertisement}
          setContent={(value) => {
            const event: any = {
              target: {
                value: value,
                name: "advertisement",
              },
            };
            handleChange(event);
          }}
        />
        <label>owner</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
          }}
        >
          <TextEditor
            content={state?.owner}
            setContent={(value) => {
              const event: any = {
                target: {
                  value: value,
                  name: "owner",
                },
              };
              handleChange(event);
            }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="owner-image-upload"
            type="file"
            onChange={(event: any) => handleImageChange(event, setOwnerImage)}
          />

          {ownerImage ? (
            <Box
              mt={2}
              sx={{
                display: "flex",
              }}
            >
              <Button
                onClick={() => {
                  setOwnerImage(null);
                }}
              >
                Delete
              </Button>
              <img
                src={
                  typeof ownerImage === "string" &&
                  ownerImage.includes(
                    process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL as any
                  )
                    ? ownerImage
                    : URL.createObjectURL(ownerImage)
                }
                alt="Industry Preview"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  cursor: "pointer",
                }}
              />
            </Box>
          ) : (
            <>
              {" "}
              <Button
                variant="contained"
                component="span"
                onClick={(e: any) => {
                  const id = "owner-image-upload";
                  if (!isOpen) {
                    e.preventDefault();
                  }
                  handleOpenGalleryModel();
                  dispatch(setCurrentElementId(id));
                }}
              >
                Upload Owner Image
              </Button>
            </>
          )}
        </div>
        <label>industry</label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            cursor: "pointer",
          }}
        >
          <TextEditor
            content={state?.industry}
            setContent={(value) => {
              const event: any = {
                target: {
                  value: value,
                  name: "industry",
                },
              };
              handleChange(event);
            }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="industry-image-upload"
            type="file"
            onChange={(event: any) =>
              handleImageChange(event, setIndustryImage)
            }
          />

          {industryImage ? (
            <Box
              mt={2}
              sx={{
                display: "flex",
              }}
            >
              <Button
                onClick={() => {
                  setIndustryImage(null);
                }}
              >
                Delete
              </Button>
              <img
                src={
                  typeof industryImage === "string" &&
                  industryImage.includes(
                    process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL as any
                  )
                    ? industryImage
                    : URL.createObjectURL(industryImage)
                }
                alt="Industry Preview"
                style={{
                  maxWidth: "100px",
                  maxHeight: "100px",
                  cursor: "pointer",
                }}
              />
            </Box>
          ) : (
            <>
              <Button
                variant="contained"
                component="span"
                onClick={(e: any) => {
                  const id = "industry-image-upload";
                  if (!isOpen) {
                    e.preventDefault();
                  }
                  handleOpenGalleryModel();
                  dispatch(setCurrentElementId(id));
                }}
              >
                Upload Industry Image
              </Button>
            </>
          )}
        </div>
        <label>companyInfo</label>
        <TextEditor
          content={state?.companyInfo}
          setContent={(value) => {
            const event: any = {
              target: {
                value: value,
                name: "companyInfo",
              },
            };
            handleChange(event);
          }}
        />
        <label>website</label>
        <TextEditor
          content={state?.website}
          setContent={(value) => {
            const event: any = {
              target: {
                value: value,
                name: "website",
              },
            };
            handleChange(event);
          }}
        />
        <label>contact</label>
        <TextEditor
          content={state?.contact}
          setContent={(value) => {
            const event: any = {
              target: {
                value: value,
                name: "contact",
              },
            };
            handleChange(event);
          }}
        />
        <label>address</label>{" "}
        <TextEditor
          content={state?.address}
          setContent={(value) => {
            const event: any = {
              target: {
                value: value,
                name: "address",
              },
            };
            handleChange(event);
          }}
        />
        <Button type="submit">{editLoading ? "Update..." : "Update"}</Button>
      </form>
      <ToastContainer />
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
    </>
  );
}

export default CompanyContent;
