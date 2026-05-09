"use client";
import React, { useEffect, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
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
  JobMagazineCard,
  JobMagazinePoint,
  Magazine,
  MagazineOrderUpdateField,
} from "@/app/api/manageContent/manageContent.Types";
import { v4 } from "uuid";
import {
  EditJobMagazineContents,
  getAllJobMagazineContent,
} from "@/app/api/manageContent/manageContent";
import { cardFactory } from "@/app/ulits/customMethods";
import { handleFindImage } from "@/app/ulits/constatnt";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import ClearIcon from "@mui/icons-material/Clear";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
function MagazinePage() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [state, setState] = useState<Magazine>({
    header: {
      buttonText: "",
      buttonColor: "",
      buttonUrl: "",
      sideText: "",
    },
    jobMagazineHeading: "",
    jobMagazineCards: [
      ...cardFactory<JobMagazineCard>(
        {
          _id: v4(),
          image: null,
          cardHeading: "",
          textFirst: "",
          textSecond: "",
          additionalText: "",
        },
        4
      ),
    ],
    jobMagazinePointHeading: "",
    jobMagazinePointSideImage: null,
    jobMagazinePointText: "",
    jobMagazinePoints: [
      ...cardFactory<JobMagazinePoint>({ _id: v4(), text: "" }, 8),
    ],
    aboutService: {
      headingFirst: "",
      textFirst: "",
      headingSecond: "",
      textSecond: "",
      buttonText: "",
      buttonUrl: "",
      buttonColor: "",
    },
  });
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleChangeForObjectType = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetState: keyof Magazine
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
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
    if (id.includes("Magazine") && id !== "jobMagazinePointSideImage") {
      setState({
        ...state,
        jobMagazineCards: state.jobMagazineCards.map((item: any) =>
          item._id === elementId.split("Magazine-")[1]
            ? { ...item, oldImages: file._id }
            : { ...item }
        ),
      });
    } else if (id === "jobMagazinePointSideImage") {
      setState({
        ...state,
        jobMagazinePointSideImage: {
          ...state.jobMagazinePointSideImage,
          oldImages: file._id,
        },
      });
    }
  };
  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof Magazine
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

  const updateContent = async (
    data: any,
    operation: keyof MagazineOrderUpdateField
  ) => {
    const response = await EditJobMagazineContents(data, operation);
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
    operation: keyof MagazineOrderUpdateField
  ) => {
    e.preventDefault();
    setEditLoading(true);
    if (operation === "header") {
      await updateContent(state.header, operation);
    }
    if (operation === "jobMagazineCard") {
      const { jobMagazineHeading, jobMagazineCards } = state;
      await updateContent(
        { jobMagazineHeading, jobMagazineCards },
        "jobMagazineCard"
      );
    }
    if (operation === "jobMagazinePoints") {
      const {
        jobMagazinePointHeading,
        jobMagazinePointSideImage,
        jobMagazinePointText,
        jobMagazinePoints,
      } = state;
      await updateContent(
        {
          jobMagazinePointHeading,
          jobMagazinePointSideImage,
          jobMagazinePointText,
          jobMagazinePoints,
        },
        "jobMagazinePoints"
      );
    }
    if (operation === "aboutService") {
      await updateContent(state.aboutService, operation);
    }
    setEditLoading(false);
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllJobMagazineContent();
    if (response.remote === "success") {
      if (response.data.data) {
        const {
          header,
          jobMagazineHeading,
          jobMagazineCards,
          jobMagazinePointHeading,
          jobMagazinePointText,
          jobMagazinePoints,
          aboutService,
        } = response.data.data;
        setState({
          ...state,
          header: header ? header : state.header,
          jobMagazineHeading,
          jobMagazineCards:
            jobMagazineCards.length > 0
              ? jobMagazineCards.map((itm) => ({ ...itm, image: null }))
              : state.jobMagazineCards,
          jobMagazinePointHeading,
          jobMagazinePointText,
          jobMagazinePoints,
          aboutService: aboutService ? aboutService : state.aboutService,
        });
      }
    }
    setIsLoading(false);
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Magazine Order content" />

      <form
        onSubmit={(e) => {
          handleUpdate(e, "header");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Header content" />
          </Grid>
          <Grid item lg={4}>
            <label>Button text</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonText"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "header"
                )
              }
              value={state?.header.buttonText}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Button Color</label>
            <TextField
              fullWidth
              type="color"
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonColor"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "header"
                )
              }
              value={state?.header.buttonColor}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Button Url</label>
            <TextField
              fullWidth
              type="url"
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonUrl"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "header"
                )
              }
              value={state?.header.buttonUrl}
            />
          </Grid>
          <Grid item lg={12}>
            <label>Side Text</label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="sideText"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "header"
                )
              }
              value={state?.header.sideText}
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
          handleUpdate(e, "jobMagazineCard");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Job Magazine content" />
          </Grid>
          <Grid item lg={12}>
            <label>Magazine Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="jobMagazineHeading"
              onChange={handleChangeForSingleLevelType}
              value={state?.jobMagazineHeading}
            />
          </Grid>
          <Grid item xs={12}>
            <Title heading="Job Magazine cards" />
          </Grid>

          <Grid item lg={12}>
            <Box className="cards-container">
              {state.jobMagazineCards.map((_crd: any, idx) => (
                <Box className="card-section" key={_crd._id}>
                  <Grid container spacing={1}>
                    <Grid item lg={6}>
                      <label>Card Image</label>
                      <TextField
                        fullWidth
                        type="file"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="image"
                        id={`Magazine-${_crd._id}`}
                        onClick={(e: any) => {
                          setSelectedCardId(_crd._id);
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
                                    jobMagazineCards:
                                      state.jobMagazineCards.map(
                                        (item: any, index) =>
                                          index === idx
                                            ? { ...item, oldImages: null }
                                            : { ...item }
                                      ),
                                  });
                                }} // Clear image on click
                                edge="end"
                                aria-label="Clear"
                              >
                                <ClearIcon />
                              </IconButton>
                              {_crd?.oldImages ? (
                                <>
                                  <img
                                    height={30}
                                    width={40}
                                    src={handleFindImage(
                                      mediaUrls,
                                      _crd?.oldImages
                                    )}
                                  />
                                </>
                              ) : (
                                <></>
                              )}
                            </InputAdornment>
                          ),
                        }}
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "jobMagazineCards"
                          );
                        }}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <label>Card Heading</label>
                      <TextField
                        fullWidth
                        required
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="cardHeading"
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "jobMagazineCards"
                          );
                        }}
                        value={state.jobMagazineCards[idx].cardHeading}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <label>Card text First</label>
                      <TextField
                        fullWidth
                        required
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="textFirst"
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "jobMagazineCards"
                          );
                        }}
                        value={state.jobMagazineCards[idx].textFirst}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <label>Card text second {"(optional)"}</label>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="textSecond"
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "jobMagazineCards"
                          );
                        }}
                        value={state.jobMagazineCards[idx].textSecond}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <label>Additional text{"(optional)"}</label>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="additionalText"
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "jobMagazineCards"
                          );
                        }}
                        value={state.jobMagazineCards[idx].additionalText}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
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
          handleUpdate(e, "jobMagazinePoints");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Job Magazine Points" />
          </Grid>
          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="jobMagazinePointHeading"
              onChange={handleChangeForSingleLevelType}
              value={state?.jobMagazinePointHeading}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Image</label>
            <TextField
              fullWidth
              type="file"
              id={`jobMagazinePointSideImage`}
              onClick={(e: any) => {
                setSelectedCardId("jobMagazinePointSideImage");
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
                          jobMagazinePointSideImage: {
                            ...state.jobMagazinePointSideImage,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.jobMagazinePointSideImage?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.jobMagazinePointSideImage?.oldImages
                          )}
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
              name="jobMagazinePointSideImage"
              onChange={handleChangeForSingleLevelType}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Description</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="jobMagazinePointText"
              onChange={handleChangeForSingleLevelType}
              value={state?.jobMagazinePointText}
            />
          </Grid>
          <Grid item xs={12}>
            <Title heading="Magazine Points" />
          </Grid>

          {state.jobMagazinePoints.map((_crd, idx) => (
            <Grid item xs={12} key={_crd._id}>
              <label>Point</label>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                placeholder="Enter Heading"
                autoComplete="off"
                name="text"
                onChange={(e) => {
                  handleChangeForArrayType(e as any, idx, "jobMagazinePoints");
                }}
                value={state.jobMagazinePoints[idx].text}
              />
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "aboutService");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="About Service" />
          </Grid>
          <Grid item lg={4}>
            <label>Heading First</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="headingFirst"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.headingFirst}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Text First</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="textFirst"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.textFirst}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Heading Second</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="headingSecond"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.headingSecond}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Text Second</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="textSecond"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.textSecond}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button text</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonText"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.buttonText}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Button Color</label>
            <TextField
              fullWidth
              type="color"
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonColor"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.buttonColor}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Button Url</label>
            <TextField
              fullWidth
              type="url"
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonUrl"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "aboutService"
                )
              }
              value={state?.aboutService.buttonUrl}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>
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
      <ToastContainer />
    </>
  );
}

export default MagazinePage;
