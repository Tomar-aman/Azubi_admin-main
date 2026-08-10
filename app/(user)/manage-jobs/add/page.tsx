"use client";
import React, { useState, useEffect, ChangeEvent, useRef } from "react";
import { FormHelperText, 
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  TextField,
  Tooltip,
} from "@mui/material";
import { SVG } from "@/app/components/icon";
import Title from "@/app/components/title.components";
import PhoneNumberField from "@/app/components/phoneNumberField";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useRouter } from "next/navigation";
import { StyledManageForm } from "@/app/components/form.styled";
import { getCity, getRegion } from "@/app/api/city/city";
import { getIndustries } from "@/app/api/industries/industries";
import { TransformIndustry } from "@/app/api/industries/industries.types";
import {
  TransformCity,
  TransformRegionTypeAdd,
} from "@/app/api/city/city.types";
import { TransformRegion } from "@/app/api/regions/regionTypes.types";
import { addJob, getJobDetailById, updateJob } from "@/app/api/jobs/jobs";
import ErrorAlert from "@/themes/overrides/errorAlert";
import CustomLoader from "@/app/components/SpinLoader";
import * as Yup from "yup";
import { useFormik } from "formik";
import TextEditor from "../../manage-content/textEditor/textEditor";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import {
  getCompaniesByCityIdApi,
  getEmployerById,
} from "@/app/api/employer/employer";
import Cropper, { FileState } from "@/app/ulits/cropper";
import { getJobTypes } from "@/app/api/jobTypes/jobType";
import { TransformJobType } from "@/app/api/jobTypes/jobTypes.types";
import { getTrainings } from "@/app/api/training/jobType";
import { getBeginning } from "@/app/api/beginning/jobType";
import { getFederalTypes } from "@/app/api/federal/jobType";
import { AdditionalData, IconWithContent } from "../../manage-employers";
import { v4 } from "uuid";
import dynamic from "next/dynamic";
import { ImageGalleryModal } from "@/app/ulits/imageGallery/ImageGalleryV1";
import FileUploadButton from "@/app/ulits/customInput/customInput";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentElementId } from "@/app/redux/user/userSlice";
import { RootState } from "@/app/redux/store";
import { handleDynamicSetSrc, handleFindImage } from "@/app/ulits/constatnt";
import { X, Image as ImageIcon, Upload } from "lucide-react";

const TextEditorNew = dynamic(
  () => import("../../manage-content/text-editor-new/textEditorNew"),
  { ssr: false }
);
export interface NewJob {
  city?: { id: string; label: string };
  // region?: { id: string; label: string };
  company: { id: string; label: string };
  jobTitle: string;
  startDate: string | null;
  email: string;
  additionalEmail: string;
  website?: string;
  phoneNumber?: string;
  address: string;
  mapUrl?: string;
  zipCode?: string | null;
  jobDescription: string;
  attachments?: any;
  status?: boolean;
  industryName: { id: string; label: string };
  // Multi-select industries. `industryName` (above) is kept as the legacy
  // single value for backward compatibility.
  industries: { id: string; label: string }[];
  // Multi-select job types. `jobType` (below) is kept as the legacy single value.
  jobTypes: { id: string; label: string }[];
  training?: { id: string; label: string };
  federalState?: { id: string; label: string };
  beginning?: { id: string; label: string };
  isDesktopView?: boolean;
  id?: string;
  newCity?: string[];
  region?: string[];
  videoLink?: string[];
  jobsImages?: any;
  removedFile?: any;
  jobType?: any;
  embeddedCode?: "";
  locationField?: any;
  locationUrl?: string;
  oldAttachments: any;
  oldJobImage: string[];
}

export interface NewJobResponse {
  city?: { _id: string; name: string };
  cityDetail?: { _id: string; name: string }[];
  company: { _id: string; companyName: string };
  jobTitle: string;
  regionDetail?: any;
  embeddedCode: string;
  startDate: string | null;
  email: string;
  additionalEmail: string;
  website?: string;
  phoneNumber?: string;
  isDesktopView?: boolean;
  address: string;
  mapUrl?: string;
  zipCode: string;
  jobDescription: string;
  attachments?: any;
  status: boolean;
  training?: { _id: string; name: string };
  federalState?: { _id: string; name: string };
  beginning?: { _id: string; name: string };
  industryName: { _id: string; industryName: string };
  industries?: { _id: string; industryName: string }[];
  jobTypes?: { _id: string; jobTypeName?: string; name?: string }[];
  id?: string;
  videoLink?: string[];
  jobImages?: any;
  jobType?: string | any;
  additionalData?: IconWithContent[];
  locationField?: string;
  locationUrl?: string;
  oldJobImage: string[];
}

