"use client";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import "./style.css";
import {
  JobWallContent,
  JobWallUpdateField,
} from "@/app/api/manageContent/manageContent.Types";
import { v4 } from "uuid";
import {
  EditJobWallContent,
  getAllJobWallContent,
} from "@/app/api/manageContent/manageContent";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { handleFindImage } from "@/app/ulits/constatnt";

function ContactUsPage() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [state, setState] = useState<JobWallContent>({
    banner: {
      heading: "",
      subHeading: "",
      image: null,
    },
    industryIcon: null,
    ioldImage: null,
    locationIcon: null,
    contactPersonIcon: null,
    coldImage: null,
    loldImage: null,
  });

  const handleChangeForObjectType = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetState: keyof JobWallContent
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        //@ts-ignore
        setState((prevState) => ({
          ...prevState,
          //@ts-ignore
          [targetState]: { ...prevState[targetState], [name]: files[0] },
        }));
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      //@ts-ignore
      setState((prevState) => ({
        ...prevState,
        //@ts-ignore
        [targetState]: { ...prevState[targetState], [name]: value },
      }));
    }
  };

  const handleChangeForSingleLevelType = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState((prevState) => ({
          ...prevState,
          [name]: files[0],
        }));
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      setState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  const handleSelectedFile = (id: string, file: any) => {
    console.log({ id });
    if (id === "job-wall-image") {
      setState({
        ...state,
        banner: {
          ...state.banner,
          oldImages: file._id,
        },
      });
    } else if (id === "industry-icon") {
      setState({
        ...state,
        ioldImage: file._id,
      });
    } else if (id === "Contact-person") {
      setState({
        ...state,
        coldImage: file._id,
      });
    } else if (id === "location-icon") {
      setState({
        ...state,
        loldImage: file._id,
      });
    }
  };
  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof JobWallContent
  ) => {
    const { target } = e;
    const { name, value, files } = target;
    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState({
          ...state,
          //@ts-ignore
          [targetState]: state[targetState].map((acc, idx) =>
            index === idx ? { ...acc, [name]: files[0] } : acc
          ),
        });
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      setState({
        ...state,
        //@ts-ignore
        [targetState]: state[targetState].map((acc, idx) =>
          index === idx ? { ...acc, [name]: value } : acc
        ),
      });
    }
  };
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const updateContent = async (
    data: any,
    operation: keyof JobWallUpdateField
  ) => {
    const response = await EditJobWallContent(data, operation);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    operation: keyof JobWallUpdateField
  ) => {
    e.preventDefault();
    setEditLoading(true);
    if (operation === "banner") {
      const { banner } = state;
      await updateContent(banner, operation);
    }
    if (operation === "industryIcon") {
      const { industryIcon, ioldImage } = state;
      await updateContent({ industryIcon, ioldImage }, operation);
    }
    if (operation === "contactPersonIcon") {
      const { contactPersonIcon, coldImage } = state;
      console.log({ hello: contactPersonIcon, hello2: coldImage });
      await updateContent({ contactPersonIcon, coldImage }, operation);
    }
    if (operation === "locationIcon") {
      const { locationIcon ,loldImage} = state;
      await updateContent({ locationIcon,loldImage }, operation);
    }
    setEditLoading(false);
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllJobWallContent();
    if (response.remote === "success") {
      if (response.data.data) {
        const { banner } = response.data.data;
        setState({
          ...state,
          banner: banner ? { ...banner, image: null } : state.banner,
        });
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  console.log({ state });
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Job wall content" />
      <form
        onSubmit={(e) => {
          handleUpdate(e, "banner");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="top banner" />
          </Grid>
          <Grid item lg={4}>
            <label>heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="heading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "banner");
              }}
              value={state?.banner?.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Sub heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="subHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "banner");
              }}
              value={state?.banner?.subHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Background image</label>
            <TextField
              fullWidth
              type="file"
              placeholder="Enter Heading"
              autoComplete="off"
              name="image"
              id={`job-wall-image`}
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
                       onClick={(e) => {
                        e.stopPropagation();
                        setState({
                          ...state,
                          banner: {
                            ...state.banner,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.banner?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.banner?.oldImages
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={(e: any) => {
                handleChangeForObjectType(e, "banner");
              }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "industryIcon");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="industry icon" />
          </Grid>
          <Grid item lg={12}>
            <label>upload industry icon</label>
            <TextField
              fullWidth
              type="file"
              placeholder="Enter Heading"
              autoComplete="off"
              name="industryIcon"
              id={`industry-icon`}
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
                   onClick={(e) => {
                    e.stopPropagation();
                        setState({
                          ...state,
                          ioldImage: null,
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.ioldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(mediaUrls, state.ioldImage)}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={handleChangeForSingleLevelType}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "contactPersonIcon");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Contact person icon" />
          </Grid>
          <Grid item lg={12}>
            <label>upload contact person icon</label>
            <TextField
              fullWidth
              type="file"
              id={`Contact-person`}
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
                       onClick={(e) => {
                        e.stopPropagation();
                        setState({
                          ...state,
                          coldImage: null,
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.coldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(mediaUrls, state.coldImage)}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              placeholder="Enter Heading"
              autoComplete="off"
              name="contactPersonIcon"
              onChange={handleChangeForSingleLevelType}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "locationIcon");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="location icon" />
          </Grid>
          <Grid item lg={12}>
            <label>upload location icon</label>
            <TextField
              fullWidth
              type="file"
              id={`location-icon`}
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
                       onClick={(e) => {
                        e.stopPropagation();
                        setState({
                          ...state,
                          loldImage: null,
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.loldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(mediaUrls, state.loldImage)}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              placeholder="Enter Heading"
              autoComplete="off"
              name="locationIcon"
              onChange={handleChangeForSingleLevelType}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
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
        inputId={""}
      />
    </>
  );
}

export default ContactUsPage;
