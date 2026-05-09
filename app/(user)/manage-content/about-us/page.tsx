"use client";
import React, { useEffect, useRef, useState } from "react";
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
import {
  About,
  AboutFeature,
  AboutMarketingCard,
  CareerFairCard,
  ContactCard,
  HandleUpdateOperationField,
  MediaCard,
  OfferCard,
  TwoCardInMiddle,
} from "@/app/api/manageContent/manageContent.Types";
import TextEditor from "../textEditor/textEditor";
import { v4 } from "uuid";
import "./style.css";
import {
  EditAboutContents,
  getAllAboutContent,
} from "@/app/api/manageContent/manageContent";
import { cardFactory } from "@/app/ulits/customMethods";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { handleFindImage } from "@/app/ulits/constatnt";

function AboutUs() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  // State to manage the file name
  const [fileName, setFileName] = useState<string | null>(null);
  const [state, setState] = useState<About>({
    banner: { image: null, text: "", oldImage: null },
    textBlock: { topHeading: "", sideHeading: "", text: "" },
    features: [
      ...cardFactory<AboutFeature>(
        {
          _id: v4(),
          text: "",
        },
        3
      ),
    ],
    aboutFeaturesHeadingFirst: "",
    aboutFeaturesHeadingSecond: "",
    aboutFeaturesImage: null,
    ourCustomers: [
      {
        _id: v4(),
        image: null,
        url: "",
      },
    ],
    marketingFirstHeading: "",
    marketingSecondHeading: "",
    marketingCards: [
      ...cardFactory<AboutMarketingCard>(
        {
          _id: v4(),
          heading: "",
          text: "",
        },
        4
      ),
    ],
    slider: [
      {
        _id: v4(),
        image: null,
        oldImage: null,
      },
    ],
    careerFairFirstHeading: "",
    careerFairSecondHeading: "",
    careerFairCards: [
      ...cardFactory<CareerFairCard>(
        {
          _id: v4(),
          heading: "",
          image: null,
          text: "",
        },
        3
      ),
    ],
    exhibitors: [
      {
        _id: v4(),
        image: null,
      },
    ],
    youTubeHeadingFirst: "",
    youTubeHeadingSecond: "",
    youTubeLinkFirst: "",
    youTubeLinkSecond: "",
    contactHeadingFirst: "",
    contactHeadingSecond: "",
    contactCard: [
      ...cardFactory<ContactCard>(
        {
          _id: v4(),
          heading: "",
          text: "",
          image: null,
        },
        3
      ),
    ],
    calender: {
      calendlyUrl: "",
      sideImage: null,
      headingFirst: "",
      textFirst: "",
      headingTwo: "",
      textTwo: "",
      headingThird: "",
      textThird: "",
      headingForth: "",
      textFourth: "",
    },
    mediaDataHeading: "",
    mediaCards: [
      ...cardFactory<MediaCard>(
        {
          _id: v4(),
          headingFirst: "",
          headingSecond: "",
          buttonHeading: "",
          url: "",
        },
        6
      ),
    ],
    OfferCards: [
      ...cardFactory<OfferCard>(
        { _id: "", heading: "", text: "", image: null, url: "" },
        3
      ),
    ],
    twoCards: cardFactory<TwoCardInMiddle>(
      {
        _id: v4(),
        heading: "",
        image: null,
        text: "",
        buttonText: "",
        buttonUrl: "",
        buttonColor: "",
      },
      2
    ),
  });
  const [selectedCardId, setSelectedCardId] = useState("");
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  // Create a reference for the file input
  const fileInputRef = useRef<Array<HTMLInputElement | null>>([]);

  // Function to clear the file input
  const handleClearImage = (idx: number) => {
    const fileInput = fileInputRef.current[idx];

    // Type guard to ensure fileInput is not null
    if (fileInput) {
      fileInput.value = ""; // Clear the file input
      setFileName(null); // Reset file name state (if needed)
    }

    // Reset the image in state
    setState((prevState) => ({
      ...prevState,
      ourCustomers: prevState.ourCustomers.map((customer, index) =>
        index === idx ? { ...customer, image: null } : customer
      ),
    }));
  };
  const addFeature = () => {
    setState({
      ...state,
      features: [...state.features, { _id: v4(), text: "" }],
    });
  };

  const addCustomer = () => {
    setState({
      ...state,
      ourCustomers: [
        ...state.ourCustomers,
        { _id: v4(), url: "", image: null },
      ],
    });
  };

  const addImageForSlider = () => {
    setState({
      ...state,
      slider: [
        ...state.slider,
        {
          _id: v4(),
          image: null,
        },
      ],
    });
  };

  const addCareerCard = () => {
    setState({
      ...state,
      careerFairCards: [
        ...state.careerFairCards,
        {
          _id: v4(),
          heading: "",
          image: null,
          text: "",
        },
      ],
    });
  };

  const addMarketingCard = () => {
    setState({
      ...state,
      marketingCards: [
        ...state.marketingCards,
        { _id: v4(), heading: "", text: "" },
      ],
    });
  };

  const addExhibitor = () => {
    setState({
      ...state,
      exhibitors: [
        ...state.exhibitors,
        {
          _id: v4(),
          image: null,
        },
      ],
    });
  };

  const addContactCard = () => {
    setState({
      ...state,
      contactCard: [
        ...state.contactCard,
        {
          _id: v4(),
          heading: "",
          text: "",
          image: "",
        },
      ],
    });
  };

  const addMediaCard = () => {
    setState({
      ...state,
      mediaCards: [
        ...state.mediaCards,
        {
          _id: v4(),
          headingFirst: "",
          headingSecond: "",
          url: "",
          buttonHeading: "",
        },
      ],
    });
  };

  const handleChangeForObjectType = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetState: keyof About
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState((prevState) => ({
          ...prevState,
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

  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof About
  ) => {
    const { target } = e;
    const { name, value, files } = target;
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name); // Update the file name in state
    }
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

  const handleChangeTextEditor = (
    name: string,
    value: string,
    targetState: keyof About
  ) => {
    setState((prevState) => ({
      ...prevState,
      [targetState]: { ...prevState[targetState], [name]: value },
    }));
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    operation: keyof HandleUpdateOperationField
  ) => {
    e.preventDefault();
    setEditLoading(true);
    if (operation === "banner") {
      const response = await EditAboutContents(state.banner, "banner");
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating a job market");
        notify();
      }
    }
    if (operation === "textBlock") {
      const response = await EditAboutContents(state.textBlock, "textBlock");
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating a job market");
        notify();
      }
    }
    if (operation === "aboutFeature") {
      const {
        aboutFeaturesHeadingFirst,
        aboutFeaturesHeadingSecond,
        aboutFeaturesImage,
        features,
      } = state;
      const response = await EditAboutContents(
        {
          aboutFeaturesHeadingFirst,
          aboutFeaturesHeadingSecond,
          aboutFeaturesImage,
          features,
        },
        "aboutFeature"
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating a job market");
        notify();
      }
    }
    if (operation === "marketing") {
      const { marketingFirstHeading, marketingSecondHeading, marketingCards } =
        state;
      const response = await EditAboutContents(
        {
          marketingFirstHeading,
          marketingSecondHeading,
          marketingCards: marketingCards.map(({ heading, text }) => ({
            heading,
            text,
          })),
        },
        "marketing"
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "youTube") {
      const {
        youTubeHeadingFirst,
        youTubeHeadingSecond,
        youTubeLinkFirst,
        youTubeLinkSecond,
      } = state;
      const response = await EditAboutContents(
        {
          youTubeHeadingFirst,
          youTubeHeadingSecond,
          youTubeLinkFirst,
          youTubeLinkSecond,
        },
        "youTube"
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "mediaData") {
      const { mediaDataHeading, mediaCards } = state;
      const response = await EditAboutContents(
        {
          mediaDataHeading,
          mediaCards: mediaCards.map(
            ({ buttonHeading, headingFirst, headingSecond, url }) => ({
              buttonHeading,
              headingFirst,
              headingSecond,
              url,
            })
          ),
        },
        "mediaData"
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "calender") {
      const { sideImage, ...restData } = state.calender;
      let payload: any = {};
      if (sideImage) {
        payload = { ...restData, sideImage };
      } else payload = { ...restData };
      const response = await EditAboutContents(
        {
          ...payload,
        },
        "calender"
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "offerCard") {
      const response = await EditAboutContents(state.OfferCards, operation);
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "customer") {
      const response = await EditAboutContents(state.ourCustomers, operation);
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "slider") {
      const response = await EditAboutContents(state.slider, operation);
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "exhibitor") {
      const response = await EditAboutContents(state.exhibitors, operation);
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "careerFair") {
      const {
        careerFairFirstHeading,
        careerFairSecondHeading,
        careerFairCards,
      } = state;
      const response = await EditAboutContents(
        { careerFairFirstHeading, careerFairSecondHeading, careerFairCards },
        operation
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "contact") {
      const { contactHeadingFirst, contactHeadingSecond, contactCard } = state;
      const response = await EditAboutContents(
        { contactHeadingFirst, contactHeadingSecond, contactCard },
        operation
      );
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    if (operation === "twoCards") {
      const response = await EditAboutContents(state.twoCards, operation);
      if (response.remote === "success") {
        const notify = () => toast.info("update successfully!");
        notify();
      } else {
        const notify = () => toast.error("Error updating");
        notify();
      }
    }
    setEditLoading(false);
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllAboutContent();
    if (response.remote === "success") {
      if (response.data.data) {
        const {
          banner,
          textBlock,
          aboutFeaturesHeadingFirst,
          aboutFeaturesHeadingSecond,
          features,
          marketingSecondHeading,
          marketingCards,
          marketingFirstHeading,
          youTubeHeadingFirst,
          youTubeHeadingSecond,
          youTubeLinkFirst,
          youTubeLinkSecond,
          mediaDataHeading,
          mediaCards,
          calender,
          OfferCards,
          ourCustomers,
          slider,
          exhibitors,
          careerFairFirstHeading,
          careerFairSecondHeading,
          careerFairCards,
          contactHeadingFirst,
          contactHeadingSecond,
          contactCard,
          twoCards,
        } = response.data.data;
        setState({
          ...state,
          banner: banner ? { ...banner, image: null } : { ...state.banner },
          textBlock: textBlock ? { ...textBlock } : { ...state.textBlock },
          aboutFeaturesHeadingFirst,
          aboutFeaturesHeadingSecond,
          features,
          marketingSecondHeading,
          marketingCards:
            marketingCards.length >= 4 ? marketingCards : state.marketingCards,
          marketingFirstHeading,
          youTubeHeadingFirst,
          youTubeHeadingSecond,
          youTubeLinkFirst,
          youTubeLinkSecond,
          mediaDataHeading,
          mediaCards: mediaCards.length > 0 ? mediaCards : state.mediaCards,
          calender: calender
            ? { ...calender, sideImage: null }
            : state.calender,
          OfferCards:
            OfferCards.length > 0
              ? OfferCards.map((itm) => ({ ...itm, image: null }))
              : state.OfferCards,
          ourCustomers:
            ourCustomers.length > 0
              ? ourCustomers.map((itm) => ({ ...itm, image: null }))
              : state.ourCustomers,
          slider: slider.map((itm) => ({ ...itm, image: null })),
          exhibitors: exhibitors.map((itm) => ({ ...itm, image: null })),
          careerFairFirstHeading,
          careerFairSecondHeading,
          careerFairCards:
            careerFairCards.length > 0
              ? careerFairCards.map((itm) => ({ ...itm, image: null }))
              : state.careerFairCards,
          contactHeadingFirst,
          contactHeadingSecond,
          contactCard:
            contactCard.length > 0
              ? contactCard.map((itm) => ({ ...itm, image: null }))
              : state.contactCard,
          twoCards:
            twoCards.length > 0
              ? twoCards.map((itm) => ({ ...itm, image: null }))
              : state.twoCards,
        });
      }
    }
    setIsLoading(false);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSelectedFile = (id: string, file: any) => {
    if (id === "bannercontentOldImage") {
      setState({
        ...state,
        banner: {
          ...state.banner,
          oldImage: file._id,
        },
      });
    } else if (id === "OurFeaturesOldImage") {
      setState({
        ...state,
        aboutFeaturesImage: {
          ...state.aboutFeaturesImage,
          oldImage: file._id,
        },
      });
    } else if (id.includes("file-input-")) {
      setState({
        ...state,
        ourCustomers: state.ourCustomers.map((item: any) =>
          item._id === selectedCardId
            ? { ...item, oldImage: file._id }
            : { ...item }
        ),
      });
    } else if (
      id === elementId &&
      !elementId.includes("career-fairs") &&
      !elementId.includes("exhibitor-images") &&
      !elementId.includes("contactCard") &&
      !elementId.includes("contact-image") &&
      !elementId.includes("offer-card-") &&
      !elementId.includes("twoCards-")
    ) {
      setState({
        ...state,
        slider: state.slider.map((item: any) =>
          item._id === elementId ? { ...item, oldImage: file._id } : { ...item }
        ),
      });
    } else if (id.includes("career-fairs")) {
      setState({
        ...state,
        careerFairCards: state.careerFairCards.map((item: any) =>
          item._id === elementId.split("career-fairs-")[1]
            ? { ...item, oldImage: file._id }
            : { ...item }
        ),
      });
    } else if (elementId.includes("exhibitor-images")) {
      setState({
        ...state,
        exhibitors: state.exhibitors.map((item: any) =>
          item._id === elementId.split("exhibitor-images-")[1]
            ? { ...item, oldImage: file._id }
            : { ...item }
        ),
      });
    } else if (elementId.includes("contactCard")) {
      setState({
        ...state,
        contactCard: state.contactCard.map((item: any) =>
          item._id === elementId.split("contactCard-")[1]
            ? { ...item, oldImage: file._id }
            : { ...item }
        ),
      });
    } else if (elementId.includes("contact-image")) {
      setState({
        ...state,
        calender: {
          ...state?.calender,
          oldImages: file._id,
        },
      });
    } else if (elementId.includes("offer-card-")) {
      setState({
        ...state,
        OfferCards: state.OfferCards.map((item: any) =>
          item._id === elementId.split("offer-card-")[1]
            ? { ...item, oldImages: file._id }
            : { ...item }
        ),
      });
    } else if(elementId.includes("twoCards-")){
      setState({
        ...state,
        twoCards: state.twoCards.map((item: any) =>
          item._id === elementId.split("twoCards-")[1]
            ? { ...item, oldImages: file._id }
            : { ...item }
        ),
      });
    }
  };
  useEffect(() => {
    handleGetAllContent();
  }, []);
  useEffect(() => {
    console.log({ state });
  }, [state]);
  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="About Us content" />

      <form
        onSubmit={(e) => {
          handleUpdate(e, "banner");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Banner content" />
          </Grid>
          <Grid item lg={6}>
            <label>Banner Text</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="text"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "banner"
                )
              }
              value={state?.banner?.text}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Background Picture</label>
            <TextField
              fullWidth
              type="file"
              id="bannercontentOldImage"
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
                      edge="end"
                      aria-label="Clear"
                      onClick={() => {
                        setState({
                          ...state,
                          banner: {
                            ...state.banner,
                            oldImage: null,
                          },
                        });
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.banner.oldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.banner.oldImage
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
              name="image"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "banner"
                )
              }
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
          handleUpdate(e, "textBlock");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid xs={12} item>
            <Title heading="Text Block" />
          </Grid>
          <Grid lg={6} item>
            <label>Top Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="topHeading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "textBlock"
                )
              }
              value={state.textBlock.topHeading}
            />
          </Grid>
          <Grid lg={6} item>
            {" "}
            <label>Side Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="sideHeading"
              onChange={(e) =>
                handleChangeForObjectType(
                  e as React.ChangeEvent<HTMLInputElement>,
                  "textBlock"
                )
              }
              value={state.textBlock.sideHeading}
            />
          </Grid>
          <Grid lg={12} item>
            {" "}
            <label>Text Content</label>
            <TextEditor
              content={state.textBlock.text}
              setContent={(data) => {
                handleChangeTextEditor("text", data, "textBlock");
              }}
            />
          </Grid>
          <Grid item lg={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "aboutFeature");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid lg={12} item>
            <Title heading="Our Features" />
          </Grid>
          <Grid item lg={6}>
            {" "}
            <label>Heading First</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter First Heading"
              autoComplete="off"
              name="aboutFeaturesHeadingFirst"
              onChange={handleChangeForSingleLevelType}
              value={state.aboutFeaturesHeadingFirst}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Second Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Second Heading"
              autoComplete="off"
              name="aboutFeaturesHeadingSecond"
              onChange={handleChangeForSingleLevelType}
              value={state.aboutFeaturesHeadingSecond}
            />
          </Grid>
          <Grid item lg={12}>
            <label>Picture</label>
            <TextField
              fullWidth
              type="file"
              id="OurFeaturesOldImage"
              placeholder="Enter Heading"
              autoComplete="off"
              name="aboutFeaturesImage"
              onChange={handleChangeForSingleLevelType}
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
                      edge="end"
                      aria-label="Clear"
                      onClick={() => {
                        setState({
                          ...state,
                          aboutFeaturesImage: {
                            ...state.aboutFeaturesImage,
                            oldImage: null,
                          },
                        });
                      }}
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.aboutFeaturesImage?.oldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.aboutFeaturesImage?.oldImage
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
          {state.features.map((feat, index) => (
            <Grid item lg={12} key={feat._id}>
              <label>Features</label>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                placeholder="Enter Heading"
                autoComplete="off"
                name="text"
                onChange={(e) => {
                  handleChangeForArrayType(e as any, index, "features");
                }}
                value={state.features[index].text}
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
          handleUpdate(e, "customer");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item lg={12}>
            <Title heading="Our Customers" />
          </Grid>
          <Grid item lg={12}>
            <Button
            // onClick={addCustomer}
            >
              Add customer
            </Button>
          </Grid>
          {state.ourCustomers.map((cus: any, idx) => (
            <>
              <Grid item lg={6}>
                <label>Customer Url</label>
                <TextField
                  fullWidth
                  required
                  id={cus._id}
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="url"
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "ourCustomers");
                  }}
                  value={state.ourCustomers[idx].url}
                />
              </Grid>

              {/* <Grid item lg={6}>
                <label>Image</label>
                <TextField
                  fullWidth
                  type="file"
                  id="outlined-basic"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="image"
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "ourCustomers");
                  }}
                />
              </Grid> */}

              <Grid item lg={6}>
                <label>Image</label>
                <TextField
                  fullWidth
                  type="file"
                  id={`file-input-${idx}`}
                  autoComplete="off"
                  name="image"
                  inputProps={{ accept: "image/*" }} // Only accept image files
                  inputRef={(el) => (fileInputRef.current[idx] = el)} // Attach the ref to the file input
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "ourCustomers"); // Adjust the index and targetState as needed
                  }}
                  onClick={(e: any) => {
                    setSelectedCardId(cus._id);
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
                            handleClearImage(idx);
                            setState({
                              ...state,
                              ourCustomers: state.ourCustomers.map(
                                (item: any, index) =>
                                  index === idx
                                    ? { ...item, oldImage: null }
                                    : { ...item }
                              ),
                            });
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {cus?.oldImage ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(mediaUrls, cus?.oldImage)}
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
            </>
          ))}
          <Grid item lg={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "marketing");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item lg={12}>
            <Title heading="Marketing" />
          </Grid>
          <Grid item lg={6}>
            <label>Marketing Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="marketingFirstHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.marketingFirstHeading}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Marketing Second Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="marketingSecondHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.marketingSecondHeading}
            />
          </Grid>
          <Grid item lg={12}>
            <Box className="cards-container">
              {state.marketingCards.map((_crd, idx) => (
                <Box className="card-section" key={_crd._id}>
                  <Grid container spacing={1}>
                    <Grid item lg={6}>
                      <label>Card Heading</label>
                      <TextField
                        fullWidth
                        required
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="heading"
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "marketingCards"
                          );
                        }}
                        value={state.marketingCards[idx].heading}
                      />
                    </Grid>

                    <Grid item lg={6}>
                      <label>Card Content</label>
                      <TextField
                        fullWidth
                        required
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="text"
                        onChange={(e) => {
                          handleChangeForArrayType(
                            e as any,
                            idx,
                            "marketingCards"
                          );
                        }}
                        value={state.marketingCards[idx].text}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}
            </Box>
          </Grid>
          <Grid item lg={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "slider");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Slider Images" />
          </Grid>

          <Grid item xs={12}>
            <Button onClick={addImageForSlider}>add more images</Button>
          </Grid>
          {state.slider.map((itm, idx) => (
            <>
              <Grid item lg={6}>
                <label>Image</label>
                <TextField
                  fullWidth
                  type="file"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="image"
                  id={itm._id}
                  onClick={(e: any) => {
                    const id = e.target.id;
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(id));
                  }}
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "slider");
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setState({
                              ...state,
                              slider: state.slider.map((item: any, index) =>
                                index === idx
                                  ? { ...item, oldImage: null }
                                  : { ...item }
                              ),
                            });
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {itm?.oldImage ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(mediaUrls, itm?.oldImage)}
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
            </>
          ))}

          <Grid item lg={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "careerFair");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Career Fairs" />
          </Grid>
          <Grid item xs={6}>
            {" "}
            <label>First Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="careerFairFirstHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.careerFairFirstHeading}
            />
          </Grid>
          <Grid item xs={6}>
            <label>Second Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="careerFairSecondHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.careerFairSecondHeading}
            />
          </Grid>
          {/* <Grid item xs={12}>
            <Button onClick={addCareerCard}>add more</Button>
          </Grid> */}
          {state.careerFairCards.map((itm: any, idx) => (
            <>
              <Grid item lg={4}>
                {" "}
                <label>Card Heading</label>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="heading"
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "careerFairCards");
                  }}
                  value={state.careerFairCards[idx].heading}
                />
              </Grid>
              <Grid item lg={4}>
                {" "}
                <label>Card Text</label>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="text"
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "careerFairCards");
                  }}
                  value={state.careerFairCards[idx].text}
                />
              </Grid>
              <Grid item lg={4}>
                <label>Image</label>
                <TextField
                  fullWidth
                  type="file"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="image"
                  id={`career-fairs-${itm._id}`}
                  onClick={(e: any) => {
                    const id = e.target.id;
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(id));
                    setSelectedCardId("career-fairs");
                  }}
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "careerFairCards");
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                        onClick={(e) => {
                          e.stopPropagation();
                            setState({
                              ...state,
                              careerFairCards: state.careerFairCards.map(
                                (item: any, index) =>
                                  index === idx
                                    ? { ...item, oldImage: null }
                                    : { ...item }
                              ),
                            });
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {itm?.oldImage ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(mediaUrls, itm?.oldImage)}
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
            </>
          ))}
          <Grid item xs={12}>
            {" "}
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "exhibitor");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Exhibitor Images" />
          </Grid>
          <Grid item xs={12}>
            {" "}
            <Button onClick={addExhibitor}>add more images</Button>
          </Grid>
          {state.exhibitors.map((itm, idx) => (
            <Grid item lg={6} key={itm._id}>
              <label>Image</label>
              <TextField
                fullWidth
                type="file"
                placeholder="Enter Heading"
                autoComplete="off"
                name="image"
                id={`exhibitor-images-${itm._id}`}
                onClick={(e: any) => {
                  const id = e.target.id;
                  if (!isOpen) {
                    e.preventDefault();
                  }
                  handleOpenGalleryModel();
                  dispatch(setCurrentElementId(id));
                  setSelectedCardId("career-fairs");
                }}
                onChange={(e) => {
                  handleChangeForArrayType(e as any, idx, "exhibitors");
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setState({
                            ...state,
                            exhibitors: state.exhibitors.map(
                              (item: any, index) =>
                                index === idx
                                  ? { ...item, oldImage: null }
                                  : { ...item }
                            ),
                          });
                        }} // Clear image on click
                        edge="end"
                        aria-label="Clear"
                      >
                        <ClearIcon />
                      </IconButton>
                      {itm?.oldImage ? (
                        <>
                          <img
                            height={30}
                            width={40}
                            src={handleFindImage(mediaUrls, itm?.oldImage)}
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
          handleUpdate(e, "youTube");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Youtube video Section" />
          </Grid>
          <Grid item lg={6}>
            <label>Heading First</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="youTubeHeadingFirst"
              onChange={handleChangeForSingleLevelType}
              value={state.youTubeHeadingFirst}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Heading Second</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="youTubeHeadingSecond"
              onChange={handleChangeForSingleLevelType}
              value={state.youTubeHeadingSecond}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Link First</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="youTubeLinkFirst"
              onChange={handleChangeForSingleLevelType}
              value={state.youTubeLinkFirst}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Link Second</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="youTubeLinkSecond"
              onChange={handleChangeForSingleLevelType}
              value={state.youTubeLinkSecond}
            />
          </Grid>
          <Grid xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "contact");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item lg={12}>
            <Title heading="Contact Section" />
          </Grid>
          <Grid item lg={6}>
            <label>Contact Heading First</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="contactHeadingFirst"
              onChange={handleChangeForSingleLevelType}
              value={state.contactHeadingFirst}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Contact Heading Second</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="contactHeadingSecond"
              onChange={handleChangeForSingleLevelType}
              value={state.contactHeadingSecond}
            />
          </Grid>
          <Grid item xs={12}>
            <Button onClick={addContactCard}>Add Contact Card</Button>
          </Grid>
          {state.contactCard.map((itm: any, idx) => (
            <>
              <Grid item lg={4}>
                <label>Card Heading</label>
                <TextField
                  multiline
                  maxRows={4}
                  fullWidth
                  required
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="heading"
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "contactCard");
                  }}
                  value={state.contactCard[idx].heading}
                />
              </Grid>
              <Grid item lg={4}>
                <label>Card Text</label>
                <TextField
                  multiline
                  maxRows={4}
                  fullWidth
                  required
                  id="outlined-basic"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="text"
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "contactCard");
                  }}
                  value={state.contactCard[idx].text}
                />
              </Grid>
              <Grid item lg={4}>
                <label>Image</label>
                <TextField
                  fullWidth
                  type="file"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="image"
                  id={`contactCard-${itm._id}`}
                  onClick={(e: any) => {
                    console.log("first>>>>>>>>");
                    const id = e.target.id;
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(id));
                    setSelectedCardId("contactCard");
                  }}
                  onChange={(e) => {
                    handleChangeForArrayType(e as any, idx, "contactCard");
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setState({
                              ...state,
                              contactCard: state.contactCard.map(
                                (item: any, index) =>
                                  index === idx
                                    ? { ...item, oldImage: null }
                                    : { ...item }
                              ),
                            });
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {itm?.oldImage ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(mediaUrls, itm?.oldImage)}
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
            </>
          ))}
          <Grid xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      {/* calender section */}
      <form
        onSubmit={(e) => {
          handleUpdate(e, "calender");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Calender Section" />
          </Grid>
          <Grid item lg={6}>
            <label>Calendly Url</label>
            <TextField
              fullWidth
              type="Url"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="calendlyUrl"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.calendlyUrl}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Side image</label>
            <TextField
              fullWidth
              type="file"
              id={`contact-image`}
              onClick={(e: any) => {
                const id = e.target.id;
                if (!isOpen) {
                  e.preventDefault();
                }
                handleOpenGalleryModel();
                dispatch(setCurrentElementId(id));
                setSelectedCardId("contactCard");
              }}
              placeholder="Enter Heading"
              autoComplete="off"
              name="sideImage"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setState({
                          ...state,
                          calender: {
                            ...state?.calender,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state?.calender?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state?.calender?.oldImages
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Heading First</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="headingFirst"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.headingFirst}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Text First</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="textFirst"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.textFirst}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Heading Second</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="headingTwo"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.headingTwo}
            />
          </Grid>

          <Grid item lg={6}>
            {" "}
            <label>Text Second</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="textTwo"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.textTwo}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Heading Third</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="headingThird"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.headingThird}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Text Third</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="textThird"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.textThird}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Heading Forth</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="headingForth"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.headingForth}
            />
          </Grid>
          <Grid item lg={6}>
            <label>Text Forth</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="textFourth"
              onChange={(e) => handleChangeForObjectType(e as any, "calender")}
              value={state.calender.textFourth}
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
          handleUpdate(e, "mediaData");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Media Data" />
          </Grid>
          <Grid item xs={12}>
            <label>Media Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="mediaDataHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.mediaDataHeading}
            />
          </Grid>
          <Box className="cards-container">
            {state.mediaCards.map((_itm, idx) => (
              <Box className="card-section" key={_itm._id}>
                <Grid container spacing={1}>
                  <Grid item lg={6}>
                    <label>Card Heading First</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="headingFirst"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "mediaCards")
                      }
                      value={state.mediaCards[idx].headingFirst}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Card Heading Second</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="headingSecond"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "mediaCards")
                      }
                      value={state.mediaCards[idx].headingSecond}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Card Button Heading</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="buttonHeading"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "mediaCards")
                      }
                      value={state.mediaCards[idx].buttonHeading}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Card Button Url</label>
                    <TextField
                      fullWidth
                      type="url"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="url"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "mediaCards")
                      }
                      value={state.mediaCards[idx].url}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "offerCard");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Offer Cards" />
          </Grid>
          <Box className="cards-container">
            {state.OfferCards.map((_itm, idx) => (
              <Box className="card-section" key={_itm._id}>
                <Grid container spacing={1}>
                  <Grid item lg={6}>
                    <label>Heading</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="heading"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "OfferCards")
                      }
                      value={state.OfferCards[idx].heading}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Text</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="text"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "OfferCards")
                      }
                      value={state.OfferCards[idx].text}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>url</label>
                    <TextField
                      fullWidth
                      type="url"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="url"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "OfferCards")
                      }
                      value={state.OfferCards[idx].url}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Image</label>
                    <TextField
                      fullWidth
                      type="file"
                      autoComplete="off"
                      name="image"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "OfferCards")
                      }
                      id={`offer-card-${_itm._id}`}
                      onClick={(e: any) => {
                        const id = e.target.id;
                        if (!isOpen) {
                          e.preventDefault();
                        }
                        handleOpenGalleryModel();
                        dispatch(setCurrentElementId(id));
                        setSelectedCardId("contactCard");
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setState({
                                  ...state,
                                  OfferCards: state.OfferCards.map(
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
                            {_itm?.oldImages ? (
                              <>
                                <img
                                  height={30}
                                  width={40}
                                  src={handleFindImage(
                                    mediaUrls,
                                    _itm?.oldImages
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
                </Grid>
              </Box>
            ))}
          </Box>
          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form
        onSubmit={(e) => {
          handleUpdate(e, "twoCards");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Additional Cards in Middle" />
          </Grid>
          <Box className="cards-container">
            {state.twoCards.map((_itm: any, idx) => (
              <Box className="card-section" key={_itm._id}>
                <Grid container spacing={1}>
                  <Grid item lg={6}>
                    <label>Heading</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="heading"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "twoCards")
                      }
                      value={state.twoCards[idx].heading}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>image</label>
                    <TextField
                      fullWidth
                      type="file"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="image"
                      id={`twoCards-${_itm._id}`}
                      onClick={(e: any) => {
                        const id = e.target.id;
                        if (!isOpen) {
                          e.preventDefault();
                        }
                        handleOpenGalleryModel();
                        dispatch(setCurrentElementId(id));
                        setSelectedCardId("contactCard");
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setState({
                                  ...state,
                                  twoCards: state.twoCards.map(
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
                            {_itm?.oldImages ? (
                              <>
                                <img
                                  height={30}
                                  width={40}
                                  src={handleFindImage(
                                    mediaUrls,
                                    _itm?.oldImages
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
                        handleChangeForArrayType(e as any, idx, "twoCards")
                      }
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Description</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="text"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "twoCards")
                      }
                      value={state.twoCards[idx].text}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Button text</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="buttonText"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "twoCards")
                      }
                      value={state.twoCards[idx].buttonText}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Button url</label>
                    <TextField
                      fullWidth
                      type="url"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="buttonUrl"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "twoCards")
                      }
                      value={state.twoCards[idx].buttonUrl}
                    />
                  </Grid>

                  <Grid item lg={6}>
                    <label>Button text</label>
                    <TextField
                      fullWidth
                      type="color"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="buttonColor"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "twoCards")
                      }
                      value={state.twoCards[idx].buttonColor}
                    />
                  </Grid>
                </Grid>
              </Box>
            ))}
          </Box>
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

export default AboutUs;