export interface Companies {
  _id: string;
  companyName: string;
}

type Documents = {
  _id: string;
  document: {
    _id: string;
    type: string;
    fileName: string;
    filepath: string;
  };
  __v: number;
};
const re =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

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

const AddComponent: React.FC = () => {
  const route = useRouter();
  const dispatch = useDispatch();
  const elementId = useSelector((state: RootState) => state.user.elementId);
  const [city, setCity] = useState<TransformCity[]>([]);
  const [region, setRegion] = useState<TransformRegionTypeAdd[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [companies, setCompanies] = useState<Companies[]>([]);
  const [industries, setIndustries] = useState<TransformIndustry[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [jobId, setJobId] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [action, setAction] = useState<string | boolean>("");
  const [documents, setDocuments] = useState<Documents[]>([]);
  const [deletedDocumentId, setDeletedDocumentId] = useState<string[]>([]);
  const [isCitySet, setIsCitySet] = useState(false);
  const [fileList, setFileList] = useState<FileState[]>([]);
  const [oldFile, setOldFile] = useState<string[]>([]);
  const [jobTypes, setJobTypes] = useState<TransformJobType[]>([]);
  const [training, setTraining] = useState<TransformJobType[]>([]);
  const [federalState, setFederalState] = useState<TransformJobType[]>([]);
  const [beginning, setBeginning] = useState<TransformJobType[]>([]);
  const [isDesktopView, setIsDesktopView] = useState<boolean>(true);
  const [duplicateJobImagesId, setDuplicateJobImagesId] = useState<string[]>(
    []
  );
  const mediaUrls = useSelector((state: RootState) => state?.user?.mediaUrls);
  const validationSchema = Yup.object({
    videoLink: Yup.array().of(Yup.string().required()),
    company: Yup.object().test(
      "isCompany",
      "company name is required",
      (value: any) => {
        if (value.id && value.label) {
          return true;
        }
        return false;
      }
    ),
    jobTitle: Yup.string().required("title is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("email is required"),
    additionalEmail: Yup.string().email("Invalid email address"),
    website: Yup.string(),
    // Phone number is free text: special characters (| \ - etc.) are allowed.
    phoneNumber: Yup.string(),
    address: Yup.string().required("address is required"),
    mapUrl: Yup.string(),
    zipCode: Yup.string().matches(/^[0-9]*$/, "Zip code must be digits only"),
    jobTypes: Yup.array()
      .min(1, "Job Type is required")
      .required("Job Type is required"),
    locationField: Yup.string(),
    locationUrl: Yup.string(),
    jobDescription: Yup.string()
      .min(1, "company Description is required")
      .required("company Description is required"),
    industries: Yup.array()
      .min(1, "industry name is required")
      .required("industry name is required"),
    training: Yup.mixed().nullable().optional(),
    // .test(
    //   "isTraining",
    //   "Training is required",
    //   (value: any) => {
    //     if (!isDesktopView) {
    //       return true;
    //     }
    //     if (value.id && value.label) {
    //       return true;
    //     }
    //     return false;
    //   }
    // ),
    federalState: Yup.mixed().nullable().optional(),
    beginning: Yup.mixed().nullable().optional(),
    // .test(
    //   "beginning",
    //   "Beginning is required",
    //   (value: any) => {
    //     if (!isDesktopView) {
    //       return true;
    //     }
    //     if (value.id && value.label) {
    //       return true;
    //     }
    //     return false;
    //   }
    // ),
    newCity: Yup.array().test("newCity", "city is required", (value: any) => {
      if (value.length) {
        return true;
      }
      return false;
    }),
    embeddedCode: Yup.string(),
    oldAttachments: Yup.string(),
  });
  const formik = useFormik<NewJob>({
    initialValues: {
      newCity: [],
      region: [],
      company: { id: "", label: "Select Company" },
      jobTitle: "",
      startDate: "",
      email: "",
      additionalEmail: "",
      website: "",
      phoneNumber: "",
      address: "",
      mapUrl: "",
      zipCode: "",
      jobDescription: "",
      industryName: { id: "", label: "Select Industry" },
      industries: [],
      jobTypes: [],
      training: { id: "", label: "Select Training" },
      federalState: { id: "", label: "Select Federal State" },
      beginning: { id: "", label: "Select Beginning" },
      videoLink: [],
      jobType: "",
      embeddedCode: "",
      locationField: "Erfahre mehr über uns",
      locationUrl: "",
      oldAttachments: "",
      oldJobImage: [],
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      values.jobsImages = fileList
        .map((item: any) => item.originFileObj)
        .filter(Boolean);
      values.removedFile = oldFile.filter((item) => {
        if (item !== "undefined" && item !== undefined) {
          return item;
        }
      });
      values.jobType = values.jobType;
      try {
        if (jobId && !action) {
          const response = await updateJob(
            {
              ...values,
              id: jobId,
              isDesktopView,
              attachments,
              deletedAttachment: deletedDocumentId,
            },
            state.iconWithContent
          );
          if (response.remote === "success") {
            // Stay on the edit page after saving; just confirm success.
            toast.success("Job updated successfully!");
          } else {
            setError("Something went wrong");
          }
          setIsLoading(false);
        } else {
          if (duplicateJobImagesId.length) {
            values.jobsImages = duplicateJobImagesId;
          }
          const response = await addJob(
            {
              ...values,
              isDesktopView,
              attachments,
            },
            state.iconWithContent
          );
          if (response.remote === "success") {
            window.location.href = "/manage-jobs";
            return;
          }
          setIsLoading(false);
        }
      } catch (error) {
        setIsLoading(false);
      }
    },
  });

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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const handleClearFiles = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Clear the file input
    }
    setAttachments([]); // Clear the attachments state
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

  const getAllCity = async () => {
    const data = await getCity();
    if (data.remote === "success") {
      setCity(data.data.data);
    }
  };

  const getAllRegion = async () => {
    const data = await getRegion();
    if (data.remote === "success") {
      console.log("Region Data--", data.data.data);
      setRegion(data.data.data);
    }
  };

  const getAllIndustries = async () => {
    const data = await getIndustries();
    if (data.remote === "success") {
      setIndustries(data.data.data);
    }
  };

  const deleteDocumentHandler = async (id: string) => {
    setDeletedDocumentId([...deletedDocumentId, id]);
    setDocuments(documents.filter((data) => id !== data._id));
  };
  const getJobByIdHandler = async (id: string) => {
    setIsLoading(true);
    const response = await getJobDetailById(id);
    if (response.remote === "success") {
      setDuplicateJobImagesId(
        response?.data?.data?.jobImages?.map(
          (item: { _id: string; filepath: string }, index: number) => {
            return item._id;
          }
        )
      );
      const newImage = response?.data?.data?.jobImages?.map(
        (item: { _id: string; filepath: string }, index: number) => {
          return {
            name: item.filepath,
            uid: item._id,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + item.filepath,
          };
        }
      );
      setFileList(newImage);

      // Prefill multi-select job types. Prefer the new `jobTypes` array; fall
      // back to the legacy single `jobType` for jobs saved before multi-select.
      const jobTypesData = response?.data?.data?.jobTypes;
      if (Array.isArray(jobTypesData) && jobTypesData.length) {
        formik.setFieldValue(
          "jobTypes",
          jobTypesData.map((item) => ({
            id: item._id,
            label: item.jobTypeName || item.name || "",
          }))
        );
      } else if (response?.data?.data?.jobType) {
        const legacyJobType = response.data.data.jobType;
        formik.setFieldValue("jobTypes", [
          {
            id: legacyJobType?._id || legacyJobType,
            label: legacyJobType?.jobTypeName || legacyJobType?.name || "",
          },
        ]);
      }
      const date = response?.data?.data?.startDate?.split("T")[0];
      const industryValue = response.data.data.industryName;
      if (response.data.data.locationField) {
        formik.setFieldValue("locationField", response.data.data.locationField);
      }
      if (response.data.data.videoLink) {
        formik.setFieldValue("videoLink", response.data.data.videoLink);
      }
      if (response?.data?.data?.additionalData) {
        console.log(response?.data?.data?.additionalData);
        setState({
          iconWithContent:
            response?.data?.data?.additionalData?.flat().map((itm) => ({
              ...itm,
              image: null,
            })) || [],
        });
      }

      if (response?.data?.data?.regionDetail?._id) {
        formik.setFieldValue("region", response.data.data.regionDetail._id);
      }

      formik.setFieldValue(
        "newCity",

        response.data.data.cityDetail?.map((item) => {
          return item?._id;
        })
      );

      formik.setFieldValue("company", {
        id: response.data.data.company._id,
        label: response.data.data.company.companyName,
      });
      formik.setFieldValue("jobTitle", response.data.data.jobTitle);
      formik.setFieldValue("startDate", date);
      formik.setFieldValue(
        "additionalEmail",
        response.data.data.additionalEmail
      );
      formik.setFieldValue("locationUrl", response.data.data.locationUrl || "");
      formik.setFieldValue("email", response.data.data.email);
      formik.setFieldValue("website", response.data.data.website || "");
      formik.setFieldValue(
        "phoneNumber",
        response.data.data.phoneNumber || ""
      );
      formik.setFieldValue("address", response.data.data.address);
      formik.setFieldValue("mapUrl", response.data.data.mapUrl || "");
      formik.setFieldValue("zipCode", response.data.data.zipCode);
      formik.setFieldValue("jobDescription", response.data.data.jobDescription);
      formik.setFieldValue("embeddedCode", response.data.data.embeddedCode);
      // Prefill multi-select industries. Prefer the new `industries` array;
      // fall back to the legacy single `industryName` for older jobs.
      const industriesData = response?.data?.data?.industries;
      if (Array.isArray(industriesData) && industriesData.length) {
        formik.setFieldValue(
          "industries",
          industriesData.map((item) => ({
            id: item._id,
            label: item.industryName,
          }))
        );
      } else if (industryValue?._id) {
        formik.setFieldValue("industries", [
          { id: industryValue._id, label: industryValue.industryName },
        ]);
      }
      setIsDesktopView(response?.data?.data?.isDesktopView || false);
      if (response?.data?.data?.isDesktopView) {
        const { training, federalState, beginning } = response.data.data;
        if (training?._id) {
          formik.setFieldValue("training", {
            id: training?._id,
            label: training?.name,
          });
        }
        if (federalState?._id) {
          formik.setFieldValue("federalState", {
            id: federalState?._id,
            label: federalState?.name,
          });
        }
        if (beginning?._id) {
          formik.setFieldValue("beginning", {
            id: beginning?._id,
            label: beginning?.name,
          });
        }
      }
      setDocuments(response.data.data.attachments);
    }
    setIsLoading(false);
  };
  const handleSkillChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (formik.values.videoLink) {
      const updatedLink = [...formik.values.videoLink];
      updatedLink[index] = event.target.value;
      formik.setValues({ ...formik.values, videoLink: updatedLink });
    }
  };
  const removeSkill = (index: number) => {
    if (formik.values.videoLink) {
      const updatedLink = [...formik.values.videoLink];
      updatedLink.splice(index, 1);
      formik.setValues({ ...formik.values, videoLink: updatedLink });
    }
  };
  const addSkill = () => {
    if (formik.values.videoLink) {
      formik.setValues({
        ...formik.values,
        videoLink: [...formik.values.videoLink, ""],
      });
    }
  };
  const getAllJobTypes = async () => {
    const data = await getJobTypes();
    if (data.remote === "success") {
      setJobTypes(data.data.data);
    }
  };

  const getAllTraining = async () => {
    const data = await getTrainings();
    if (data.remote === "success") {
      setTraining(data.data.data);
    }
  };

  const getAllBeginning = async () => {
    const data = await getBeginning();
    if (data.remote === "success") {
      setBeginning(data.data.data);
    }
  };

  const getAllFederalState = async () => {
    const data = await getFederalTypes();
    if (data.remote === "success") {
      setFederalState(data.data.data);
    }
  };
  const handleSelectedFile = (id: string, file: any) => {
    if (id === "attachment") {
      formik.setFieldValue("oldAttachments", file._id);
    } else if (id === "cropper") {
      setFileList((pre: any) => {
        return [
          ...pre,
          {
            name: file.filepath,
            uid: file._id,
            url: process.env.NEXT_PUBLIC_BACKEND_IMAGE_URL + file.filepath,
          },
        ];
      });
      formik.setFieldValue("oldJobImage", [
        ...formik?.values?.oldJobImage,
        file._id,
      ]);
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
    getAllIndustries();
    getAllCity();
    getAllRegion();
    getAllJobTypes();
    getAllTraining();
    getAllBeginning();
    getAllFederalState();

    const urlSearchParams = new URLSearchParams(window.location.search);
    const id = urlSearchParams.get("id");
    const action = urlSearchParams.get("action");
    if (id) {
      setJobId(id);
      getJobByIdHandler(id);
    }
    if (action) {
      setAction(action);
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

  const getCompaniesByCityId = async (id: string[]) => {
    const response = await getCompaniesByCityIdApi(id);
    if (response.remote === "success") {
      setCompanies(response.data.data);
    }
  };

  const getCompaniesDetailed = async (id: string) => {
    setIsLoading(true);
    const response = await getEmployerById(id);
    if (response.remote === "success") {
      formik.setFieldValue("email", response.data.data.email);
      // Prefill the multi-select industries with the company's own industry.
      const companyIndustry = response.data.data.industryName;
      if (companyIndustry?.id) {
        formik.setFieldValue("industries", [companyIndustry]);
      }
      formik.setFieldValue("address", response.data.data.address);
      formik.setFieldValue("zipCode", response.data.data.zipCode);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    getCompaniesDetailed(formik.values.company.id);
  }, [isCitySet]);
  useEffect(() => {
    console.log("formik.valuesformik.values", formik.values);
  }, [formik.values]);

  return (
    <>
      <Title
        heading={action === "show" ? "Job" : "Add Job"}
        icon={
          <IconButton
            onClick={() => route.push("/manage-jobs")}
            disableRipple={true}
          >
            <SVG.ArrowBack className="svgActive" />
          </IconButton>
        }
      />
      <div style={{ pointerEvents: action === "show" ? "none" : "auto" }}>
        {isLoading && (
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

        <Card sx={{ borderRadius: "10px" }} elevation={0}>
          <CardContent>
            <StyledManageForm>
              <Grid container spacing={2}>
                <Grid item xs={12} lg={2}>
                  <label>is this job available for desktop view</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Checkbox
                    color="success"
                    checked={isDesktopView}
                    onClick={(e) => {
                      setIsDesktopView(!isDesktopView);
                    }}
                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>City</label>
                </Grid>

                <Grid item xs={12} lg={10}>
                  {/* start------ */}
                  <Autocomplete
                    multiple
                    disablePortal={true}
                    disableClearable={true}
                    fullWidth
                    id="combo-box-demo"
                    value={formik.values.newCity?.map((value) => {
                      const newLocation = city.find((city) => {
                        return city.id === value;
                      });
                      return {
                        label: newLocation?.name,
                        id: newLocation?.id,
                      };
                    })}
                    onChange={(e, values) => {
                      const selectedCities = values.map(
                        (item) => item.id || ""
                      );
                      const filteredCities = selectedCities.filter(
                        (city, index, self) => {
                          return (
                            self.indexOf(city) === index &&
                            self.lastIndexOf(city) === index
                          );
                        }
                      );
                      if (filteredCities.length) {
                        getCompaniesByCityId(filteredCities);
                        formik.setFieldValue("newCity", filteredCities);
                        // Keep the already-selected company when changing cities
                        // (don't reset it) — important in edit mode.
                        // formik.setFieldValue("company", { id: "", label: "" });
                      } else {
                        formik.resetForm();
                      }
                    }}
                    options={city?.map((item) => {
                      return { id: item.id, label: item.name };
                    })}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder="Select City" 
                        error={formik.touched.newCity && Boolean(formik.errors.newCity)}
                        helperText={formik.touched.newCity && (formik.errors.newCity as string)}
                      />
                    )}
                  />
                  {/* end------ */}
                </Grid>

                {/* Region field hidden (kept, not removed)
                <Grid item xs={12} lg={2}>
                  <label>Region</label>
                </Grid>

                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    disablePortal
                    disableClearable
                    fullWidth
                    id="combo-box-demo"
                    value={(() => {
                      const selectedRegionId = Array.isArray(
                        formik.values.region
                      )
                        ? formik.values.region[0] // If it's an array, take the first element
                        : formik.values.region; // If it's a single value, use it directly

                      const selectedRegion = region?.find(
                        (region) => region._id === selectedRegionId
                      );
                      return selectedRegion
                        ? {
                            label: selectedRegion.name,
                            id: selectedRegion._id,
                          }
                        : ("" as any); // Return null if no region is selected
                    })()}
                    onChange={(e, value) => {
                      const selectedRegionId = value?.id || "";
                      formik.setFieldValue("region", selectedRegionId); // Set the selected region ID

                      // Optional: If you want to clear the field on selection, you can do this
                      if (!selectedRegionId) {
                        formik.resetForm(); // Resets the form if no region is selected
                      }
                    }}
                    options={
                      region?.map((item) => {
                        return { id: item._id, label: item.name };
                      }) || []
                    } // Ensure options is never undefined
                    getOptionLabel={(option) => option?.label || ""}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder="Select Region" 
                        error={formik.touched.region && Boolean(formik.errors.region)}
                        helperText={formik.touched.region && (formik.errors.region as string)}
                      />
                    )}
                  />
                </Grid>
                */}

                <Grid item xs={12} lg={2}>
                  <label>Company</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    disablePortal={true}
                    disableClearable={true}
                    fullWidth
                    id="combo-box-demo"
                    value={formik.values.company}
                    options={companies?.map((item) => {
                      return { id: item._id, label: item.companyName };
                    })}
                    onChange={(e, value: any) => {
                      if (value) {
                        formik.setFieldValue("company", value);
                        setIsCitySet(!isCitySet);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        label="" 
                        error={formik.touched.company && Boolean(formik.errors.company)}
                        helperText={formik.touched.company && (formik.errors.company as string)}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} lg={2}>
                  <label>Industries</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    multiple
                    disablePortal
                    fullWidth
                    disableClearable={true}
                    id="industries-multi"
                    value={formik.values.industries}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    options={industries?.map((item) => {
                      return { id: item.id, label: item.name };
                    })}
                    onChange={(e, value: any) => {
                      formik.setFieldValue("industries", value || []);
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Select Industries"
                        error={formik.touched.industries && Boolean(formik.errors.industries)}
                        helperText={formik.touched.industries && (formik.errors.industries as string)}
                      />
                    )}
                  />
                </Grid>

                {/* desktop view field  */}
                {isDesktopView && (
                  <>
                    <Grid item xs={12} lg={2}>
                      <label>Training</label>
                    </Grid>
                    <Grid item xs={12} lg={10}>
                      <Autocomplete
                        disablePortal
                        fullWidth
                        disableClearable={false}
                        id="combo-box-demo"
                        value={formik.values.training}
                        options={training?.map((item) => {
                          return { id: item.id, label: item.name };
                        })}
                        onChange={(e, value: any) => {
                          formik.setFieldValue("training", value);
                        }}
                        getOptionLabel={(option) => option?.label || ""}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="" 
                            error={formik.touched.training && Boolean(formik.errors.training)}
                            helperText={formik.touched.training && (formik.errors.training as string)}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                      <label>Federal states</label>
                    </Grid>
                    <Grid item xs={12} lg={10}>
                      <Autocomplete
                        disablePortal
                        fullWidth
                        disableClearable={false}
                        id="combo-box-demo"
                        value={formik.values.federalState}
                        options={federalState?.map((item) => {
                          return { id: item.id, label: item.name };
                        })}
                        onChange={(e, value: any) => {
                          console.log({ value });
                          formik.setFieldValue("federalState", value);
                        }}
                        getOptionLabel={(option) => option?.label || ""}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="" 
                            error={formik.touched.federalState && Boolean(formik.errors.federalState)}
                            helperText={formik.touched.federalState && (formik.errors.federalState as string)}
                          />
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} lg={2}>
                      <label>Beginning</label>
                    </Grid>
                    <Grid item xs={12} lg={10}>
                      <Autocomplete
                        disablePortal
                        fullWidth
                        disableClearable={false}
                        id="combo-box-demo"
                        value={formik.values.beginning}
                        options={beginning?.map((item) => {
                          return { id: item.id, label: item.name };
                        })}
                        onChange={(e, value: any) => {
                          formik.setFieldValue("beginning", value);
                        }}
                        getOptionLabel={(option) => option?.label || ""}
                        renderInput={(params) => (
                          <TextField 
                            {...params} 
                            label="" 
                            error={formik.touched.beginning && Boolean(formik.errors.beginning)}
                            helperText={formik.touched.beginning && (formik.errors.beginning as string)}
                          />
                        )}
                      />
                    </Grid>
                  </>
                )}
                {/* desktop view field  */}

                <Grid item xs={12} lg={2}>
                  <label>Job Title</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder="Project Manager"
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.jobTitle}
                    name="jobTitle"

                    error={formik.touched.jobTitle && Boolean(formik.errors.jobTitle)}

                    helperText={formik.touched.jobTitle && (formik.errors.jobTitle as string)}

                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Starting Date</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    type="date"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.startDate}
                    name="startDate"
                    InputProps={{
                      endAdornment: formik.values.startDate && (
                        <IconButton
                          aria-label="clear start date"
                          onClick={() => formik.setFieldValue("startDate", "")}
                        >
                          X
                        </IconButton>
                      ),
                    }}

                    error={formik.touched.startDate && Boolean(formik.errors.startDate)}

                    helperText={formik.touched.startDate && (formik.errors.startDate as string)}

                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Email Id</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder="Example@xyz.com"
                    type="email"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    name="email"

                    error={formik.touched.email && Boolean(formik.errors.email)}

                    helperText={formik.touched.email && (formik.errors.email as string)}

                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Additional Email</label>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder="Example@xyz.com"
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.additionalEmail}
                    name="additionalEmail"
                    sx={{
                      "& .MuiFormHelperText-root": {
                        marginLeft: "5px",
                        color: "#FFA500",
                        fontWeight: "500",
                      },
                    }}

                    error={formik.touched.additionalEmail && Boolean(formik.errors.additionalEmail)}

                    helperText={formik.touched.additionalEmail && (formik.errors.additionalEmail as string)}

                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Website</label>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder="https://example.com"
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.website}
                    name="website"
                    error={formik.touched.website && Boolean(formik.errors.website)}
                    helperText={formik.touched.website && (formik.errors.website as string)}
                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Phone Number</label>
                </Grid>
                <Grid item xs={10}>
                  <PhoneNumberField
                    name="phoneNumber"
                    value={formik.values.phoneNumber}
                    onChange={(v) => formik.setFieldValue("phoneNumber", v)}
                    onBlur={formik.handleBlur}
                    error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
                    helperText={formik.touched.phoneNumber && (formik.errors.phoneNumber as string)}
                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Address</label>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder=""
                    type="text"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.address}
                    name="address"

                    error={formik.touched.address && Boolean(formik.errors.address)}

                    helperText={formik.touched.address && (formik.errors.address as string)}

                  />
                </Grid>

                {/* job google map url */}
                <Grid item xs={12} lg={2}>
                  <label>Google Map Url</label>
                </Grid>
                <Grid item xs={10}>
                  <TextField
                    placeholder=""
                    type="url"
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.mapUrl}
                    name="mapUrl"

                    error={formik.touched.mapUrl && Boolean(formik.errors.mapUrl)}

                    helperText={formik.touched.mapUrl && (formik.errors.mapUrl as string)}

                  />
                </Grid>
                {/* Location & Location Url fields hidden (kept, not removed) */}
                {false && (
                  <>
                    <Grid item xs={12} lg={2}>
                      <label>Location</label>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        placeholder=""
                        type="url"
                        fullWidth
                        {...formik.getFieldProps("locationField")}
                        error={formik.touched.locationField && Boolean(formik.errors.locationField)}
                        helperText={formik.touched.locationField && (formik.errors.locationField as string)}
                      />
                    </Grid>
                    <Grid item xs={12} lg={2}>
                      <label>Location Url</label>
                    </Grid>
                    <Grid item xs={10}>
                      <TextField
                        placeholder=""
                        type="url"
                        fullWidth
                        {...formik.getFieldProps("locationUrl")}
                      />
                    </Grid>
                  </>
                )}
                <Grid item xs={12} lg={2}>
                  <label>Zip Code</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder=""
                    // Text (not number) so a leading zero isn't stripped
                    // (German zip codes can start with 0, e.g. 01067).
                    type="text"
                    inputProps={{ maxLength: 8, inputMode: "numeric", pattern: "[0-9]*" }}
                    fullWidth
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.zipCode}
                    name="zipCode"

                    error={formik.touched.zipCode && Boolean(formik.errors.zipCode)}

                    helperText={formik.touched.zipCode && (formik.errors.zipCode as string)}

                  />
                </Grid>
                <Grid item xs={12} lg={2}>
                  <label>Job Description</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Box
                    sx={{
                      "& textarea": {
                        width: "100%",
                        height: "80px",
                        resize: "none",
                        borderRadius: "10px",
                        border: "1px solid #646464",
                        fontSize: "16px",
                        fontFamily: "'Poppins', sans-serif",
                        padding: "8px 12px",
                        outline: "none",
                        minHeight: "136px",
                      },
                      "& .ql-container.ql-snow": {
                        height: "230px",
                      },
                    }}
                  >
                    {/* <TextEditor
                      content={`${formik.values.jobDescription}`}
                      disabled={action === "show" ? true : false}
                      setContent={(txt) => {
                        formik.setFieldValue("jobDescription", txt);
                      }}
                    /> */}

                    <TextEditorNew
                      content={`${formik.values.jobDescription}`}
                      disabled={action === "show" ? true : false}
                      setContent={(txt) => {
                        formik.setFieldValue("jobDescription", txt);
                      }}
                    />
                  </Box>
                  {formik.touched.jobDescription && Boolean(formik.errors.jobDescription) && (
                  <FormHelperText error sx={{ ml: 1, mt: 0 }}>{formik.errors.jobDescription as string}</FormHelperText>
                )}
                </Grid>

                <Grid item xs={12} lg={2}>
                  <label>Attachments</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <TextField
                    onClick={(e) => {
                      if (!isOpen) {
                        e.preventDefault();
                      }
                      handleOpenGalleryModel();
                      dispatch(setCurrentElementId("attachment"));
                    }}
                    placeholder="Select files"
                    type="file"
                    id="attachment"
                    fullWidth
                    inputRef={fileInputRef} // Attach the ref to the file input
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        const files = Array.from(e.target.files);
                        setAttachments(files); // Update attachments state with selected files
                      }
                      handleClose();
                    }}
                    inputProps={{ multiple: true }} // Allow multiple file selection
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClearFiles} // Clear files on click
                            edge="end"
                            aria-label="Clear"
                          >
                            <ClearIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                  {/* <FileUploadButton /> */}
                </Grid>

                <Grid item xs={12} lg={2}>
                  <label>YouTube link</label>
                </Grid>
                <Grid item xs={10}>
                  {formik.values.videoLink?.map(
                    (link: string, index: number) => (
                      <>
                        <TextField
                          style={{ marginBottom: "20px" }}
                          placeholder="Embed youtube video link"
                          type="text"
                          fullWidth
                          name={`videoLink[${index}]`}
                          onChange={(event: any) =>
                            handleSkillChange(index, event)
                          }
                          value={link}
                        />
                        {formik.errors.videoLink && Boolean(formik.errors.videoLink[index]) && (
                          <FormHelperText error sx={{ ml: 1, mt: 0 }}>{formik.errors.videoLink[index] as string}</FormHelperText>
                        )}
                        {link ? (
                          <Box sx={{ my: 2 }}>
                            <iframe
                              title="Preview"
                              width="200"
                              height="110"
                              src={getEmbedUrl(link)}
                            ></iframe>
                          </Box>
                        ) : (
                          ""
                        )}
                        <Button
                          size="small"
                          onClick={() => removeSkill(index)}
                          className="outlineBtn"
                          sx={{ marginRight: "15px" }}
                        >
                          remove
                        </Button>
                      </>
                    )
                  )}

                  <Button
                    //  variant="contained"
                    className="modalBtn"
                    size="small"
                    onClick={addSkill}
                  >
                    Add
                  </Button>
                </Grid>

                <Grid item xs={2} sx={{ minHeight: "160px" }}>
                  <label>Job Images</label>
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
                    <span>
                      <Cropper
                        clickable={() => {
                          handleOpenGalleryModel();
                          dispatch(setCurrentElementId("cropper"));
                        }}
                        disabled={!isOpen}
                        fileList={fileList}
                        setFileList={setFileList}
                        setOldFile={setOldFile}
                        aspect={1}
                      />
                    </span>
                  </Box>
                </Grid>

                {/* strat */}

                <Grid item xs={12} lg={2}>
                  <label>Type of job</label>
                </Grid>
                <Grid item xs={12} lg={10}>
                  <Autocomplete
                    multiple
                    disablePortal
                    fullWidth
                    disableClearable={true}
                    id="jobtypes-multi"
                    value={formik.values.jobTypes}
                    isOptionEqualToValue={(option, value) =>
                      option.id === value.id
                    }
                    onChange={(event, value: any) => {
                      formik.setFieldValue("jobTypes", value || []);
                    }}
                    options={jobTypes?.map((item) => {
                      return { id: item.id, label: item.name };
                    })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Type of Job"
                        error={formik.touched.jobTypes && Boolean(formik.errors.jobTypes)}
                        helperText={formik.touched.jobTypes && (formik.errors.jobTypes as string)}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} lg={2}>
                  <label>Embedded Code</label>
                </Grid>

                <Grid item xs={12} lg={10}>
                  <TextField
                    placeholder="Enter Embedded code"
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
                </Grid>

                <Grid item xs={12}>
                  <Button onClick={addAdditionData}>
                    Add additional field
                  </Button>
                </Grid>
                {state.iconWithContent.map((itm:any, idx) => (
                  <>
                    <Grid item xs={5}>
                      <TextField
                        id={itm._id}
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
                          handleClose();
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

                {/* end */}

                <Grid item xs={12}>
                  <Box sx={{ textAlign: "right" }}>
                    <Button
                      // variant="outlined"
                      className="modalBtn"
                      onClick={() => {
                        formik.handleSubmit();
                      }}
                      disabled={action === "show" ? true : false}
                    >
                      <SVG.Save
                        className="svgIcon"
                        style={{ marginRight: "10px" }}
                      />{" "}
                      Save
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </StyledManageForm>
          </CardContent>
        </Card>
      </div>
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
};

export default AddComponent;
