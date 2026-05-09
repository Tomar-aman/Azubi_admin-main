"use client";
import React, { useEffect, useState } from "react";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  FormLabel,
  Grid,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import { useRouter } from "next/navigation";
import { StyledManageForm } from "@/app/components/form.styled";
import {
  BannerFormType,
  EmployerFormType,
} from "@/app/api/employer/employer.types";
import {
  addEmployer,
  getAllEmployers,
  getEmployeesList,
  getEmployerById,
  getJobListByCompanyIdApi,
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
import TextEditor from "../manage-content/textEditor/textEditor";
import Cropper, { FileState } from "@/app/ulits/cropper";
import { DropDown, EmployeesListData } from "@/app/api/employer/helper";
import {
  Banner,
  addBannerApi,
  updateBannerApi,
} from "@/app/api/addBanner/banner";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { TransformJobType } from "@/app/api/jobTypes/jobTypes.types";
import { getJobTypes } from "@/app/api/jobTypes/jobType";

interface PropsType {
  currentEdit?: Banner;
  clearAllState?: () => void;
  setRefresh?: React.Dispatch<React.SetStateAction<boolean>>;
  refresh?: boolean;
}
const AddBanner = ({
  currentEdit,
  clearAllState,
  setRefresh,
  refresh,
}: PropsType) => {
  const re = /^(ftp|http|https):\/\/[^ "]+$/;
  const route = useRouter();
  const [disable, setIsDisable] = useState(false);
  const [id, setId] = useState("");
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [selectedValue, setSelectedValue] = useState(""); //job or link
  const [oldFile, setOldFile] = useState<string[]>([]);
  const [oldImage, setOldImage] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state.user.elementId);
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

    // companyName: Yup.object().test(
    //   "isImage",
    //   "invalid Company",
    //   (value: any) => {
    //     if (value.id && value.label) {
    //       return true;
    //     }
    //     return false;
    //   }
    // ),

    companyName: Yup.object().notRequired(),

    city: Yup.object().test("isCity", "invalid city", (value: any) => {
      if (value.id && value.label) {
        return true;
      }
      return false;
    }),

    typesOfJobs: Yup.object().notRequired(),

    bannerTitle: Yup.string().required("banner title is required"),

    jobUrl: Yup.string()
      // .matches(re, "URL is not valid")
      .test("jobUrl", "url is required", (value: any) => {
        if (!selectedValue) {
          return true;
        }
        if (value && value.length > 0 && selectedValue === "link") {
          return true;
        }
        if (selectedValue === "job") {
          return true;
        }
        return false;
      }),

    job: Yup.object().test("isCity", "invalid job", (value: any) => {
      if (!selectedValue) {
        return true;
      }
      if (value.id && value.label && selectedValue === "job") {
        return true;
      }
      if (selectedValue === "link") {
        return true;
      }
      return false; //false
    }),

    images: Yup.object().test("is_image", (value: any) => {
      if (fileList.length > 0) {
        return true;
      }
      return false;
    }),

    embeddedCode: Yup.string(),
  });
  const formik = useFormik<BannerFormType>({
    initialValues: {
      industryName: { id: "", label: "Select industry" },
      companyName: { id: "", label: "Select company" },
      city: { id: "", label: "Select City" },
      typesOfJobs: { id: "", label: "Select type of job" },
      bannerTitle: "",
      jobUrl: "",
      job: { id: "", label: "select job" },
      embeddedCode: "",
    },
    validationSchema: validationSchema,

    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        if (currentEdit) {
          if (oldFile.length > 0) {
            if (fileList.length > 0) {
              values.images = fileList.map((file) => file.originFileObj);
            }
            values.removeFile = oldFile.filter((item) => {
              if (item !== "undefined" || item !== undefined) {
                return item;
              }
            });
          }
          const payloadData: any = {
            job: values.job.id,
            city: values.city.id,
            companyName: values.companyName.id || "",
            typesOfJobs: values.typesOfJobs.id || "",
            bannerTitle: values.bannerTitle,
            embeddedCode: values.embeddedCode,
            jobUrl: values.jobUrl,
            industry: values.industryName.id,
            images: values.images,
            removeFile: values.removeFile,
            id: currentEdit._id,
          };
          if (oldImage) {
            payloadData.oldImages = oldImage;
          }
          const response = await updateBannerApi(payloadData);
          if (response.remote === "success" && clearAllState && setRefresh) {
            clearAllState();
            setRefresh(!refresh);
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        } else {
          const response = await addBannerApi({
            job: values.job.id,
            jobUrl: values.jobUrl,
            industry: values.industryName.id,
            city: values.city.id,
            companyName: values.companyName.id || "",
            typesOfJobs: values.typesOfJobs.id || "",
            bannerTitle: values.bannerTitle,
            images: fileList.map((file) => file.originFileObj),
            embeddedCode: values.embeddedCode || "",
            oldImages: oldImage ? (oldImage as any) : "",
          });
          if (response.remote === "success" && clearAllState && setRefresh) {
            setIsLoading(false);
            if (clearAllState) {
              clearAllState();
              setRefresh(!refresh);
            }
          } else {
            setIsLoading(false);
          }
        }
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    },
  });
  const [city, setCity] = useState<TransformCity[]>([]);
  const [industries, setIndustries] = useState<TransformIndustry[]>([]);
  const [companies, setCompanies] = useState<EmployeesListData[]>([]);
  const [typesOfJobs, setTypesOfJobs] = useState<TransformJobType[]>([]);
  const [jobs, setJobs] = useState<DropDown[]>([]);
  const [loading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (event: any) => {
    setSelectedValue(event.target.value);
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
  const getAllCompanies = async () => {
    const response = await getEmployeesList();
    if (response.remote === "success") {
      setCompanies(response.data.data as any);
    }
  };
  const getAllTypeOfJobs = async () => {
    const data = await getJobTypes();
    if (data.remote === "success") {
      setTypesOfJobs(data.data.data);
    }
  };

  const handleSelectedFile = (id: string, file: any) => {
    setOldImage(file._id);
    setFileList(() => {
      return [
        {
          name: file.filepath,
          uid: file._id,
          url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + file.filepath,
        },
      ];
    });
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  const getAllJobsByCompanyId = async () => {
    const response = await getJobListByCompanyIdApi(
      formik.values.companyName.id
    );
    if (response.remote === "success") {
      setJobs(response.data.data as any);
    }
  };
  /* not in use now
  const getEmployerDetailByID = async (id: string) => {
    setIsLoading(true);
    const response = await getEmployerById(id);
    if (response.remote === "success") {
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
      formik.setFieldValue("industryName", response.data.data.industryName);
      formik.setFieldValue("contactPerson", response.data.data.contactPerson);
      formik.setFieldValue("jobTitle", response.data.data.jobTitle);
      formik.setFieldValue("companyName", response.data.data.companyName);
      formik.setFieldValue("email", response.data.data.email);
      formik.setFieldValue("website", response.data.data.website);
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
  */
  useEffect(() => {
    getAllCity();
    getAllIndustries();
    getAllCompanies();
    getAllTypeOfJobs();
  }, []);

  useEffect(() => {
    getAllJobsByCompanyId();
  }, [formik.values.companyName.id]);

  /*not in use now */
  useEffect(() => {
    // Get query parameters from the URL
    // const urlSearchParams = new URLSearchParams(window.location.search);
    // const employerId = urlSearchParams.get("id");
    // const newEmployer = urlSearchParams.get("new");
    // if (newEmployer) {
    //   setIsDisable(true);
    // } else {
    //   setIsDisable(false);
    // }
    // if (employerId) {
    //   setId(employerId);
    //   getEmployerDetailByID(employerId);
    // }
  }, []);
  /*not in use now end*/
  const handleOpenGalleryModel = () => {
    setIsOpen(true);
  };
  useEffect(() => {
    if (error) {
      const timeoutId = setTimeout(() => {
        setError("");
      }, 5000); // 5000 milliseconds = 5 seconds

      // Clear the timeout if the component unmounts before the 5 seconds
      return () => clearTimeout(timeoutId);
    }
  }, [error]);

  useEffect(() => {
    if (currentEdit) {
      const newImage = currentEdit.images.map((item) => ({
        name: item.fileName,
        uid: item._id,
        url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + item.path,
      }));
      setFileList(newImage);

      if (currentEdit.jobUrl) {
        setSelectedValue("link");
        formik.setFieldValue("jobUrl", currentEdit.jobUrl);
      } else if (currentEdit.jobs && Object.keys(currentEdit.jobs).length > 0) {
        setSelectedValue("job");
        formik.setFieldValue("job", {
          id: currentEdit.jobs._id,
          label: currentEdit.jobs.jobName,
        });
      } else {
        setSelectedValue("");
      }

      formik.setFieldValue("companyName", {
        id: currentEdit.employers._id,
        label: currentEdit.employers.companyName,
      });
      formik.setFieldValue("city", {
        id: currentEdit.city._id,
        label: currentEdit.city.cityName,
      });
      formik.setFieldValue("industryName", {
        id: currentEdit.industry._id,
        label: currentEdit.industry.jobName,
      });
      if (currentEdit.typesOfJobs) {
        formik.setFieldValue("typesOfJobs", {
          id: currentEdit.typesOfJobs._id,
          label: currentEdit.typesOfJobs.jobTypeName,
        });
      }
      formik.setFieldValue("bannerTitle", currentEdit.bannerTitle);
      formik.setFieldValue("embeddedCode", currentEdit.embeddedCode);
    }
  }, [currentEdit]);
  return (
    <div>
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
        heading={"Add Banner"}
        icon={
          <IconButton
            onClick={() => route.push("/add-banner")}
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
              {/* company Field */}
              <Grid item xs={12} lg={2}>
                <label>Company</label>
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
                  value={formik.values.companyName}
                  options={companies}
                  onChange={(e, value: any) => {
                    if (value) {
                      formik.setFieldValue("companyName", value);
                    }
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="" placeholder="" />
                  )}
                />
                {formik.touched.companyName && formik.errors.companyName && (
                  <div style={{ color: "red" }}>
                    {formik.errors.companyName as string}
                  </div>
                )}
              </Grid>
              {/* company Field End */}
              {/* city field */}
              <Grid item xs={12} lg={2}>
                <label>City</label>
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
              {/* city field End */}
              {/*industry field*/}
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
                  <div style={{ color: "red" }}>industry name is required</div>
                )}
              </Grid>
              {/*industry field end*/}
              {/*typeOfJobs field */}
              <Grid item xs={12} lg={2}>
                <label>Types of Jobs</label>
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
                  value={formik.values.typesOfJobs}
                  options={typesOfJobs?.map((item) => {
                    return { id: item.id, label: item.name };
                  })}
                  onChange={(e, value: any) => {
                    if (value) {
                      formik.values.typesOfJobs.id = value.id;
                      formik.values.typesOfJobs.label = value.label;
                    }
                  }}
                  renderInput={(params) => <TextField {...params} label="" />}
                />
              </Grid>
              {/*typeOfJobs field end */}

              <Grid item xs={12} lg={2}>
                <label>Banner Title</label>
              </Grid>
              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Title of Job"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="bannerTitle"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.bannerTitle}
                />
                {formik.touched.bannerTitle && formik.errors.bannerTitle && (
                  <div style={{ color: "red" }}>
                    {formik.errors.bannerTitle}
                  </div>
                )}
              </Grid>
              <Grid item xs={12} lg={2}>
                <FormLabel component="legend">Job Type</FormLabel>
              </Grid>
              <Grid item xs={12} lg={10}>
                <RadioGroup
                  aria-label="options"
                  name="options"
                  value={selectedValue}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value="job"
                    control={<Radio />}
                    label="Existing Job"
                  />
                  <FormControlLabel
                    value="link"
                    control={<Radio />}
                    label="External Url"
                  />
                </RadioGroup>
              </Grid>
              {selectedValue === "link" && (
                <>
                  <Grid item xs={12} lg={2}>
                    <label>Job Url</label>
                  </Grid>
                  <Grid item xs={12} lg={10}>
                    <TextField
                      placeholder="Job Url"
                      disabled={disable}
                      type="text"
                      fullWidth
                      name="jobUrl"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.jobUrl}
                    />
                    {formik.touched.jobUrl && formik.errors.jobUrl && (
                      <div style={{ color: "red" }}>{formik.errors.jobUrl}</div>
                    )}
                  </Grid>
                </>
              )}
              {selectedValue === "job" && (
                <>
                  <Grid item xs={12} lg={2}>
                    <label>Job</label>
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
                      value={formik.values.job}
                      options={jobs}
                      onChange={(e, value: any) => {
                        if (value) {
                          formik.setFieldValue("job", value);
                        }
                      }}
                      renderInput={(params) => (
                        <TextField {...params} label="" />
                      )}
                    />
                    {formik.touched.job && formik.errors.job && (
                      <div style={{ color: "red" }}>
                        {formik.errors.job as string}
                      </div>
                    )}
                  </Grid>
                </>
              )}

              <Grid item xs={2} sx={{ minHeight: "160px" }}>
                <label>
                  Image <br />
                  <small style={{ fontSize: "0.70em", color: "grey" }}>
                    Preferred size (2480 x 3508)px
                  </small>
                </label>
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
                  <Cropper
                    id="banner-id"
                    clickable={() => {
                      handleOpenGalleryModel();
                      dispatch(setCurrentElementId("banner-id"));
                    }}
                    disabled={disable}
                    fileList={fileList}
                    setFileList={setFileList}
                    setOldFile={setOldFile}
                    maxCount={1}
                    isA4={true}
                  />
                  {formik.errors.images && (
                    <div style={{ color: "red" }}>{formik.errors.images}</div>
                  )}
                </Box>
              </Grid>

              <Grid item xs={12} lg={2}>
                <label>Embedded Code</label>
              </Grid>

              <Grid item xs={12} lg={10}>
                <TextField
                  placeholder="Enter Embedded code"
                  disabled={disable}
                  type="text"
                  fullWidth
                  name="embeddedCode"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.embeddedCode}
                />
                {formik.values.embeddedCode && (
                  <div>
                    <h2>Preview</h2>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: formik.values.embeddedCode,
                      }}
                    />
                  </div>
                )}
                {/* {formik.touched.bannerTitle && formik.errors.bannerTitle && (
                  <div style={{ color: "red" }}>
                    {formik.errors.bannerTitle}
                  </div>
                )} */}
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ textAlign: "right" }}>
                  <Button
                    // variant="outlined"
                    className="modalBtn"
                    disabled={disable}
                    onClick={() => {
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
    </div>
  );
};

export default AddBanner;
