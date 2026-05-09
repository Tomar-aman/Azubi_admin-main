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
  AboutTeamCard,
  ContactUs,
  ContactUsUpdateField,
  Counter,
  GoogleMapType,
} from "@/app/api/manageContent/manageContent.Types";
import { v4 } from "uuid";
import {
  EditContactUsContact,
  EditGoogleMap,
  getAllContactUsContent,
  getGoogleMap,
} from "@/app/api/manageContent/manageContent";
import { cardFactory } from "@/app/ulits/customMethods";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { handleFindImage } from "@/app/ulits/constatnt";

function ContactUsPage() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [mapstate, setMapState] = useState<GoogleMapType>({
    _id: "",
    field1: "",
    field2: "",
    field3: "",
    field4: "",
    field5: "",
  });
  const [selectedCardId, setSelectedCardId] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state?.user?.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [state, setState] = useState<ContactUs>({
    pageHeadingInGermany: "",
    contactForm: {
      heading: "",
      buttonText: "",
      text: "",
    },
    address: {
      placeFirstHeading: "",
      placeFirstText: "",
      telFirstHeading: "",
      telFirstTiming: "",
      telFirstNumber: "",
      placeSecondHeading: "",
      placeSecondText: "",
      telSecondHeading: "",
      telSecondTiming: "",
      telSecondNumber: "",
      EmailHeading: "",
      EmailAddress: "",
      instagramLink: "",
      youTubeLink: "",
    },
    aboutUs: {
      topHeading: "",
      text: "",
      sideImage: null,
      belowHeading: "",
      buttonText: "",
      buttonUrl: "",
      buttonColor: "",
    },
    counterHeading: "",
    counters: [
      ...cardFactory<Counter>(
        {
          _id: v4(),
          heading: "",
          count: "",
        },
        4
      ),
    ],
    contactCardFirstWithPoints: {
      heading: "",
      point1: "",
      point2: "",
      point3: "",
      point4: "",
      text: "",
      image: null,
    },
    ContactCardSecond: {
      heading: "",
      text: "",
      image: null,
      buttonText: "",
      buttonUrl: "",
      buttonColor: "",
    },
    aboutTeamHeading: "",
    aboutTeamSubHeading: "",
    aboutTeamCard: [
      ...cardFactory<AboutTeamCard>(
        {
          _id: v4(),
          image: null,
          heading: "",
          subHeading: "",
          buttonText: "",
          buttonUrl: "",
          buttonColor: "",
        },
        3
      ),
    ],
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setMapState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeForObjectType = (
    e: React.ChangeEvent<HTMLInputElement>,
    targetState: keyof ContactUs
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

  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof ContactUs
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
    operation: keyof ContactUsUpdateField
  ) => {
    const response = await EditContactUsContact(data, operation);
    if (response.remote === "success") {
      const notify = () => toast.info("Update successfully!");
      notify();
    } else {
      const notify = () => toast.error("Error updating a job market");
      notify();
    }
  };

  const handleUpdate = async (
    e: React.FormEvent<HTMLFormElement>,
    operation: keyof ContactUsUpdateField
  ) => {
    e.preventDefault();
    setEditLoading((prev) => ({ ...prev, [operation]: true }));
    if (operation === "pageHeading") {
      const { pageHeadingInGermany } = state;
      await updateContent({ pageHeadingInGermany }, operation);
    }
    if (operation === "contactForm") {
      const { contactForm } = state;
      await updateContent(contactForm, operation);
    }
    if (operation === "addressSection") {
      const { address } = state;
      await updateContent(address, operation);
    }
    if (operation === "aboutUs") {
      const { aboutUs } = state;
      await updateContent(aboutUs, operation);
      console.log(aboutUs);
    }
    if (operation === "counter") {
      const { counterHeading, counters } = state;
      await updateContent(
        { counterHeading, counters: counters.map(({ _id, ...rest }) => rest) },
        "counter"
      );
    }
    if (operation === "contactCardFirstWithPoints") {
      const { contactCardFirstWithPoints } = state;
      await updateContent(
        contactCardFirstWithPoints,
        "contactCardFirstWithPoints"
      );
    }
    if (operation === "ContactCardSecond") {
      const { ContactCardSecond } = state;
      await updateContent(ContactCardSecond, operation);
    }
    if (operation === "aboutTeam") {
      const { aboutTeamHeading, aboutTeamSubHeading, aboutTeamCard } = state;
      await updateContent(
        { aboutTeamHeading, aboutTeamSubHeading, aboutTeamCard },
        "aboutTeam"
      );
    }
    setEditLoading((prev) => ({ ...prev, [operation]: false }));
  };

  const handleGetAllContent = async () => {
    setIsLoading(true);
    const response = await getAllContactUsContent();
    if (response.remote === "success") {
      if (response.data.data) {
        const {
          pageHeadingInGermany,
          address,
          aboutUs,
          counterHeading,
          counters,
          contactCardFirstWithPoints,
          ContactCardSecond,
          aboutTeamHeading,
          aboutTeamSubHeading,
          aboutTeamCard,
          contactForm,
        } = response.data.data;
        setState({
          ...state,
          pageHeadingInGermany,
          contactForm: contactForm ? contactForm : state.contactForm,
          address: address || state.address,
          aboutUs: aboutUs ? { ...aboutUs, sideImage: null } : state.aboutUs,
          counterHeading,
          counters: counters.length >= 4 ? counters : state.counters,
          contactCardFirstWithPoints: contactCardFirstWithPoints
            ? { ...contactCardFirstWithPoints, image: null }
            : state.contactCardFirstWithPoints,
          ContactCardSecond: ContactCardSecond
            ? { ...ContactCardSecond, image: null }
            : state.ContactCardSecond,
          aboutTeamHeading,
          aboutTeamSubHeading,
          aboutTeamCard:
            aboutTeamCard.length >= 3 ? aboutTeamCard : state.aboutTeamCard,
        });
      }
    }
    setIsLoading(false);
  };

  const handleGoogleUpdate = async (section: string) => {
    setEditLoading((prev) => ({ ...prev, [section]: true }));
    try {
      const response = await EditGoogleMap(mapstate);
      if (response.remote === "success") {
        toast.info("Update successful!");
      } else {
        toast.error("Error updating map upadte");
      }
    } catch (error) {
      console.error("Error updating Magazine content:", error);
    } finally {
      setEditLoading((prev) => ({ ...prev, [section]: false }));
    }
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleGoogleMapUrl = async () => {
    setIsLoading(true);
    try {
      const response = await getGoogleMap();
      if (response.remote === "success" && response.data.data) {
        setMapState(response.data.data as unknown as GoogleMapType);
      }
    } catch (error) {
      console.error("Error getting Google Map:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleSelectedFile = (id: string, file: any) => {
    if (id === "aboutUs") {
      setState({
        ...state,
        aboutUs: { ...state.aboutUs, oldImages: file._id },
      });
    } else if (id === "Card-with-Points") {
      setState({
        ...state,
        contactCardFirstWithPoints: {
          ...state.contactCardFirstWithPoints,
          oldImages: file._id,
        },
      });
    } else if (id === "Card-Second") {
      setState({
        ...state,
        ContactCardSecond: {
          ...state.ContactCardSecond,
          oldImages: file._id,
        },
      });
    } else if (id.includes("about-team")) {
      setState({
        ...state,
        aboutTeamCard: state.aboutTeamCard.map((item: any) =>
          item._id === elementId.split("about-team-")[1]
            ? { ...item, oldImages: file._id }
            : { ...item }
        ),
      });
    }
  };
  useEffect(() => {
    handleGetAllContent();
    handleGoogleMapUrl();
  }, []);

  console.log({ state });

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Contact us content" />
      <form
        onSubmit={(e) => {
          handleUpdate(e, "pageHeading");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item lg={12}>
            <label>Page heading</label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="pageHeadingInGermany"
              onChange={handleChangeForSingleLevelType}
              value={state?.pageHeadingInGermany}
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
          handleUpdate(e, "addressSection");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Address Section" />
          </Grid>
          <Grid item lg={6}>
            <label>Place heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="placeFirstHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.placeFirstHeading}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Place text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="placeFirstText"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.placeFirstText}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Place heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="placeSecondHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.placeSecondHeading}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Place text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="placeSecondText"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.placeSecondText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Telephone Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="telFirstHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.telFirstHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Telephone availability</label>
            <TextField
              fullWidth
              required
              type="text"
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="telFirstTiming"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.telFirstTiming}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Telephone Number</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="telFirstNumber"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.telFirstNumber}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Telephone Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="telSecondHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.telSecondHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Telephone availability</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="telSecondTiming"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.telSecondTiming}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Telephone Number</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="telSecondNumber"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.telSecondNumber}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Email Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="EmailHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.EmailHeading}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Email Address</label>
            <TextField
              fullWidth
              type="email"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="EmailAddress"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.EmailAddress}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Instagram link</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="instagramLink"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.instagramLink}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Youtube link</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              placeholder="Telephone Heading"
              autoComplete="off"
              name="youTubeLink"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "address");
              }}
              value={state?.address.youTubeLink}
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
          handleUpdate(e, "aboutUs");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="About us" />
          </Grid>

          <Grid item lg={4}>
            <label>Top heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="heading"
              autoComplete="off"
              name="topHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "aboutUs");
              }}
              value={state?.aboutUs.topHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="description"
              autoComplete="off"
              name="text"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "aboutUs");
              }}
              value={state?.aboutUs.text}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Side Image</label>
            <TextField
              fullWidth
              type="file"
              placeholder="Enter Heading"
              autoComplete="off"
              name="sideImage"
              id="aboutUs"
              // onChange={(e: any) => {
              //   handleChangeForObjectType(e, "aboutUs");
              // }}
              onClick={(e: any) => {
                setSelectedCardId("aboutUs");
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
                          aboutUs: { ...state.aboutUs, oldImages: null },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.aboutUs?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.aboutUs?.oldImages
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
                handleChangeForObjectType(e, "aboutUs");
              }}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Below heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="description"
              autoComplete="off"
              name="belowHeading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "aboutUs");
              }}
              value={state?.aboutUs.belowHeading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="description"
              autoComplete="off"
              name="buttonText"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "aboutUs");
              }}
              value={state?.aboutUs.buttonText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button url</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              placeholder="description"
              autoComplete="off"
              name="buttonUrl"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "aboutUs");
              }}
              value={state?.aboutUs.buttonUrl}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="outlined-basic"
              placeholder="description"
              autoComplete="off"
              name="buttonColor"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "aboutUs");
              }}
              value={state?.aboutUs.buttonColor}
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
          e.preventDefault();
          handleGoogleUpdate("googlemap");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Google Map" />
          </Grid>
          <Grid item lg={4}>
            <label>Google Map Address</label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              autoComplete="off"
              name="field1"
              onChange={handleChange}
              value={mapstate?.field1}
            />
          </Grid>

          <Grid item lg={4}>
            <label> Map latitude (North)</label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              autoComplete="off"
              name="field4"
              onChange={handleChange}
              value={mapstate?.field4}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Map longitude (East) </label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              autoComplete="off"
              name="field5"
              onChange={handleChange}
              value={mapstate?.field5}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Contact Heading</label>
            <TextField
              fullWidth
              type="text"
              id="outlined-basic"
              autoComplete="off"
              name="field2"
              onChange={handleChange}
              value={mapstate?.field2}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button Background</label>
            <TextField
              fullWidth
              type="color"
              id="outlined-basic"
              autoComplete="off"
              name="field3"
              onChange={handleChange}
              value={mapstate?.field3}
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
          handleUpdate(e, "contactForm");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Contact form content" />
          </Grid>
          <Grid item lg={4}>
            <label>heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "contactForm");
              }}
              value={state?.contactForm.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Contact Address</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="heading"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "contactForm");
              }}
              value={state?.contactForm.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Below description</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="text"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "contactForm");
              }}
              value={state?.contactForm.text}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Button text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              autoComplete="off"
              name="buttonText"
              onChange={(e: any) => {
                handleChangeForObjectType(e, "contactForm");
              }}
              value={state?.contactForm.buttonText}
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
          handleUpdate(e, "counter");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Counter card" />
          </Grid>
          <Grid item xs={12}>
            <label>Counter Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="counterHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.counterHeading}
            />
          </Grid>
          <Grid item xs={12}>
            <Box className="cards-container">
              {state.counters.map((_itm, idx) => (
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
                          handleChangeForArrayType(e as any, idx, "counters")
                        }
                        value={state.counters[idx].heading}
                      />
                    </Grid>
                    <Grid item lg={6}>
                      <label>Count</label>
                      <TextField
                        fullWidth
                        type="text"
                        required
                        id="outlined-basic"
                        placeholder="Enter count"
                        autoComplete="off"
                        name="count"
                        onChange={(e) =>
                          handleChangeForArrayType(e as any, idx, "counters")
                        }
                        value={state.counters[idx].count}
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
          handleUpdate(e, "contactCardFirstWithPoints");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Card with Points" />
          </Grid>
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
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
              }
              value={state.contactCardFirstWithPoints.heading}
            />
          </Grid>

          <Grid item lg={6}>
            <label>text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Description"
              autoComplete="off"
              name="text"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
              }
              value={state.contactCardFirstWithPoints.text}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Point 1st</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="point1"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
              }
              value={state.contactCardFirstWithPoints.point1}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Point 2nd</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="point2"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
              }
              value={state.contactCardFirstWithPoints.point2}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Point 3rd</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="point3"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
              }
              value={state.contactCardFirstWithPoints.point3}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Point 4th</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="point4"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
              }
              value={state.contactCardFirstWithPoints.point4}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Side Image</label>
            <TextField
              fullWidth
              type="file"
              placeholder="Enter Heading"
              autoComplete="off"
              name="image"
              id="Card-with-Points"
              onClick={(e: any) => {
                setSelectedCardId("Card-with-Points");
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
                          contactCardFirstWithPoints: {
                            ...state.contactCardFirstWithPoints,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.contactCardFirstWithPoints?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.contactCardFirstWithPoints?.oldImages
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={(e: any) =>
                handleChangeForObjectType(e, "contactCardFirstWithPoints")
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
          handleUpdate(e, "ContactCardSecond");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Card Second" />
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
              name="heading"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "ContactCardSecond")
              }
              value={state.ContactCardSecond.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="text"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "ContactCardSecond")
              }
              value={state.ContactCardSecond.text}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Side Image</label>
            <TextField
              fullWidth
              type="file"
              placeholder="Enter Heading"
              autoComplete="off"
              name="image"
              id="Card-Second"
              onClick={(e: any) => {
                setSelectedCardId("Card-Second");
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
                          ContactCardSecond: {
                            ...state.ContactCardSecond,
                            oldImages: null,
                          },
                        });
                      }} // Clear image on click
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.ContactCardSecond?.oldImages ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.ContactCardSecond?.oldImages
                          )}
                        />
                      </>
                    ) : (
                      <></>
                    )}
                  </InputAdornment>
                ),
              }}
              onChange={(e: any) =>
                handleChangeForObjectType(e, "ContactCardSecond")
              }
            />
          </Grid>

          <Grid item lg={4}>
            <label>button text</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonText"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "ContactCardSecond")
              }
              value={state.ContactCardSecond.buttonText}
            />
          </Grid>

          <Grid item lg={4}>
            <label>button url</label>
            <TextField
              fullWidth
              type="url"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonUrl"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "ContactCardSecond")
              }
              value={state.ContactCardSecond.buttonUrl}
            />
          </Grid>

          <Grid item lg={4}>
            <label>button color</label>
            <TextField
              fullWidth
              type="color"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="buttonColor"
              onChange={(e: any) =>
                handleChangeForObjectType(e, "ContactCardSecond")
              }
              value={state.ContactCardSecond.buttonColor}
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
          handleUpdate(e, "aboutTeam");
        }}
      >
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="About team" />
          </Grid>
          <Grid item lg={6}>
            <label>Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="aboutTeamHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.aboutTeamHeading}
            />
          </Grid>

          <Grid item lg={6}>
            <label>Sub Heading</label>
            <TextField
              fullWidth
              type="text"
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="aboutTeamSubHeading"
              onChange={handleChangeForSingleLevelType}
              value={state.aboutTeamSubHeading}
            />
          </Grid>

          <Box className="cards-container">
            {state.aboutTeamCard.map((_itm, idx) => (
              <Box className="card-section" key={_itm._id}>
                <Grid container spacing={1}>
                  <Grid item lg={4}>
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
                        handleChangeForArrayType(e as any, idx, "aboutTeamCard")
                      }
                      value={state.aboutTeamCard[idx].heading}
                    />
                  </Grid>

                  <Grid item lg={4}>
                    <label>Sub Heading</label>
                    <TextField
                      fullWidth
                      type="text"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="subHeading"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "aboutTeamCard")
                      }
                      value={state.aboutTeamCard[idx].subHeading}
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
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "aboutTeamCard")
                      }
                      id={`about-team-${_itm._id}`}
                      onClick={(e: any) => {
                        setSelectedCardId(_itm._id);
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
                                  aboutTeamCard: state.aboutTeamCard.map(
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

                  <Grid item lg={4}>
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
                        handleChangeForArrayType(e as any, idx, "aboutTeamCard")
                      }
                      value={state.aboutTeamCard[idx].buttonText}
                    />
                  </Grid>

                  <Grid item lg={4}>
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
                        handleChangeForArrayType(e as any, idx, "aboutTeamCard")
                      }
                      value={state.aboutTeamCard[idx].buttonUrl}
                    />
                  </Grid>

                  <Grid item lg={4}>
                    <label>Button color</label>
                    <TextField
                      fullWidth
                      type="color"
                      required
                      id="outlined-basic"
                      placeholder="Enter Heading"
                      autoComplete="off"
                      name="buttonColor"
                      onChange={(e) =>
                        handleChangeForArrayType(e as any, idx, "aboutTeamCard")
                      }
                      value={state.aboutTeamCard[idx].buttonColor}
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

export default ContactUsPage;
