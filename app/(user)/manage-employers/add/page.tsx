"use client";
import React, { useEffect, useState } from "react";

import { FormHelperText, 
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import { useRouter } from "next/navigation";
import { StyledManageForm } from "@/app/components/form.styled";
import { EmployerFormType } from "@/app/api/employer/employer.types";
import {
  addEmployer,
  getEmployerById,
  updateEmployerById,
} from "@/app/api/employer/employer";
import { TransformCity } from "@/app/api/city/city.types";
import { getCity } from "@/app/api/city/city";
import { TransformIndustry } from "@/app/api/industries/industries.types";
import { getIndustries } from "@/app/api/industries/industries";
import CustomLoader from "@/app/components/SpinLoader";
import ErrorAlert from "@/themes/overrides/errorAlert";
import { useFormik } from "formik";
import * as Yup from "yup";
import TextEditor from "../../manage-content/textEditor/textEditor";
import Cropper, { FileState } from "@/app/ulits/cropper";
import { AdditionalData } from "..";
import { v4 } from "uuid";
import dynamic from "next/dynamic";
import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { handleFindImage } from "@/app/ulits/constatnt";
import ClearIcon from "@mui/icons-material/Clear";
const TextEditorNew = dynamic(
  () => import("../../manage-content/text-editor-new/textEditorNew"),
  { ssr: false }
);
const getEmbedUrl = (url: string) => {
  if (!url) return "";
  if (url.includes("youtube.com/embed/")) {
    return url;
  }
  let videoId = "";
  try {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
  } catch (e) {
    console.error("Error parsing youtube url", e);
  }
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

const AddComponent = () => {
  const re =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
  const route = useRouter();
  const [disable, setIsDisable] = useState(false);
  const [id, setId] = useState("");
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [oldFile, setOldFile] = useState<string[]>([]);
  const [companyLogoPath, setCompanyLogoPath] = useState<FileState[]>([]);
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const validationSchema = Yup.object({
    industryName: Yup.object().test(
      "isImage",
      "invalid industry",
      (value: any) => {
        if (value.id && value.label) {
          return true;
        }
        return false;
      }
    ),
    contactPerson: Yup.string(),
    jobTitle: Yup.string(),
    companyName: Yup.string().required("company name  is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    website: Yup.string()
      // .matches(re, "URL is not valid")
      .required("website  is required"),
    phoneNo: Yup.string().notRequired(),
    // phoneNo: Yup.string()
    //    .required("phone number  is required"),
    // .matches(
    //   /^(\+49|0)[1-9]\d{1,14}$/,
    //   "Invalid phone number, must start with +49 or 0"
    // ),
    address: Yup.string().required("address is required"),
    zipCode: Yup.string().notRequired(),
    city: Yup.object().test("isCity", "city is required", (value: any) => {
      if (value.id && value.label) {
        return true;
      }
      return false;
    }),
    companyLogo: Yup.mixed().notRequired(),
    companyDescription: Yup.string().required(
      "company Description is required"
    ),
    // locationUrl: Yup.string().notRequired(
    //   "LocationUrl is required"
    // ),
    videoLink: Yup.array().of(Yup.string().matches(re, "URL is not valid")),
    oldCompanyLogo: Yup.string(),
    oldCompanyImages: Yup.array(),
  });
  const formik = useFormik<EmployerFormType>({
    initialValues: {
      industryName: { id: "", label: "Select industry" },
      contactPerson: "",
      jobTitle: "",
      companyName: "",
      email: "",
      website: "",
      mapUrl: "",
      phoneNo: "",
      address: "",
      zipCode: "",
      city: { id: "", label: "Select City" },
      companyLogo: null,
      companyDescription: "",
      videoLink: [""],
      locationUrl: "",
      oldCompanyLogo: "",
      oldCompanyImages: [],
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      console.log("second");
      setIsDisable(true);
      // Filter out existing images, only send new File objects
      values.companyImages = fileList
        .filter((item: any) => item.originFileObj)
        .map((item: any) => item.originFileObj);

      values.removedFile = oldFile.filter((item) => item && item !== "undefined");

      const logo = (values as any).companyLogo;
      if (!logo || logo === "" || (Array.isArray(logo) && logo.length === 0)) {
        delete (values as any).companyLogo;
      }
      try {
        setIsLoading(true);
        if (id) {
          const data = await updateEmployerById(
            id,
            values,
            state.iconWithContent
          );
          if (data.remote === "success") {
            route.push("/manage-employers");
          } else {
            const backendError = Object.values(data.error.errors.data);
            setError(
              extractErrorMessage(backendError) || "Something went wrong"
            );
          }
        } else {
          const response = await addEmployer(values, state.iconWithContent);
          if (response.remote === "success") {
            route.push("/manage-employers");
          } else {
            const backendError = Object.values(response.error.errors.data);
            setError(
              extractErrorMessage(backendError) || "Something went wrong"
            );
          }
        }
        setIsLoading(false);
      } catch (error) {
        console.log({ error });
        setIsLoading(false);
      }
      setIsDisable(false);
    },
  });
  const [city, setCity] = useState<TransformCity[]>([]);
  const [industries, setIndustries] = useState<TransformIndustry[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  /* implement additional field */
  const [state, setState] = useState<AdditionalData>({
    iconWithContent: [],
  });

  function addAdditionData() {
    setState({
      ...state,
      iconWithContent: [
        ...state.iconWithContent,
        { _id: v4(), image: null, text: "" },
      ],
    });
  }

  function deleteAdditionData(id: string) {
    setState({
      ...state,
      iconWithContent: state.iconWithContent.filter((item) => item._id !== id),
    });
  }

  const handleChangeForArrayType = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    targetState: keyof AdditionalData
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

  function extractErrorMessage(errorArray: any) {
    if (Array.isArray(errorArray) && errorArray.length > 0) {
      return errorArray.join(", ");
    }
    return false;
  }

  const addSkill = () => {
    formik.setValues({
      ...formik.values,
      videoLink: [...formik.values.videoLink, ""],
    });
  };
  const removeSkill = (index: number) => {
    const updatedLink = [...formik.values.videoLink];
    updatedLink.splice(index, 1);
    formik.setValues({ ...formik.values, videoLink: updatedLink });
  };

  const handleSkillChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedLink = [...formik.values.videoLink];
    updatedLink[index] = event.target.value;
    formik.setValues({ ...formik.values, videoLink: updatedLink });
  };
  const getAllCity = async () => {
    const data = await getCity();
    if (data.remote === "success") {
      setCity(data.data.data);
    }
  };
  const getAllIndustries = async () => {
    const data = await getIndustries();
    if (data.remote === "success") {
      setIndustries(data.data.data);
    }
  };

  const getEmployerDetailByID = async (id: string) => {
    setIsLoading(true);
    const response: any = await getEmployerById(id);
    if (response.remote === "success") {
      setCompanyLogoPath([
        {
          name: "",
          uid: "1",
          url:
            process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL +
            response?.data?.data?.companyImagePath,
        },
      ]);
      const newImage = response?.data?.data?.companyImages?.map(
        (item: { imageId: string; path: string }, index: number) => {
          return {
            name: item.path,
            uid: item.imageId,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + item.path,
          };
        }
      );
      setFileList(newImage);
      // console.log(response?.data?.data?.additionalData);
      setState({
        ...state,
        iconWithContent:
          response?.data?.data?.additionalData?.map((itm: any) => ({
            ...itm,
            image: null,
          })) || [],
      });
      console.log("response.data.data", response.data.data);
      formik.setFieldValue("industryName", response.data.data.industryName);
      formik.setFieldValue("contactPerson", response.data.data.contactPerson);
      formik.setFieldValue("jobTitle", response.data.data.jobTitle);
      formik.setFieldValue("locationUrl", response.data.data.locationUrl);
      formik.setFieldValue("companyName", response.data.data.companyName);
      formik.setFieldValue("email", response.data.data.email);
      formik.setFieldValue("website", response.data.data.website);
      formik.setFieldValue("mapUrl", response.data.data.mapUrl);
      formik.setFieldValue("phoneNo", response.data.data.phoneNo);
      formik.setFieldValue("address", response.data.data.address);
      formik.setFieldValue("zipCode", response.data.data.zipCode);
      formik.setFieldValue(
        "city",
        response.data.data.city ? response.data.data.city : ""
      );
      formik.setFieldValue("companyLogo", response.data.data.companyLogo);
      formik.setFieldValue(
        "companyDescription",
        response.data.data.companyDescription
      );
      formik.setFieldValue("videoLink", response.data.data.videoLink);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    getAllCity();
    getAllIndustries();
  }, []);
  useEffect(() => {
    console.log({ helll: formik.values, formik });
  }, [formik.values, formik]);
  useEffect(() => {
    // Get query parameters from the URL
    const urlSearchParams = new URLSearchParams(window.location.search);
    const employerId = urlSearchParams.get("id");
    const newEmployer = urlSearchParams.get("new");
    if (newEmployer) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
    if (employerId) {
      setId(employerId);
      getEmployerDetailByID(employerId);
    }
  }, []);
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000); // 5000 milliseconds = 5 seconds

      // Clear the timeout if the component unmounts before the 5 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [error]);
  return (
    <>
      {loading && (
        <Box
          sx={{
            position: "fixed",
            left: 0,
            top: 0,
            right: 0,
            bottom: 0,
            zIndex: 10,
          }}
        >
          <CustomLoader />
        </Box>
      )}

      {error && <ErrorAlert severity="error" message={error} />}
      <Title
        heading={"Add Employer"}
        icon={
          <IconButton
            onClick={() => route.push("/manage-employers")}
            disableRipple={true}
          >
            <SVG.ArrowBack className="svgActive" />
          </IconButton>
        }
      />
      <Card sx={{ borderRadius: "10px" }} elevation={0}>
        <CardContent>
          <StyledManageForm>
            <Grid container spacing={2}>
              <Grid item xs={12} lg={2}>
                <label>Industry</label>
              </Grid>
              <Grid
                item
                xs={12}
                lg={10}
                sx={{
                  "& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input":
                    {
                      padding: "0px",
                    },
                }}
              >
                <Autocomplete
                  disablePortal
                  disabled={disable}
                  disableClearable={true}
                  fullWidth
                  id="combo-box-demo"
                  value={formik.values.industryName}
                  options={industries?.map((item) => {
                    return { id: item.id, label: item.name };
                  })}
                  onChange={(e, value: any) => {
                    if (value) {
                      formik.values.industryName.id = value.id;
                      formik.values.industryName.label = value.label;
                    }
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="" 
                      error={formik.touched.industryName && Boolean(formik.errors.industryName)}
                      helperText={formik.touched.industryName && (formik.errors.industryName as string)}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Contact Person</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Name of contact person"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="contactPerson"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.contactPerson}

                  error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}

                  helperText={formik.touched.contactPerson && (formik.errors.contactPerson as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Job Title</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Title of Job"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="jobTitle"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.jobTitle}

                  error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}

                  helperText={formik.touched.jobTitle && (formik.errors.jobTitle as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Company Name</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Organization Name or Company Name"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="companyName"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.companyName}

                  error={formik.touched.companyName && Boolean(formik.errors.companyName)}

                  helperText={formik.touched.companyName && (formik.errors.companyName as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Email</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="example@example.com"
                  disabled={disable}
                  type="email"
                  fullWidth
                  sx={{
                    "& .MuiFormHelperText-root": {
                      marginLeft: "5px",
                      color: "#FFA500",
                      fontWeight: "500",
                    },
                  }}
                  name="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}

                  error={formik.touched.email && Boolean(formik.errors.email)}

                  helperText={formik.touched.email && (formik.errors.email as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Website</label>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  placeholder="e.g, www.domain.com"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="website"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.website}

                  error={formik.touched.website && Boolean(formik.errors.website)}

                  helperText={formik.touched.website && (formik.errors.website as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Map Url</label>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  placeholder="e.g, www.domain.com"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="mapUrl"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.mapUrl}

                  error={formik.touched.mapUrl && Boolean(formik.errors.mapUrl)}

                  helperText={formik.touched.mapUrl && (formik.errors.mapUrl as string)}

                />
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>Location Url</label>
              </Grid>
              <Grid item xs={10}>
                <TextField
                  placeholder="e.g, www.domain.com"
                  type="text"
                  fullWidth
                  name="locationUrl"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.locationUrl}

                  error={formik.touched.locationUrl && Boolean(formik.errors.locationUrl)}

                  helperText={formik.touched.locationUrl && (formik.errors.locationUrl as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Phone No.</label>
              </Grid>
              <Grid item xs={10}>
                {/* Free-text phone field: special characters (| \ - etc.) allowed. */}
                <TextField
                  type="text"
                  fullWidth
                  disabled={disable}
                  placeholder="Enter phone number"
                  name="phoneNo"
                  value={formik.values.phoneNo}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phoneNo && Boolean(formik.errors.phoneNo)}
                  helperText={formik.touched.phoneNo && (formik.errors.phoneNo as string)}
                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Address</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder=""
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="address"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.address}

                  error={formik.touched.address && Boolean(formik.errors.address)}

                  helperText={formik.touched.address && (formik.errors.address as string)}

                />
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Zip Code</label>
              </Grid>
              <Grid item xs={12} lg={4.67}>
                <TextField
                  placeholder="474010"
                  disabled={disable}
                  type="number"
                  fullWidth
                  name="zipCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.zipCode}

                  error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}

                  helperText={formik.touched.zipCode && (formik.errors.zipCode as string)}

                />
              </Grid>

              <Grid item xs={12} lg="auto">
                <label>City</label>
              </Grid>
              <Grid
                item
                xs={12}
                lg={4.67}
                sx={{
                  "& .MuiAutocomplete-root .MuiOutlinedInput-root .MuiAutocomplete-input":
                    {
                      padding: "0px",
                    },
                }}
              >
                <Autocomplete
                  disablePortal
                  disableClearable={true}
                  disabled={disable}
                  fullWidth
                  id="combo-box-demo"
                  value={formik.values.city}
                  options={city?.map((item) => {
                    return { id: item.id, label: item.name };
                  })}
                  onChange={(e, value: any) => {
                    if (value) {
                      formik.setFieldValue("city", value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="" 
                      error={formik.touched.city && Boolean(formik.errors.city)}
                      helperText={formik.touched.city && (formik.errors.city as string)}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>Company Logo</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <Cropper
                  id="companyLogo"
                  fileList={companyLogoPath || []}
                  setFileList={(newFileList: any) => {
                    setCompanyLogoPath(newFileList);
                    if (newFileList[0]?.originFileObj) {
                      formik.setFieldValue(
                        "companyLogo",
                        newFileList[0]?.originFileObj
                      );
                    } else {
                      formik.setFieldValue("companyLogo", null);
                    }
                  }}
                  setOldFile={(data) => console.log("Old file:", data)}
                  disabled={disable}
                  maxCount={1}
                  isA4={false}
                  aspect={1}
                />
                {formik.touched.companyLogo && Boolean(formik.errors.companyLogo) && (
                  <FormHelperText error sx={{ ml: 1, mt: 0 }}>CompanyLogo is Required</FormHelperText>
                )}
              </Grid>

              <Grid item xs={2} sx={{ minHeight: "160px" }}>
                <label>Company Description</label>
              </Grid>
              <Grid item xs={10}>
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
                    "& .ql-container.ql-snow": {
                      height: "230px",
                    },
                  }}
                >
                  {/* <TextEditor
                    disabled={disable}
                    content={`${formik.values.companyDescription}`}
                    setContent={(txt) => {
                      formik.setFieldValue("companyDescription", txt);
                    }}
                  /> */}

                  <TextEditorNew
                    disabled={disable}
                    content={`${formik.values.companyDescription}`}
                    setContent={(txt) => {
                      formik.setFieldValue("companyDescription", txt);
                    }}
                  />
                </Box>
                {formik.touched.companyDescription && Boolean(formik.errors.companyDescription) && (
                  <FormHelperText error sx={{ ml: 1, mt: 0 }}>{formik.errors.companyDescription as string}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={2} sx={{ minHeight: "160px" }}>
                <label>Company Images</label>
              </Grid>
              <Grid item xs={10}>
                <Cropper
                  id="oldCompanyImages"
                  disabled={disable}
                  fileList={fileList}
                  setFileList={setFileList}
                  setOldFile={setOldFile}
                  aspect={1}
                />
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>YouTube links</label>
              </Grid>
              <Grid item xs={10}>
                {formik.values.videoLink.map((link, index) => (
                  <Box key={index} sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: "8px", bgcolor: "#fafafa" }}>
                    <TextField
                      disabled={disable}
                      placeholder="Embed youtube video link"
                      type="text"
                      fullWidth
                      name={`videoLink[${index}]`}
                      onChange={(event: any) => handleSkillChange(index, event)}
                      value={link}
                      sx={{ bgcolor: "#fff" }}
                    />
                    {formik.errors.videoLink && Boolean(formik.errors.videoLink[index]) && (
                      <FormHelperText error sx={{ ml: 1, mt: 0 }}>{formik.errors.videoLink[index] as string}</FormHelperText>
                    )}
                    {link && (
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <iframe
                          title="Preview"
                          width="300"
                          height="168"
                          src={getEmbedUrl(link)}
                          style={{ border: "none", borderRadius: "4px" }}
                        ></iframe>
                      </Box>
                    )}
                    <Box sx={{ mt: 1, textAlign: "right" }}>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removeSkill(index)}
                        disabled={disable}
                        sx={{ textTransform: "none" }}
                      >
                        Remove Link
                      </Button>
                    </Box>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  size="small"
                  onClick={addSkill}
                  disabled={disable}
                  sx={{ textTransform: "none", borderColor: "#1FA49A", color: "#1FA49A" }}
                >
                  + Add YouTube Link
                </Button>
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>Additional info</label>
              </Grid>
              <Grid item xs={10}>
                {state.iconWithContent.map((itm: any, idx) => (
                  <Box key={itm._id} sx={{ mb: 3, p: 2, border: "1px solid #eee", borderRadius: "8px", bgcolor: "#fafafa" }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} sm={4}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          {itm.oldImage || itm.image ? (
                            <Box
                              component="img"
                              src={itm.image ? URL.createObjectURL(itm.image) : handleFindImage(mediaUrls, itm.oldImage)}
                              sx={{
                                width: 60,
                                height: 60,
                                objectFit: "cover",
                                borderRadius: "4px",
                                border: "1px solid #ddd"
                              }}
                            />
                          ) : (
                            <Box
                              sx={{
                                width: 60,
                                height: 60,
                                bgcolor: "#fff",
                                borderRadius: "4px",
                                border: "1px dashed #ccc",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#999",
                                fontSize: "10px",
                                textAlign: "center"
                              }}
                            >
                              Icon
                            </Box>
                          )}
                          <Button
                            variant="outlined"
                            component="label"
                            size="small"
                            disabled={disable}
                            sx={{ textTransform: "none", borderColor: "#1FA49A", color: "#1FA49A", minWidth: "80px" }}
                          >
                            {itm.oldImage || itm.image ? "Change" : "Upload"}
                            <input
                              type="file"
                              hidden
                              name="image"
                              onChange={(e) => {
                                handleChangeForArrayType(
                                  e as any,
                                  idx,
                                  "iconWithContent"
                                );
                              }}
                            />
                          </Button>
                          {(itm.oldImage || itm.image) && (
                            <IconButton
                              size="small"
                              onClick={() => {
                                setState({
                                  ...state,
                                  iconWithContent: state.iconWithContent.map((item: any, index) =>
                                    index === idx
                                      ? { ...item, image: null, oldImage: null }
                                      : { ...item }
                                  ),
                                });
                              }}
                            >
                              <ClearIcon fontSize="small" color="error" />
                            </IconButton>
                          )}
                        </Box>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          placeholder="Label or text"
                          disabled={disable}
                          type="text"
                          fullWidth
                          name="text"
                          onChange={(e) => {
                            handleChangeForArrayType(
                              e as any,
                              idx,
                              "iconWithContent"
                            );
                          }}
                          value={state.iconWithContent[idx].text}
                          sx={{ bgcolor: "#fff" }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={2} sx={{ textAlign: "right" }}>
                        <IconButton
                          color="error"
                          onClick={() => deleteAdditionData(itm._id)}
                          disabled={disable}
                        >
                          <SVG.Delete />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                ))}

                <Button
                  variant="outlined"
                  size="small"
                  onClick={addAdditionData}
                  disabled={disable}
                  sx={{ textTransform: "none", borderColor: "#1FA49A", color: "#1FA49A" }}
                >
                  + Add Additional Info
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ textAlign: "right" }}>
                  <Button
                    // variant="outlined"
                    className="modalBtn"
                    disabled={disable}
                    onClick={() => {
                      console.log("first");
                      formik.handleSubmit();
                    }}
                    sx={{ fontSize: "24px", fontWeight: 700 }}
                  >
                    <SVG.Save
                      className="svgIcon"
                      style={{ marginRight: "15px" }}
                    />{" "}
                    <span>Save</span>
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </StyledManageForm>
        </CardContent>
      </Card>
    </>
  );
};

export default AddComponent;
