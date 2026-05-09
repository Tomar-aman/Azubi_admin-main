"use client";
import {
  editHomeContentApi,
  fetchHomeContentApi,
} from "@/app/api/manageContent/manageContent";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import {
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { useFormik } from "formik";
import { MuiColorInput } from "mui-color-input";
import React, { useEffect, useRef, useState } from "react";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import ClearIcon from "@mui/icons-material/Clear";
import { RootState } from "@/app/redux/store";
import { useDispatch, useSelector } from "react-redux";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { getAllImageGallery } from "@/app/api/iamge-gallery/imagegallery";
import { ImagesGallery } from "@/app/api/training/jobTypes.types";
import { handleFindImage } from "@/app/ulits/constatnt";
interface Tip {
  image: any;
  url: string;
}
export interface HomePageContent {
  bannerCustomColor: string;
  galleryCustomColor: string;
  blockCustomColor: string;
  companyCustomColor: string;
  tips: Tip[];
  mailChimpLogo: any;
  oldtips_3: any;
  oldtips_2: any;
  oldtips_1: any;
  oldMailChimpLogo: any;
}
export default function HomePage() {
  const formik = useFormik<HomePageContent>({
    initialValues: {
      bannerCustomColor: "",
      galleryCustomColor: "",
      blockCustomColor: "",
      companyCustomColor: "",
      oldtips_3: "",
      oldtips_2: "",
      oldtips_1: "",
      oldMailChimpLogo: "",
      tips: [
        { image: null, url: "" },
        { image: null, url: "" },
        { image: null, url: "" },
      ],
      mailChimpLogo: null,
    },
    onSubmit: async (value) => {
      const response = await editHomeContentApi(value);
      if (response.remote === "success") {
        toast.info("update successfully!");
      } else {
        toast.error("failed to update");
      }
    },
  });
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state?.user?.elementId);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const [isOpen, setIsOpen] = useState(false);
  // Array of refs for each file input
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Function to clear the selected file and reset the form field
  const handleClearImage = (index: number) => {
    if (fileInputRefs.current[index]) {
      fileInputRefs.current[index]!.value = ""; // Clear the file input's value
    }
    formik.setFieldValue(`tips[${index}].image`, null); // Clear formik field
  };

  const fetchHomeContent = async () => {
    const response = await fetchHomeContentApi();
    if (response.remote === "success") {
      formik.setFieldValue("tips[0].url", response.data.data.tips_url_1);
      formik.setFieldValue("tips[1].url", response.data.data.tips_url_2);
      formik.setFieldValue("tips[2].url", response.data.data.tips_url_3);
      formik.setFieldValue(
        "bannerCustomColor",
        response.data.data.bannerCustomColor
      );
      formik.setFieldValue(
        "galleryCustomColor",
        response.data.data.galleryCustomColor
      );
      formik.setFieldValue(
        "blockCustomColor",
        response.data.data.blockCustomColor
      );
      formik.setFieldValue(
        "companyCustomColor",
        response.data.data.companyCustomColor
      );
    }
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const handleSelectedFile = (id: string, file: any) => {
    handleClose();
    const element = document.getElementById(id);
    if (formik.values.hasOwnProperty(id)) {
      console.log(
        "first ,formik.values.hasOwnProperty(id)",
        formik.values.hasOwnProperty(id)
      );
      formik.setFieldValue(id, file._id);
    }
    console.log({ file });
  };
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };

  useEffect(() => {
    fetchHomeContent();
  }, []);

  useEffect(() => {
    console.log({ hello: formik.values });
  }, [formik.values]);
  return (
    <>
      <Grid container spacing={2}>
        <Grid xs={12} lg={6} item>
          <Title heading="Banner custom color" />
          <Card elevation={0} sx={{ borderRadius: "10px", mt: 2 }}>
            <MuiColorInput
              fullWidth
              format="hex"
              value={formik.values.bannerCustomColor}
              onChange={(color) => {
                formik.setFieldValue("bannerCustomColor", color);
              }}
            />
          </Card>
        </Grid>
        <Grid xs={12} lg={6} item>
          <Title heading="Gallery custom color" />
          <Card elevation={0} sx={{ borderRadius: "10px", mt: 2 }}>
            <MuiColorInput
              fullWidth
              format="hex"
              value={formik.values.galleryCustomColor}
              onChange={(color) => {
                formik.setFieldValue("galleryCustomColor", color);
              }}
            />
          </Card>
        </Grid>
        <Grid xs={12} lg={6} item>
          <Title heading="Blocks custom color" />
          <Card elevation={0} sx={{ borderRadius: "10px", mt: 2 }}>
            <MuiColorInput
              format="hex"
              fullWidth
              value={formik.values.blockCustomColor}
              onChange={(color) => {
                formik.setFieldValue("blockCustomColor", color);
              }}
            />
          </Card>
        </Grid>
        <Grid xs={12} lg={6} item>
          <Title heading="Company custom color" />
          <Card elevation={0} sx={{ borderRadius: "10px", mt: 2 }}>
            <MuiColorInput
              fullWidth
              format="hex"
              value={formik.values.companyCustomColor}
              onChange={(color) => {
                formik.setFieldValue("companyCustomColor", color);
              }}
            />
          </Card>
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Card elevation={0} sx={{ border: "1px solid #ccc" }}>
          <CardContent>
            <Title heading="Tipps & Anleitungen" />
            <Grid container spacing={2}>
              <Grid xs={12} lg={6} item>
                <TextField
                  placeholder="Url"
                  type="text"
                  fullWidth
                  name="tips[0].url"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tips[0].url}
                />
              </Grid>

              <Grid xs={12} lg={6} item>
                <TextField
                  placeholder="576557"
                  type="file"
                  fullWidth
                  name="tips[0].image"
                  id="oldtips_1"
                  onClick={(e: any) => {
                    const id = e.target.id;
                    formik.setFieldValue(id, null);
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(e.target.id));
                  }}
                  inputRef={(el) => (fileInputRefs.current[0] = el)} // Attach the ref to the file input
                  onChange={(e: any) => {
                    const id = e.target.id;
                    formik.setFieldValue(id, null);
                    formik.setFieldValue(
                      "tips[0].image",
                      e.target.files![0] || null
                    );
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearImage(0);
                            formik.setFieldValue("oldtips_1", null);
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {formik.values.oldtips_1 ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(
                                mediaUrls,
                                formik.values.oldtips_1
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

              <Grid xs={12} lg={6} item>
                <TextField
                  placeholder="Url"
                  type="text"
                  fullWidth
                  name="tips[1].url"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tips[1].url}
                />
              </Grid>

              <Grid xs={12} lg={6} item>
                <TextField
                  placeholder="576557"
                  type="file"
                  fullWidth
                  name="tips[1].image"
                  id="oldtips_2"
                  onClick={(e: any) => {
                    e.stopPropagation();
                    const id = e.target.id;
                    formik.setFieldValue(id, null);
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(e.target.id));
                  }}
                  inputRef={(el) => (fileInputRefs.current[1] = el)} // Attach the ref to the file input
                  onChange={(e: any) => {
                    formik.setFieldValue(
                      "tips[1].image",
                      e.target.files![0] || null
                    );
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            handleClearImage(1);
                            e.stopPropagation();
                            formik.setFieldValue("oldtips_2", null);
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {formik.values.oldtips_2 ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(
                                mediaUrls,
                                formik.values.oldtips_2
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

              <Grid xs={12} lg={6} item>
                <TextField
                  placeholder="Url"
                  type="text"
                  fullWidth
                  name="tips[2].url"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.tips[2].url}
                />
              </Grid>

              <Grid xs={12} lg={6} item>
                <TextField
                  type="file"
                  fullWidth
                  name="tips[2].image"
                  inputRef={(el) => (fileInputRefs.current[2] = el)} // Attach the ref to the file input
                  onChange={(e: any) => {
                    formik.setFieldValue(
                      "tips[2].image",
                      e.target.files![0] || null
                    );
                  }}
                  id="oldtips_3"
                  onClick={(e: any) => {
                    const id = e.target.id;
                    formik.setFieldValue(id, null);
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(e.target.id));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClearImage(2);
                            formik.setFieldValue("oldtips_3", null);
                          }} // Clear image on click
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {formik.values.oldtips_3 ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(
                                mediaUrls,
                                formik.values.oldtips_3
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
          </CardContent>
        </Card>
      </Box>

      <Box sx={{ mt: 3 }}>
        <Card elevation={0} sx={{ border: "1px solid #ccc" }}>
          <CardContent>
            <Title heading="Mail chimp logo" />
            <Grid container spacing={2}>
              <Grid xs={12} lg={12} item>
                <TextField
                  type="file"
                  fullWidth
                  name="mailChimpLogo"
                  inputRef={(el) => (fileInputRefs.current[3] = el)} // Attach the ref to the file input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    formik.setFieldValue(
                      "mailChimpLogo",
                      e.target.files![0] || null
                    );
                  }}
                  id="oldMailChimpLogo"
                  onClick={(e: any) => {
                    const id = e.target.id;
                    formik.setFieldValue(id, null);
                    if (!isOpen) {
                      e.preventDefault();
                    }
                    handleOpenGalleryModel();
                    dispatch(setCurrentElementId(e.target.id));
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            if (fileInputRefs.current[3]) {
                              fileInputRefs.current[3]!.value = ""; // Clear the file input's value
                            }
                            formik.setFieldValue("mailChimpLogo", null); // Clear Formik field
                            formik.setFieldValue("oldMailChimpLogo", null);
                          }}
                          edge="end"
                          aria-label="Clear"
                        >
                          <ClearIcon />
                        </IconButton>
                        {formik.values.oldMailChimpLogo ? (
                          <>
                            <img
                              height={30}
                              width={40}
                              src={handleFindImage(
                                mediaUrls,
                                formik.values.oldMailChimpLogo
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
          </CardContent>
        </Card>
      </Box>

      <Grid item xs={12} sx={{ marginTop: 2 }}>
        <Box sx={{ textAlign: "right" }}>
          <Button
            // variant="outlined"
            className="modalBtn"
            sx={{ fontSize: "24px", fontWeight: 700 }}
            onClick={() => formik.handleSubmit()}
          >
            <SVG.Save className="svgIcon" style={{ marginRight: "15px" }} />{" "}
            <span>Save</span>
          </Button>
        </Box>
      </Grid>

      {/* ==============dynamic content form ==================*/}

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
