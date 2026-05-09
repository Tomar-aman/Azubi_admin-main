"use client";
import React, { useEffect, useRef, useState } from "react";
import CustomLoader from "@/app/components/SpinLoader";
import { v4 } from "uuid";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Title from "@/app/components/title.components";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Button,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import {
  EditFAQAccordionContents,
  EditFAQCardsContent,
  EditFAQHeaderContents,
  EditFAQIconSectionContents,
  getAllFAQContent,
} from "@/app/api/manageContent/manageContent";
import TextEditor from "../textEditor/textEditor";
import { Box } from "@mui/system";
import {
  Accordion,
  CardContentI,
} from "@/app/api/manageContent/manageContent.Types";
import "./style.css";
import { cardFactory } from "@/app/ulits/customMethods";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { handleFindImage } from "@/app/ulits/constatnt";

interface AccordionI extends Accordion {
  _id?: string;
}
function FaqContent() {
  const [loading, setIsLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const elementId = useSelector((state: RootState) => state?.user?.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const dispatch = useDispatch();
  const [state, setState] = useState({
    header: {
      heading: "",
      title: "",
      image: null as any,
      oldImage: null as any,
    },
    cards: [
      ...cardFactory(
        {
          title: "",
          link: "",
          image: null,
          _id: v4(),
        },
        4
      ),
    ] as CardContentI[],
    iconSection: {
      heading: "",
      subHeading: "",
      image: null as any,
      oldImage: null as any,
    },
    accordionTitle: "",
    accordion: [
      // ...cardFactory(
      //   {
      //     heading: "",
      //     content: "",
      //     _id: v4(),
      //   },
      //   10
      // ),
    ] as AccordionI[],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState((prevState) => ({
          ...prevState,
          header: { ...prevState.header, [name]: files[0] },
        }));
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      setState((prevState) => ({
        ...prevState,
        header: { ...prevState.header, [name]: value },
      }));
    }
  };
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleChangeIconSection = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState((prevState) => ({
          ...prevState,
          iconSection: { ...prevState.iconSection, [name]: files[0] },
        }));
      } else {
        // Handle multiple file selection (optional logic)
        console.warn("Only handling single file selection for now.");
      }
    } else {
      // Handle text input
      setState((prevState) => ({
        ...prevState,
        iconSection: { ...prevState.iconSection, [name]: value },
      }));
    }
  };

  const handleCardChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { target } = e;
    const { name, value, files } = target;

    if (files) {
      // Handle file input
      if (files.length === 1) {
        setState({
          ...state,
          cards: state.cards.map((card, idx) =>
            index === idx ? { ...card, [name]: files[0] } : card
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
        cards: state.cards.map((card, idx) =>
          index === idx ? { ...card, [name]: value } : card
        ),
      });
    }
  };

  const handleAccordionChange = (
    name: string,
    value: string,
    index: number
  ) => {
    setState({
      ...state,
      accordion: state.accordion.map((acc, idx) =>
        index === idx ? { ...acc, [name]: value } : acc
      ),
    });
  };

  const addCard = () => {
    setState({
      ...state,
      cards: [
        ...state.cards,
        {
          title: "",
          link: "",
          image: null,
          _id: v4(),
        },
      ],
    });
  };

  const addAccordion = () => {
    setState({
      ...state,
      accordion: [
        ...state.accordion,
        {
          heading: "",
          content: "",
          _id: v4(),
        },
      ],
    });
  };
  const deleteAccordion = (_id: any) => {
    setState({
      ...state,
      accordion: state.accordion.filter((item) => item._id !== _id),
    });
  };

  // Array of refs for each file input
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const backgroundImage = useRef<(HTMLInputElement | null)[]>([]);
  const iconImage = useRef<(HTMLInputElement | null)[]>([]);

  // Function to clear the selected file and reset the form field
  const handleClearImage = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = ""; // Clear the file input's value
    }
  };

  const handleAccordionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const { accordionTitle, accordion } = state;
    const response = await EditFAQAccordionContents(
      {
        accordionTitle,
        accordion: accordion.map((acc) => {
          const { _id, ...rest } = acc;
          return { ...rest };
        }),
      },
      "accordion"
    );
    if (response.remote === "success") {
      toast.info("accordion add successfully");
    } else {
      toast.error("failed to update accordion");
    }
    setEditLoading(false);
  };

  const handleIconSectionSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setEditLoading(true);
    const response = await EditFAQIconSectionContents(
      state.iconSection,
      "iconSection"
    );
    if (response.remote === "success") {
      toast.info("Update icon section successfully");
    } else {
      toast.error("failed to update icon section");
    }
    setEditLoading(false);
  };

  const handleHeaderSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const response = await EditFAQHeaderContents(state.header, "header");
    if (response.remote === "success") {
      toast.info("Header updated successfully");
    } else {
      toast.error("failed to update header");
    }
    setEditLoading(false);
  };

  const handleCardsSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEditLoading(true);
    const response = await EditFAQCardsContent(state.cards, "cards");
    if (response.remote === "success") {
      toast.info("Cards updated successfully");
    } else {
      toast.error("failed to update cards");
    }
    setEditLoading(false);
  };

  const fetchAllFAQContent = async () => {
    setIsLoading(true);
    const response = await getAllFAQContent();
    if (response.remote === "success") {
      let finalData: any = {};
      if (response?.data?.data) {
        const { accordion, accordionTitle, iconSection, cards, header } =
          response.data.data;
        if (iconSection) finalData = { iconSection };
        if (header)
          finalData = { ...finalData, header: { ...header, image: null } };
        setState({
          ...state,
          accordionTitle,
          cards:
            cards.length >= 4
              ? cards.map((crd) => ({ ...crd, image: null }))
              : state.cards,
          accordion: accordion,
          ...finalData,
        });
      }
    }
    setIsLoading(false);
  };

  const handleSelectedFile = (id: string, file: any) => {
    if (id === "header-picture") {
      setState((pre) => {
        return {
          ...pre,
          header: {
            ...pre.header,
            oldImage: file._id,
          },
        };
      });
    } else if (id === "Icon") {
      setState((pre) => {
        return {
          ...pre,
          iconSection: {
            ...pre.iconSection,
            oldImage: file._id,
          },
        };
      });
    } else {
      setState((prevState) => {
        return {
          ...prevState,
          cards: prevState.cards.map(
            (card) =>
              card._id === elementId
                ? { ...card, oldImage: file._id } // Update the card with new data
                : card // Keep other cards unchanged
          ),
        };
      });
    }
  };
  useEffect(() => {
    fetchAllFAQContent();
  }, []);

  return (
    <>
      {loading && <CustomLoader />}
      <Title heading="Faq Content" />

      <form onSubmit={handleHeaderSubmit}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Header content" />
          </Grid>

          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="heading"
              onChange={handleChange}
              value={state?.header?.heading}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Title</label>
            <TextField
              required
              fullWidth
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="title"
              onChange={handleChange}
              value={state?.header?.title}
            />
          </Grid>

          <Grid item lg={4}>
            <label>Background Picture</label>
            <TextField
              fullWidth
              type="file"
              name="image"
              id="header-picture"
              onClick={(e) => {
                if (!isOpen) {
                  e.preventDefault();
                }
                handleOpenGalleryModel();
                dispatch(setCurrentElementId("header-picture"));
              }}
              inputRef={(el) => (backgroundImage.current[0] = el)} // Attach the ref to the file input
              onChange={handleChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      // onClick={() => handleClearImage(0)}
                      onClick={() => {
                        backgroundImage.current[0]!.value = "";
                        setState((pre) => {
                          return {
                            ...pre,
                            header: {
                              ...pre.header,
                              oldImage: null,
                            },
                          };
                        });
                      }} // Clear the file input's value
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.header.oldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.header.oldImage
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

          <Grid item lg={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form onSubmit={handleCardsSubmit}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Faq Content" />
          </Grid>

          <Grid item lg={12}>
            <Box className="cards-container">
              {state.cards.map((card: any, idx) => (
                <Box className="card-section" key={card._id}>
                  <Grid container spacing={1}>
                    <Grid item lg={4}>
                      <label>Title</label>
                      <TextField
                        id={card._id}
                        fullWidth
                        required
                        // id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name={`title`}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleCardChange(e, idx);
                        }}
                        value={card.title}
                      />
                    </Grid>
                    <Grid item lg={4}>
                      {" "}
                      <label>Url</label>
                      <TextField
                        fullWidth
                        type="url"
                        required
                        id="outlined-basic"
                        placeholder="Enter Heading"
                        autoComplete="off"
                        name="link"
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                          handleCardChange(e, idx);
                        }}
                        value={card.link}
                      />
                    </Grid>

                    <Grid item lg={4}>
                      {" "}
                      <label>Image</label>
                      <TextField
                        fullWidth
                        type="file"
                        name="image"
                        id={`card-details-${card._id}`}
                        inputRef={(el) => (fileInputRefs.current[idx] = el)} // Attach the ref to the file input
                        onChange={(e) =>
                          handleCardChange(
                            e as React.ChangeEvent<HTMLInputElement>,
                            idx
                          )
                        }
                        onClick={(e) => {
                          if (!isOpen) {
                            e.preventDefault();
                          }
                          handleOpenGalleryModel();
                          console.log("Current card ID:", card._id);
                          if (card._id) {
                            dispatch(setCurrentElementId(`card-details-${card._id}`));
                          }
                        }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => {
                                  setState((prevState: any) => {
                                    return {
                                      ...prevState,
                                      cards: prevState.cards.map(
                                        (itm: any) =>
                                          itm._id === card._id
                                            ? { ...itm, oldImage: null } // Update the card with new data
                                            : itm // Keep other cards unchanged
                                      ),
                                    };
                                  });
                                  if (!card.oldImage) {
                                    handleClearImage(idx);
                                  }
                                }}
                                edge="end"
                                aria-label="Clear"
                              >
                                <ClearIcon />
                              </IconButton>
                              {card.oldImage ? (
                                <>
                                  <img
                                    height={30}
                                    width={40}
                                    src={handleFindImage(
                                      mediaUrls,
                                      card.oldImage
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
          </Grid>

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
          </Grid>
        </Grid>
      </form>

      <form onSubmit={handleIconSectionSubmit}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Icon Content" />
          </Grid>

          <Grid item lg={4}>
            <label>Heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="heading"
              onChange={handleChangeIconSection}
              value={state?.iconSection?.heading}
            />
          </Grid>
          <Grid item lg={4}>
            {" "}
            <label>Sub heading</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              name="subHeading"
              onChange={handleChangeIconSection}
              value={state?.iconSection?.subHeading}
            />
          </Grid>
          <Grid item lg={4}>
            {" "}
            <label>Icon</label>
            <TextField
              fullWidth
              type="file"
              name="image"
              id="Icon"
              onClick={(e) => {
                if (!isOpen) {
                  e.preventDefault();
                }
                handleOpenGalleryModel();
                dispatch(setCurrentElementId("Icon"));
              }}
              inputRef={(el) => (iconImage.current[state.cards.length] = el)} // Attach the ref to the file input
              onChange={handleChangeIconSection}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        iconImage.current[state.cards.length]!.value = "";
                        setState((pre) => {
                          return {
                            ...pre,
                            iconSection: {
                              ...pre.iconSection,
                              oldImage: null,
                            },
                          };
                        });
                      }} // Clear the file input's value
                      edge="end"
                      aria-label="Clear"
                    >
                      <ClearIcon />
                    </IconButton>
                    {state.iconSection.oldImage ? (
                      <>
                        <img
                          height={30}
                          width={40}
                          src={handleFindImage(
                            mediaUrls,
                            state.iconSection.oldImage
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

      <form onSubmit={handleAccordionSubmit}>
        <Grid container spacing={1} className="section-border">
          <Grid item xs={12}>
            <Title heading="Accordion Section" />
          </Grid>
          <Grid item xs={12}>
            <label>Accordion Title</label>
            <TextField
              fullWidth
              required
              id="outlined-basic"
              placeholder="Enter Heading"
              autoComplete="off"
              onChange={(e) => {
                setState({ ...state, accordionTitle: e.target.value });
              }}
              value={state.accordionTitle}
            />
          </Grid>

          {state.accordion.map((acc, idx) => (
            <>
              <Grid item lg={6}>
                <label>heading</label>
                <TextField
                  fullWidth
                  required
                  id="outlined-basic"
                  placeholder="Enter Heading"
                  autoComplete="off"
                  name="heading"
                  onChange={(e) => {
                    handleAccordionChange(e.target.name, e.target.value, idx);
                  }}
                  value={acc.heading}
                />
              </Grid>
              <Grid item lg={6}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box>
                    <label>content</label>
                    <TextEditor
                      content={acc.content}
                      setContent={(data) => {
                        handleAccordionChange("content", data, idx);
                      }}
                    />
                  </Box>
                  <Button
                    onClick={() => {
                      deleteAccordion(acc._id);
                    }}
                  >
                    delete
                  </Button>
                </Box>
              </Grid>
            </>
          ))}

          <Grid item xs={12}>
            <Button type="submit">
              {editLoading ? "Update..." : "Update"}
            </Button>
            <Button onClick={addAccordion}>Add</Button>
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

export default FaqContent;
