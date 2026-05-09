"use client";
import React, { useEffect, useState } from "react";

import {
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
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
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
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { handleFindImage } from "@/app/ulits/constatnt";
import ClearIcon from "@mui/icons-material/Clear";
const TextEditorNew = dynamic(
  () => import("../../manage-content/text-editor-new/textEditorNew"),
  { ssr: false }
);
const AddComponent = () => {
  const re =
    /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;
  const route = useRouter();
  const [disable, setIsDisable] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [id, setId] = useState("");
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [oldFile, setOldFile] = useState<string[]>([]);
  const [companyLogoPath, setCompanyLogoPath] = useState<FileState[]>([]);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state?.user?.elementId);
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
      phoneNo: "+49",
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
      values.companyImages = fileList.map((item: any) => {
        return item.originFileObj;
      });
      values.removedFile = oldFile.filter((item) => {
        if (item !== "undefined" || item !== undefined) {
          return item;
        }
      });
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
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
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
  const handleSelectedFile = (id: string, file: any) => {
    if (id === "companyLogo") {
      formik.setFieldValue("oldCompanyLogo", file._id);
      setCompanyLogoPath((pre: any) => {
        return [
          {
            name: file.filepath,
            uid: file._id,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + file.filepath,
          },
        ];
      });
    } else if (id === "oldCompanyImages") {
      formik.setFieldValue("oldCompanyImages", [
        ...(formik.values.oldCompanyImages as string[]),
        file._id as string,
      ]);
      setFileList((pre: any) => {
        return [
          ...pre,
          {
            name: file.filepath,
            uid: file._id + 1,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + file.filepath,
          },
        ];
      });
    } else {
      setState({
        ...state,
        //@ts-ignore
        iconWithContent: state.iconWithContent.map((acc, idx) =>
          acc._id === id ? { ...acc, oldImage: file._id } : acc
        ),
      });
    }

    handleClose();
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
                  renderInput={(params) => <TextField {...params} label="" />}
                />
                {formik.touched.industryName && formik.errors.industryName && (
                  <div style={{ color: "red" }}>
                    {formik.errors.industryName as string}
                  </div>
                )}
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
                />
                {formik.touched.contactPerson &&
                  formik.errors.contactPerson && (
                    <div style={{ color: "red" }}>
                      {formik.errors.contactPerson}
                    </div>
                  )}
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
                />
                {formik.touched.jobTitle && formik.errors.jobTitle && (
                  <div style={{ color: "red" }}>{formik.errors.jobTitle}</div>
                )}
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
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div style={{ color: "red" }}>
                    {formik.errors.companyName}
                  </div>
                )}
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
                />
                {formik.touched.email && formik.errors.email && (
                  <div style={{ color: "red" }}>{formik.errors.email}</div>
                )}
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
                />
                {formik.touched.website && formik.errors.website && (
                  <div style={{ color: "red" }}>{formik.errors.website}</div>
                )}
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
                />
                {formik.touched.mapUrl && formik.errors.mapUrl && (
                  <div style={{ color: "red" }}>{formik.errors.mapUrl}</div>
                )}
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
                />
                {formik.touched.locationUrl && formik.errors.locationUrl && (
                  <div style={{ color: "red" }}>
                    {formik.errors.locationUrl}
                  </div>
                )}
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Phone No.</label>
              </Grid>
              <Grid item xs={10}>
                <PhoneInput
                  regions={"europe"}
                  disabled={disable}
                  showDropdown={false}
                  placeholder="Enter phone number"
                  onChange={(value, countrydata, event) => {
                    console.log({ value });
                    const temp = value.slice(2);
                    formik.setFieldValue("phoneNo", temp);
                    event.target.value = "+49" + temp;
                  }}
                  countryCodeEditable={false}
                  onBlur={(e) => {
                    e.target.name = "phoneNo";
                    formik.handleBlur(e);
                  }}
                  value={id ? "+49" + formik.values.phoneNo : "+49"}
                  onlyCountries={["de"]} // Allow only Germany
                />
                {formik.touched.phoneNo && formik.errors.phoneNo && (
                  <div style={{ color: "red" }}>{formik.errors.phoneNo}</div>
                )}
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
                />
                {formik.touched.address && formik.errors.address && (
                  <div style={{ color: "red" }}>{formik.errors.address}</div>
                )}
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
                />
                {formik.touched.zipCode && formik.errors.zipCode && (
                  <div style={{ color: "red" }}>{formik.errors.zipCode}</div>
                )}
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
                  renderInput={(params) => <TextField {...params} label="" />}
                />
                {formik.touched.city && formik.errors.city && (
                  <div style={{ color: "red" }}>city is required</div>
                )}
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>Company Logo</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <span>
                  <Cropper
                    id="companyLogo"
                    fileList={companyLogoPath || []}
                    clickable={() => {
                      handleOpenGalleryModel();
                      dispatch(setCurrentElementId("companyLogo"));
                    }}
                    setFileList={(fileList: any) => {
                      setCompanyLogoPath(fileList);
                      if (fileList[0]?.originFileObj) {
                        formik.setFieldValue(
                          "companyLogo",
                          fileList[0]?.originFileObj
                        );
                      } else {
                        formik.setFieldValue("companyLogo", []);
                      }
                    }}
                    setOldFile={(data) => console.log("Old file:", data)}
                    disabled={!isOpen}
                    maxCount={1} // Example max count
                    isA4={false}
                  />
                </span>

                {/* <TextField
                  placeholder="576557"
                  disabled={disable}
                  type="file"
                  fullWidth
                  helperText="recommend size 250x250px"
                  name="companyLogo"
                  onChange={(e: any) => {
                    formik.setFieldValue(
                      "companyLogo",
                      e.target.files![0] || null
                    );
                  }}
                /> */}
                {formik.touched.companyLogo && formik.errors.companyLogo && (
                  <div style={{ color: "red" }}>CompanyLogo is Required</div>
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
                {formik.touched.companyDescription &&
                  formik.errors.companyDescription && (
                    <div style={{ color: "red" }}>
                      {formik.errors.companyDescription}
                    </div>
                  )}
              </Grid>
              <Grid item xs={2} sx={{ minHeight: "160px" }}>
                <label>Company Images</label>
              </Grid>
              <Grid item xs={10}>
                {" "}
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
                  {" "}
                  <span>
                    <Cropper
                      clickable={() => {
                        handleOpenGalleryModel();
                        dispatch(setCurrentElementId("oldCompanyImages"));
                      }}
                      id="oldCompanyImages"
                      disabled={!isOpen}
                      fileList={fileList}
                      setFileList={setFileList}
                      setOldFile={setOldFile}
                    />
                  </span>
                </Box>
              </Grid>
              <Grid item xs={12} lg={2}>
                <label>YouTube link</label>
              </Grid>
              <Grid item xs={10}>
                {formik.values.videoLink.map((link, index) => (
                  <>
                    <TextField
                      style={{ marginBottom: "20px" }}
                      disabled={disable}
                      placeholder="Embed youtube video link"
                      type="text"
                      fullWidth
                      name={`videoLink[${index}]`}
                      onChange={(event: any) => handleSkillChange(index, event)}
                      value={link}
                    />
                    {formik.errors.videoLink &&
                      formik.errors.videoLink[index] && (
                        <div style={{ color: "red" }}>
                          {formik.errors.videoLink[index]}
                        </div>
                      )}
                    {link ? (
                      <Box sx={{ my: 2 }}>
                        <iframe
                          title="Preview"
                          width="200"
                          height="110"
                          src={link}
                        ></iframe>
                      </Box>
                    ) : (
                      ""
                    )}
                    <Button
                      size="small"
                      onClick={() => removeSkill(index)}
                      disabled={disable}
                      // variant="outlined"
                      className="outlineBtn"
                      sx={{ marginRight: "15px" }}
                    >
                      remove
                    </Button>
                  </>
                ))}

                <Button
                  // variant="contained"
                  className="modalBtn"
                  size="small"
                  onClick={addSkill}
                  disabled={disable}
                >
                  Add
                </Button>
              </Grid>
              {/* ---------------video field----------------- */}
              <Grid item xs={12}>
                <Button onClick={addAdditionData}>Add additional field</Button>
              </Grid>
              {state.iconWithContent.map((itm:any, idx) => (
                <>
                  <Grid item xs={5}>
                    <TextField
                      id={itm._id}
                      // disabled={!isOpen}
                      type="file"
                      fullWidth
                      name="image"
                      onClick={(e: any) => {
                        if (!isOpen) {
                          e.preventDefault();
                        }
                        handleOpenGalleryModel();
                        dispatch(setCurrentElementId(e.target.id));
                      }}
                      onChange={(e) => {
                        handleChangeForArrayType(
                          e as any,
                          idx,
                          "iconWithContent"
                        );
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={(e) => {
                                e.stopPropagation();
                                setState({
                                  ...state,
                                  iconWithContent: state.iconWithContent.map((item: any, index) =>
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
                  <Grid item xs={5}>
                    <TextField
                      placeholder="Enter text"
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
                    />
                  </Grid>
                  <Grid item xs={2}>
                    {" "}
                    <Button onClick={() => deleteAdditionData(itm._id)}>
                      delete
                    </Button>
                  </Grid>
                </>
              ))}

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

export default AddComponent;
