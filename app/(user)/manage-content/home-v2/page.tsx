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
import ClearIcon from "@mui/icons-material/Clear";
import "./style.css";
import {
  HomePage,
  HomePageOperationField,
  JobMagazineCard,
  JobMagazinePoint,
  Magazine,
  MagazineOrderUpdateField,
} from "@/app/api/manageContent/manageContent.Types";
import { v4 } from "uuid";
import {
  EditHomePageV2Contents,
  EditJobMagazineContents,
  getAllHomePageV2Content,
  getAllJobMagazineContent,
} from "@/app/api/manageContent/manageContent";
import { cardFactory } from "@/app/ulits/customMethods";
import TextEditor from "../textEditor/textEditor";
import dynamic from "next/dynamic";
import IModal from "@/app/components/modal.components";
import ImageGallery from "@/app/components/image-gallery";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { handleFindImage } from "@/app/ulits/constatnt";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
const TextEditorNew = dynamic(
  () => import("../../manage-content/text-editor-new/textEditorNew"),
  { ssr: false }
);

function MagazinePage() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [state, setState] = useState<HomePage>({
    youtubeSection: {
      heading: "",
      text: "",
      videoLink: "",
      backgroundColor: "",
    },
    cardHeading: "",
    cardText: "",
    CardBackgroundColor: "",
    sideImage: "",
    cards: cardFactory({ _id: v4(), image: null, link: "" }, 3),
    searchBar: { heading: "" },
    topState: { heading: "" },
    federalState: { heading: "" },
    gallery: { heading: "", backgroundColor: "" },
    textContainer: { text1: "", text2: "", image: null, logoGalleryColor: "" },
    companyLogoHeading: "",
    logoGalleryColor: "",
    mailChimpSection: {
      image: null,
      heading: "",
      text1: "",
      text2: "",
      buttonText: "",
    },
    headerLogoSideImage: null,
    welcomeMessageForApp: {
      heading: "",
      subHeading: "",
      text: "",
    },
  });

  //Youtube video
  const handleChangeForObjectType = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetState: keyof HomePage
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

  const handleFileChange = (
    file: File | undefined,
    targetState: keyof HomePage
  ) => {
    console.log({ file });
    setState((prevState) => ({
      ...prevState,
      //@ts-ignore
      [targetState]: { ...prevState[targetState], image: file },
    }));
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
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof HomePage
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
    operation: keyof HomePageOperationField
  ) => {
    const response = await EditHomePageV2Contents(data, operation);
    if (response.remote === "success") {
      const notify = () => toast.info("update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
  };

  //youtube video content update
  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    operation: keyof HomePageOperationField
  ) => {
    e.preventDefault();
    setEditLoading(true);
    if (operation === "cardSection") {
      const { cardHeading, cardText, CardBackgroundColor, cards } = state;
      await updateContent(
        { cardHeading, cardText, CardBackgroundColor, cards },
        operation
      );
    }

    if (operation === "youtubeSection") {
      await updateContent(state.youtubeSection, "youtubeSection");
    }
    if (operation === "searchBar") {
      await updateContent(state.searchBar, operation);
    }
    if (operation === "topState") {
      await updateContent(state.topState, operation);
    }
    if (operation === "federalState") {
      await updateContent(state.federalState, operation);
    }
    if (operation === "gallery") {
      await updateContent(state.gallery, operation);
    }
    if (operation === "textContainer") {
      await updateContent(state.textContainer, operation);
    }
    if (operation === "emailSection") {
      await updateContent(state.mailChimpSection, operation);
    }

    if (operation === "companiesLogo") {
      const { companyLogoHeading } = state;
      await updateContent({ companyLogoHeading }, operation);
    }

    if (operation === "headerLogoSideImage") {
      const { headerLogoSideImage, sideImage } = state;
      const payload: any = {
        headerLogoSideImage,
        sideImage,
      };
      if (state.oldSideImage) {
        payload.oldSideImage = state.oldSideImage;
      }
      if (state.oldHeaderSideImage) {
        payload.oldImageHeaderLogoSideImage = state.oldHeaderSideImage;
      }
      await updateContent({ ...payload }, operation);
    }

    if (operation === "welcomeMessageForApp") {
      await updateContent(state.welcomeMessageForApp, "welcomeMessageForApp");
    }

    setEditLoading(false);
  };

  // Function to open the modal
  const handleImageGalleryModel = () => {
    setOpenModel(true);
  };

  // Function to close the modal and clear state
  const clearAllState = () => {
    setOpenModel(false);
  };
  const handleSelectedFile = (id: string, file: any) => {
    if (id.includes("cards-details-")) {
      setState({
        ...state,
        cards: state.cards.map((item: any) =>
          item._id === elementId.split("cards-details-")[1]
            ? { ...item, oldImages: file._id }
            : { ...item }
        ),
      });
    } else if (id === "text-container-content") {
      setState({
        ...state,
        textContainer: {
          ...state.textContainer,
          oldImages: file._id,
        },
      });
    } else if (id === "email-section-content") {
      setState({
        ...state,
        mailChimpSection: {
          ...state.mailChimpSection,
          oldImages: file._id,
        },
      });
    } else if (id === "sideImage") {
      setState({
        ...state,
        oldSideImage: file._id,
      });
    } else if (id === "headerLogoSideImage") {
      setState({
        ...state,
        oldHeaderSideImage: file._id,
      });
    }
  };
  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllHomePageV2Content();
    if (response.remote === "success") {
      if (response.data.data) {
        const {
          cardHeading,
          cardText,
          CardBackgroundColor,
          cards,
          youtubeSection,
          federalState,
          topState,
          searchBar,
          gallery,
          textContainer,
          mailChimpSection,
          companyLogoHeading,
          welcomeMessageForApp,
        } = response.data.data;
        setState({
          ...state,
          youtubeSection: youtubeSection
            ? youtubeSection
            : state.youtubeSection,
          cardHeading,
          cardText,
          CardBackgroundColor,
          cards:
            cards.length >= 3
              ? cards.map((itm) => ({ ...itm, image: null }))
              : state.cards,
          federalState: federalState ? federalState : state.federalState,
          topState: topState ? topState : state.topState,
          searchBar: searchBar ? searchBar : state.searchBar,
          gallery: gallery ? gallery : state.gallery,
          textContainer: textContainer
            ? { ...textContainer, image: null }
            : state.textContainer,
          mailChimpSection: mailChimpSection
            ? { ...mailChimpSection, image: null }
            : state.mailChimpSection,
          companyLogoHeading,
          welcomeMessageForApp: welcomeMessageForApp
            ? welcomeMessageForApp
            : state.welcomeMessageForApp,
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
      <Title heading="Home page dynamic content" />
      <form onSubmit={(e) => handleUpdate(e, "youtubeSection")}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Youtube content" />
          </Grid>

          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "youtubeSection"
                )
              }
              value={state?.youtubeSection?.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Description</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="text"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "youtubeSection"
                )
              }
              value={state?.youtubeSection?.text}
            />
          </Grid>

          <Grid item lg={4}>
            <label>video link</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              autoComplete="off"
              name="videoLink"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "youtubeSection"
                )
              }
              value={state?.youtubeSection?.videoLink}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Background color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="outlined-basic"
              autoComplete="off"
              name="backgroundColor"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "youtubeSection"
                )
              }
              value={state?.youtubeSection?.backgroundColor}
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
          handleUpdate(e, "cardSection");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Tipps & Wissenswertes Cards" />
          </Grid>
          <Grid item lg={4}>
            <label>Card heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="cardHeading"
              onChange={handleChangeForSingleLevelType}
              value={state?.cardHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Card sub heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="cardText"
              onChange={handleChangeForSingleLevelType}
              value={state?.cardText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Background color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="outlined-basic"
              autoComplete="off"
              name="CardBackgroundColor"
              onChange={handleChangeForSingleLevelType}
              value={state?.CardBackgroundColor}
            />
          </Grid>

          <Grid item xs={12}>
            <Title heading="Cards Details" />
          </Grid>

          <Grid item lg={12}>
            <Box className="cards-container">
              {state.cards.map((_crd: any, idx) => (
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
                        id={`cards-details-${_crd._id}`}
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
                                    cards: state.cards.map((item: any, index) =>
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
                          handleChangeForArrayType(e as any, idx, "cards");
                        }}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <label>Card Url</label>
                      <TextField
                        fullWidth
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="link"
                        onChange={(e) => {
                          handleChangeForArrayType(e as any, idx, "cards");
                        }}
                        value={state.cards[idx].link}
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

      <form onSubmit={(e) => handleUpdate(e, "searchBar")}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Search Bar content" />
          </Grid>
          <Grid item lg={12}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "searchBar"
                )
              }
              value={state?.searchBar?.heading}
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
          handleUpdate(e, "topState");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Top state content" />
          </Grid>
          <Grid item lg={12}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "topState"
                )
              }
              value={state?.topState?.heading}
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
          handleUpdate(e, "federalState");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Federal state content" />
          </Grid>
          <Grid item lg={12}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "federalState"
                )
              }
              value={state?.federalState?.heading}
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
          handleUpdate(e, "gallery");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Gallery content" />
          </Grid>
          <Grid item lg={6}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "gallery"
                )
              }
              value={state?.gallery?.heading}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Backgroud color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="outlined-basic"
              autoComplete="off"
              name="backgroundColor"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "gallery"
                )
              }
              value={state?.gallery?.backgroundColor}
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
          handleUpdate(e, "textContainer");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Text container content" />
          </Grid>
          <Grid item lg={4}>
            <label>Text first</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="text1"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "textContainer"
                )
              }
              value={state?.textContainer?.text1}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Image</label>
            <TextField
              fullWidth
              type="file"
              placeholder="Select image"
              id="text-container-content"
              autoComplete="off"
              name="image"
              // value={state?.textContainer?.image}
              onClick={(e: any) => {
                setSelectedCardId("text-container-content");
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
                          textContainer: {
                            ...state.textContainer,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.textContainer?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.textContainer?.oldImages
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "textContainer"
                )
              }
            />
          </Grid>

          <Grid item lg={4}>
            <label>Text second</label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              autoComplete="off"
              name="text2"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "textContainer"
                )
              }
              value={state?.textContainer?.text2}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Backgroud color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="outlined-basic"
              autoComplete="off"
              name="logoGalleryColor"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "textContainer"
                )
              }
              value={state?.textContainer?.logoGalleryColor}
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
          handleUpdate(e, "companiesLogo");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Company logo content" />
          </Grid>
          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="companyLogoHeading"
              onChange={handleChangeForSingleLevelType}
              value={state?.companyLogoHeading}
            />
          </Grid>

          {/* <Grid item lg={4}>
            <label>Background color</label>
            <TextField
            type="color"
              fullWidth
              id="outlined-basic"
              autoComplete="off"
              name="logoGalleryColor"
              onChange={handleChangeForSingleLevelType}
              value={state?.logoGalleryColor}
            />
          </Grid>
           */}

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "emailSection");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Email section content" />
          </Grid>
          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "mailChimpSection"
                )
              }
              value={state?.mailChimpSection?.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Text1</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="text1"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "mailChimpSection"
                )
              }
              value={state?.mailChimpSection?.text1}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Text2</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="text2"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "mailChimpSection"
                )
              }
              value={state?.mailChimpSection?.text2}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button text</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="buttonText"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "mailChimpSection"
                )
              }
              value={state?.mailChimpSection?.buttonText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>image</label>
            <TextField
              fullWidth
              type="file"
              id="email-section-content"
              autoComplete="off"
              name="image"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "mailChimpSection"
                )
              }
              onClick={(e: any) => {
                setSelectedCardId("email-section-content");
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
                          mailChimpSection: {
                            ...state.mailChimpSection,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.mailChimpSection?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.mailChimpSection?.oldImages
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
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
          handleUpdate(e, "headerLogoSideImage");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Header logo side image" />
          </Grid>

          <Grid item lg={4}>
            <label>Logo 1</label>
            <TextField
              fullWidth
              type="file"
              id="sideImage"
              autoComplete="off"
              name="sideImage"
              onChange={handleChangeForSingleLevelType}
              onClick={(e: any) => {
                setSelectedCardId("sideImage");
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
                          oldSideImage: null,
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.oldSideImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(mediaUrls, state.oldSideImage)}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item lg={4}>
            <label>Logo 2</label>
            <TextField
              fullWidth
              type="file"
              id="headerLogoSideImage"
              autoComplete="off"
              name="headerLogoSideImage"
              onChange={handleChangeForSingleLevelType}
              onClick={(e: any) => {
                setSelectedCardId("headerLogoSideImage");
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
                          oldHeaderSideImage: null,
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.oldHeaderSideImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.oldHeaderSideImage
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
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

      <form onSubmit={(e) => handleUpdate(e, "welcomeMessageForApp")}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="App welcome message" />
          </Grid>
          <Grid
            item
            lg={12}
            sx={{
              "& .ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline":
                {
                  height: "300px !important",
                },
              "& .ck-source-editing-area textarea": {
                height: "300px !important",
              },

              "& ..ck-source-editing-area": {
                position: "relative",
                overflow: "hidden",
                height: "300px !important",
              },
            }}
          >
            <label style={{ fontWeight: "600" }}>Heading</label>
            {/* <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                )
              }
              value={state?.welcomeMessageForApp?.heading}
            /> */}
            <TextEditorNew
              content={state?.welcomeMessageForApp?.heading || ""}
              setContent={(data) => {
                const e: any = { target: { value: data, name: "heading" } };

                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                );
              }}
            />
          </Grid>

          <Grid
            item
            lg={12}
            sx={{
              "& .ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline":
                {
                  height: "300px !important",
                },
              "& .ck-source-editing-area textarea": {
                height: "300px !important",
              },

              "& ..ck-source-editing-area": {
                position: "relative",
                overflow: "hidden",
                height: "300px !important",
              },
            }}
          >
            <label style={{ fontWeight: "600", marginTop: "10px" }}>
              Sub-heading
            </label>
            {/* <TextField
              fullWidth
              required
              id="outlined-basic"
              autoComplete="off"
              name="subHeading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                )
              }
              value={state?.welcomeMessageForApp?.subHeading}
            /> */}
            {/* <TextEditor
              content={state?.welcomeMessageForApp?.subHeading || ""}
              setContent={(data) => {
                const e: any = { target: { value: data, name: "subHeading" } };

                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                );
              }}
            /> */}
            <TextEditorNew
              content={state?.welcomeMessageForApp?.subHeading || ""}
              setContent={(data) => {
                const e: any = { target: { value: data, name: "subHeading" } };

                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                );
              }}
            />
          </Grid>

          <Grid
            item
            lg={12}
            sx={{
              "& .ck.ck-content.ck-editor__editable.ck-rounded-corners.ck-editor__editable_inline":
                {
                  height: "300px !important",
                },
              "& .ck-source-editing-area textarea": {
                height: "300px !important",
              },

              "& ..ck-source-editing-area": {
                position: "relative",
                overflow: "hidden",
                height: "300px !important",
              },
            }}
          >
            <label style={{ fontWeight: "600", marginTop: "10px" }}>
              Message
            </label>
            {/* <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="text"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                )
              }
              value={state?.welcomeMessageForApp?.text}
            /> */}
            <TextEditorNew
              content={state?.welcomeMessageForApp?.text || ""}
              setContent={(data) => {
                const e: any = { target: { value: data, name: "text" } };

                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "welcomeMessageForApp"
                );
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
      {/* Modal for Image Gallery */}
      {/* <IModal open={openModel} handleClose={clearAllState}>
        <ImageGallery
          onSubmit={(file) => handleFileChange(file, "textContainer")}
        />
      </IModal> */}
    </>
  );
}

export default MagazinePage;
